import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginFormData, RegisterFormData, UserData } from "../types";
import { loginApi, registerApi } from "../api/auth.api";
import AppToast from "@/utils/toast-utils";
import { UserTypeEnum } from "../enums/auth.enum";

export const useAuth = (onLogin?: (userType: string, userData: UserData) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (loginData: LoginFormData): Promise<boolean> => {
    if (!loginData.email || !loginData.password) {
      AppToast.error("Please fill in all required fields");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await loginApi({
        email: loginData.email,
        password: loginData.password,
        userType: loginData.userType
      });

      if (response.success && response.data) {
        AppToast.success(response.message);
        onLogin?.(loginData.userType, response.data);
        
        // Navigate to the appropriate dashboard based on user type
        if (loginData.userType === UserTypeEnum.STUDENT) {
          router.push("/dashboard/student");
        } else if (loginData.userType === UserTypeEnum.AGENT) {
          router.push("/dashboard/agent");
        } else if (loginData.userType === UserTypeEnum.SUPERADMIN) {
          router.push("/dashboard/super-admin");
        }
        
        return true;
      } else {
        AppToast.error(response.message);
        return false;
      }
    } catch (error) {
      AppToast.error("An unexpected error occurred");
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (registerData: RegisterFormData): Promise<boolean> => {
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password) {
      AppToast.error("Please fill in all required fields");
      return false;
    }

    if (registerData.password !== registerData.confirmPassword) {
      AppToast.error("Passwords do not match");
      return false;
    }

    if (registerData.password.length < 6) {
      AppToast.error("Password must be at least 6 characters long");
      return false;
    }

    setIsLoading(true);
    try {
      const response = await registerApi({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
        userType: registerData.userType,
        phone: registerData.phone,
        organization: registerData.organization
      });

      if (response.success && response.data) {
        AppToast.success(`${response.message}! Welcome, ${response.data.name}`);
        onLogin?.(registerData.userType, response.data);
        
        // Navigate to the appropriate dashboard based on user type
        if (registerData.userType === UserTypeEnum.STUDENT) {
          router.push("/dashboard/student");
        } else if (registerData.userType === UserTypeEnum.AGENT) {
          router.push("/dashboard/agent");
        } else if (registerData.userType === UserTypeEnum.SUPERADMIN) {
          router.push("/dashboard/super-admin");
        }
        
        return true;
      } else {
        AppToast.error(response.message);
        return false;
      }
    } catch (error) {
      AppToast.error("An unexpected error occurred");
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    handleRegister,
    isLoading
  };
};

export const useLoginForm = () => {
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    userType: UserTypeEnum.STUDENT
  });

  const updateLoginData = (field: keyof LoginFormData, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const setDemoCredentials = (userType: string) => {
    if (userType === UserTypeEnum.SUPERADMIN) {
      setLoginData({
        email: "superadmin@globalguidance.com",
        password: "password123",
        userType: UserTypeEnum.SUPERADMIN as "super-admin"
      });
    } else {
      setLoginData({
        email: `demo.${userType}@edvios.com`,
        password: "demo123",
        userType: userType as "student" | "agent" | "super-admin"
      });
    }
  };

  const resetForm = () => {
    setLoginData({
      email: "",
      password: "",
      userType: UserTypeEnum.STUDENT
    });
  };

  return {
    loginData,
    setLoginData,
    updateLoginData,
    setDemoCredentials,
    resetForm
  };
};

export const useRegisterForm = () => {
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: UserTypeEnum.STUDENT,
    phone: "",
    organization: ""
  });

  const updateRegisterData = (field: keyof RegisterFormData, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setRegisterData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: UserTypeEnum.STUDENT,
      phone: "",
      organization: ""
    });
  };

  return {
    registerData,
    setRegisterData,
    updateRegisterData,
    resetForm
  };
};
