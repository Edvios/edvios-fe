"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserTypeToggle } from "@/app/auth/login/components/toggle";
import { Lock, Mail, LogIn, UserPlus, Phone } from "lucide-react";
import { useAuth, useLoginForm, useRegisterForm } from "./hooks/use-auth";
import { AuthTabEnum, UserTypeEnum } from "./enums/auth.enum";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<string>(AuthTabEnum.LOGIN);
  const [showPassword, setShowPassword] = useState(false);

  const { loginData, updateLoginData } = useLoginForm();
  const { registerData, updateRegisterData } = useRegisterForm();
  const { handleLogin, handleRegister, isLoading } = useAuth();

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(loginData);
  };

  const onSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister(registerData);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="shadow-2xl border-gray-200 overflow-hidden p-0">
          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center pt-4">
            <img src="/logo.png" alt="Edvios Logo" className="h-30 w-auto" />
          </div>

          <div className="grid md:grid-cols-2 md:min-h-[600px]">
            {/* Left Side - Branding */}
            <div 
              className="hidden md:flex  flex-col justify-center items-start text-white bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: activeTab === AuthTabEnum.LOGIN ? 'url(/loginbg.png)' : 'url(/registerbg.png)',
              }}
            >
            </div>

            {/* Right Side - Login/Register Form */}
            <div className="p-4 md:p-12 flex flex-col md:justify-center">
              <CardHeader className="text-center pb-4 px-0 pt-0 md:pt-4 md:pb-0">
                <CardTitle className="text-2xl text-gradient">Welcome Back</CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-6">
                  {/* Auth Toggle */}
                  <UserTypeToggle
                    options={[AuthTabEnum.LOGIN, AuthTabEnum.REGISTER]}
                    value={activeTab}
                    onChange={setActiveTab}
                    disabled={isLoading}
                  />

                  {/* Login Form */}
                  {activeTab === AuthTabEnum.LOGIN && (
                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => updateLoginData("email", e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => updateLoginData("password", e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                        disabled={isLoading}
                      >
                      </button>
                    </div>
                  </div>

                  <Button 
                    onClick={onSubmitLogin}
                    className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient" 
                    disabled={isLoading}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              )}

              {/* Register Form */}
              {activeTab === AuthTabEnum.REGISTER && (
                <div className="space-y-4">
                  {/* User Type Toggle */}
                  <UserTypeToggle
                    options={[UserTypeEnum.STUDENT, UserTypeEnum.AGENT]}
                    value={registerData.role}
                    onChange={(value) => updateRegisterData("role", value)}
                    disabled={isLoading}
                    label="Register as"
                  />

                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstname" className="text-gray-700 font-medium">First Name</Label>
                      <Input
                        id="register-firstname"
                        placeholder="First name"
                        value={registerData.firstName}
                        onChange={(e) => updateRegisterData("firstName", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-lastname" className="text-gray-700 font-medium">Last Name</Label>
                      <Input
                        id="register-lastname"
                        placeholder="Last name"
                        value={registerData.lastName}
                        onChange={(e) => updateRegisterData("lastName", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => updateRegisterData("email", e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="text-gray-700 font-medium">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-phone"
                        placeholder="Enter your phone number"
                        value={registerData.phone}
                        onChange={(e) => updateRegisterData("phone", e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => updateRegisterData("password", e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors"
                        disabled={isLoading}
                      >
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-gray-700 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => updateRegisterData("confirmPassword", e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={onSubmitRegister}
                    className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient" 
                    disabled={isLoading}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              )}
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2026 Edvios. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}