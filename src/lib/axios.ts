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

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get token from sessionStorage
    if (typeof window !== 'undefined') {
      let token = sessionStorage.getItem('auth-token');
      
      // If no token in sessionStorage, try Supabase session
      if (!token) {
        try {
          const supabase = createClient();
          const { data } = await supabase.auth.getSession();
          if (data.session?.access_token) {
            token = data.session.access_token;
            // Optionally sync back to sessionStorage
            sessionStorage.setItem('auth-token', token);
          }
        } catch (e) {
          // Ignore error, continue without token or let it fail
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

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  // (error) => {
  //   // Handle 401 Unauthorized - redirect to login
  //   if (error.response?.status === 401) {
  //     if (typeof window !== 'undefined') {
  //       sessionStorage.removeItem('user-session');
  //       sessionStorage.removeItem('auth-token');
  //       window.location.href = '/auth/login';
  //     }
  //   }
  //   return Promise.reject(error);
  // }
);

export default axiosInstance;
