import axios from 'axios';
import { createClient } from './supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://edvios-be.vercel.app';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Notify all subscribers with the new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Add a subscriber to the refresh queue
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to refresh the token using Supabase
const refreshToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error || !data.session?.access_token) {
      console.error('Token refresh failed:', error);
      // Clear invalid session
      sessionStorage.removeItem('auth-token');
      sessionStorage.removeItem('user-session');
      return null;
    }
    
    const newToken = data.session.access_token;
    sessionStorage.setItem('auth-token', newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      let token = sessionStorage.getItem('auth-token');
      
      // If no token in sessionStorage, try Supabase session
      if (!token) {
        try {
          const supabase = createClient();
          const { data } = await supabase.auth.getSession();
          if (data.session?.access_token) {
            token = data.session.access_token;
            sessionStorage.setItem('auth-token', token);
          }
        } catch (e) {
          console.error('Error retrieving Supabase session:', e);
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (typeof window === 'undefined') {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        
        const newToken = await refreshToken();
        isRefreshing = false;

        if (newToken) {
          // Notify all waiting requests with the new token
          onTokenRefreshed(newToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          // Token refresh failed - redirect to login
          sessionStorage.removeItem('user-session');
          sessionStorage.removeItem('auth-token');
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }
      }

      // If already refreshing, wait for the new token
      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
