"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserTypeToggle } from "@/app/auth/login/components/toggle";
import { Lock, Mail, Eye, EyeOff, LogIn, UserPlus, Phone } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="shadow-2xl border-gray-200 overflow-hidden p-0">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            {/* Left Side - Branding */}
            <div 
              className="p-12 flex flex-col justify-center items-start text-white bg-cover bg-center bg-no-repeat relative"
              style={{
                backgroundImage: 'url(/loginbg.jpg)',
              }}
            >
             
              
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center bg-orange-gradient backdrop-blur-sm shadow-lg ring-4 ring-white/20">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3L1 9l11 6 11-6L12 3z" fill="white" />
                      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white" />
                      <circle cx="12" cy="9" r="1.5" fill="white" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-4xl text-white font-semibold tracking-wide">Edvios</p>
                    <p className="text-lg text-white font-semibold tracking-wide">Educational Visionaries</p>
                  </div>
                </div>
                <p className="text-xl text-white/90 font-medium mt-8">
                  Access your personalized education portal
                </p>
                <div className="mt-12 space-y-4 text-white/80">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
                    <p>Connect with students and educational opportunities</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
                    <p>Manage your educational journey seamlessly</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-white mt-2"></div>
                    <p>Join our community of learners and educators</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login/Register Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <CardHeader className="text-center pb-6 px-0">
                <CardTitle className="text-2xl text-orange-gradient">Welcome Back</CardTitle>
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    onClick={onSubmitLogin}
                    className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-orange-gradient" 
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-orange-gradient" 
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
          <p>© 2024 Edvios - Educational Visionaries. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}