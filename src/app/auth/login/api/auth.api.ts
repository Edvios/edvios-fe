import { LoginRequestDto, RegisterRequestDto } from "../dtos/auth.dto";
import { AuthResponse } from "../types";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate user ID
const generateUserId = (userType: string): string => {
  const prefix = userType.toUpperCase().substring(0, 3);
  const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${number}`;
};

// Get default user name based on user type
const getDefaultUserName = (userType: string, email: string): string => {
  const emailPrefix = email.split('@')[0];
  switch (userType) {
    case "student":
      return "Student " + emailPrefix;
    case "agent":
      return "Agent " + emailPrefix;
    case "super-admin":
      return "Super Admin EDVIOS";
    default:
      return emailPrefix;
  }
};

/**
 * Mock API call for user login
 */
export const loginApi = async (data: LoginRequestDto): Promise<AuthResponse> => {
  try {
    // Simulate network delay
    await delay(1000);

    // Mock validation
    if (!data.email || !data.password) {
      return {
        success: false,
        message: "Email and password are required"
      };
    }

    // Simulate successful login
    const mockToken = 'demo-token-' + Date.now();
    const userId = generateUserId(data.userType);
    const userName = getDefaultUserName(data.userType, data.email);

    const userData = {
      email: data.email,
      userType: data.userType,
      name: userName,
      id: userId,
      loginTime: new Date().toISOString()
    };

    // Store in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user-session', JSON.stringify(userData));
      sessionStorage.setItem('auth-token', mockToken);
    }

    return {
      success: true,
      message: "Login successful",
      data: userData,
      token: mockToken
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred during login"
    };
  }
};

/**
 * Mock API call for user registration
 */
export const registerApi = async (data: RegisterRequestDto): Promise<AuthResponse> => {
  try {
    // Simulate network delay
    await delay(1500);

    // Mock validation
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return {
        success: false,
        message: "All required fields must be filled"
      };
    }

    // Simulate email already exists check (mock)
    if (data.email === "existing@example.com") {
      return {
        success: false,
        message: "Email already exists"
      };
    }

    // Simulate successful registration
    const mockToken = 'demo-token-' + Date.now();
    const userId = generateUserId(data.userType);
    const userName = `${data.firstName} ${data.lastName}`;

    const userData = {
      email: data.email,
      userType: data.userType,
      name: userName,
      id: userId,
      phone: data.phone,
      organization: data.organization,
      registrationTime: new Date().toISOString()
    };

    // Store in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user-session', JSON.stringify(userData));
      sessionStorage.setItem('auth-token', mockToken);
    }

    return {
      success: true,
      message: "Registration successful",
      data: userData,
      token: mockToken
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred during registration"
    };
  }
};

/**
 * Mock API call for logout
 */
export const logoutApi = async (): Promise<{ success: boolean }> => {
  await delay(300);
  
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('user-session');
    sessionStorage.removeItem('auth-token');
  }

  return { success: true };
};
