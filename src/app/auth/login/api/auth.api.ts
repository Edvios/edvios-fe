import { AuthRequestDto, AuthResponseDto, CreateUserRequestDto, CreateUserResponseDto, SignUpRequestDto, SignUpResponseDto } from "../dtos/auth.dto";
import { createClient } from '@/lib/supabase/client'
import axiosInstance from '@/lib/axios';
import axios from 'axios';

const getSupabase = () => createClient()


/**
 * API call for user login - Signs in with Supabase and fetches user data from backend
 */
export const signIn = async (data: AuthRequestDto): Promise<AuthResponseDto> => {
  const supabase = getSupabase();
  try {
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      return {
        success: false,
        message: signInError.message
      };
    }

    if (!authData.session?.access_token) {
      return {
        success: false,
        message: "Failed to Authenticate"
      };
    }

    // Fetch user data from backend
    try {
      // Store token first so interceptor can use it
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth-token', authData.session.access_token);
      }

      const response = await axiosInstance.get('/auth/me');

      const userData = {
        ...response.data,
        email: data.email,
        loginTime: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user-session', JSON.stringify(userData));
        sessionStorage.setItem('auth-token', authData.session.access_token);
      }

      return {
        success: true,
        message: "Login successful",
      };
    } catch (apiError) {
      console.error('Failed to fetch user data:', apiError);
      return {
        success: false,
        message: axios.isAxiosError(apiError) ? apiError.response?.data?.message || "Failed to fetch user data" : "An error occurred while fetching user data"
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred during login"
    };
  }
};

export const signUp = async (data: SignUpRequestDto): Promise<SignUpResponseDto> => {
  const supabase = getSupabase();
  const email = data.email;
  const password = data.password;
  const role = data.role;
  try {
    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role || 'STUDENT'
          }
        }
      })
    
    if (error) {
      return {
        success: false,
        message: error.message,
        accessToken: null
      };
    }

    if (!authData.session?.access_token) {
      return {
        success: false,
        message: "Failed to get access token",
        accessToken: null
      };
    }

    return {
      success: true,
      message: "Sign up successful",
      accessToken: authData.session.access_token
    };

  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred during sign up",
      accessToken: null
    };
  }
};

/**
 * API for user registration - Creates user in backend after Supabase signup
 * @param data - User registration data including token from signUp
 * @param token - Access token from Supabase signUp response
 */ 
export const createUser = async (data: CreateUserRequestDto, token: string): Promise<CreateUserResponseDto> => {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('auth-token', token);
    }

    const response = await axiosInstance.post('/auth/create-user', data);

    const responseData = response.data;

    if (typeof window !== 'undefined') {
      const userSession = {
        ...responseData,
        email: data.email,
        role: data.role,
        registrationTime: new Date().toISOString()
      };
      sessionStorage.setItem('user-session', JSON.stringify(userSession));
      sessionStorage.setItem('auth-token', token);
    }

    return {
      success: true,
      message: "Registration successful",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: axios.isAxiosError(error) ? error.response?.data?.message || error.message : "An error occurred during creating user"
    };
  }
};

/**
 * API call for logout - Signs out from Supabase and clears session
 */
export const logoutApi = async (): Promise<AuthResponseDto> => {
  const supabase = getSupabase();
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Supabase signout error:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }

    // Clear local session storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user-session');
      sessionStorage.removeItem('auth-token');
    }

    return { 
        success: true, 
        message: "Successfully logged out" 
      };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      message: 'An error occurred during logout' 
    };
  }
};
