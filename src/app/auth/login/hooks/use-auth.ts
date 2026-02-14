import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginFormData, RegisterFormData } from "../types";
import AppToast from "@/utils/toast-utils";
import { UserTypeEnum } from "../enums/auth.enum";
import { signIn, signUp, createUser } from "../api/auth.api";
import {
  LoginRequestDto,
  SignUpRequestDto,
  CreateUserRequestDto,
} from "../dtos/auth.dto";
import { createClient } from "@/lib/supabase/client";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (loginData: LoginFormData): Promise<boolean> => {
    if (!loginData.email) {
      AppToast.error("Please enter your email");
      return false;
    } else if (!loginData.password) {
      AppToast.error("Please enter your password");
      return false;
    }

    setIsLoading(true);
    try {
      const loginRequest: LoginRequestDto = {
        email: loginData.email,
        password: loginData.password,
        role: loginData.role as UserTypeEnum,
      };

      const response = await signIn(loginRequest);

      if (!response.success) {
        AppToast.error(response.message);
        return false;
      }

      // Check if user is a pending agent
      const userSession = typeof window !== 'undefined'
        ? sessionStorage.getItem('user-session')
        : null;

      if (userSession) {
        const userData = JSON.parse(userSession);

        // If the user is a pending agent, redirect to pending approval page
        if (userData.role === UserTypeEnum.PENDING_AGENT) {
          AppToast.info("Your account is pending admin approval");
          router.replace("/pending-approval");
          router.refresh();
          return true;
        }

        // If the user is partially registered, redirect to respective registration page
        if (userData.role === UserTypeEnum.PARTIAL_REGISTER_STUDENT) {
          router.replace("/student-registration");
          router.refresh();
          return true;
        }

        if (userData.role === UserTypeEnum.PARTIAL_REGISTER_AGENT) {
          router.replace("/agent-registration");
          router.refresh();
          return true;
        }
      }

      AppToast.success("Successfully logged in");

      if (loginData.role === UserTypeEnum.STUDENT) {
        router.replace("/dashboard/student");
      } else if (loginData.role === UserTypeEnum.AGENT) {
        router.replace("/dashboard/agent");
      } else if (loginData.role === UserTypeEnum.ADMIN) {
        router.replace("/dashboard/admin");
      }
      router.refresh();

      return true;
    } catch (error) {
      AppToast.error("An unexpected error occurred");
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (
    registerData: RegisterFormData,
  ): Promise<boolean> => {
    if (
      !registerData.firstName ||
      !registerData.lastName ||
      !registerData.email ||
      !registerData.password
    ) {
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
    let signUpSuccessful = false;

    try {
      const roleForRegistration =
        registerData.role === UserTypeEnum.AGENT
          ? UserTypeEnum.PARTIAL_REGISTER_AGENT
          : UserTypeEnum.PARTIAL_REGISTER_STUDENT;

      const signUpRequest: SignUpRequestDto = {
        email: registerData.email,
        password: registerData.password,
        role: roleForRegistration,
      };

      const signUpResponse = await signUp(signUpRequest);

      if (!signUpResponse.success || !signUpResponse.accessToken) {
        AppToast.error(signUpResponse.message);
        return false;
      }

      signUpSuccessful = true;
      const createUserRequest: CreateUserRequestDto = {
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        role: roleForRegistration,
        phone: registerData.phone,
      };


      const createUserResponse = await createUser(
        createUserRequest,
        signUpResponse.accessToken,
      );

      if (!createUserResponse.success) {
        // Rollback: Sign out the Supabase user since backend creation failed
        try {
          const { error: signOutError } = await supabase.auth.signOut();
          if (signOutError) {
            console.error("Failed to sign out during rollback:", signOutError);
          } else {

          }
        } catch (rollbackError) {
          console.error("Failed to rollback Supabase session:", rollbackError);
        }

        AppToast.error(createUserResponse.message);
        return false;
      }

      AppToast.success("Registration successful. Please verify your email.");
      router.replace(`/auth/verify-request?email=${encodeURIComponent(registerData.email)}`);

      // Trigger router navigation
      router.refresh();

      return true;
    } catch (error) {
      // Rollback Supabase signup if an unexpected error occurred after signup
      if (signUpSuccessful) {
        try {
          const { error: signOutError } = await supabase.auth.signOut();
          if (!signOutError) {

          }
        } catch (rollbackError) {
          console.error("Failed to rollback Supabase session:", rollbackError);
        }
      }

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
    isLoading,
  };
};

export const useLoginForm = () => {
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    role: UserTypeEnum.STUDENT,
  });

  const updateLoginData = (field: keyof LoginFormData, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setLoginData({
      email: "",
      password: "",
      role: UserTypeEnum.STUDENT,
    });
  };

  return {
    loginData,
    setLoginData,
    updateLoginData,
    resetForm,
  };
};

export const useRegisterForm = () => {
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: UserTypeEnum.STUDENT,
    phone: "",
  });

  const updateRegisterData = (field: keyof RegisterFormData, value: string) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setRegisterData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserTypeEnum.STUDENT,
      phone: "",
    });
  };

  return {
    registerData,
    setRegisterData,
    updateRegisterData,
    resetForm,
  };
};
