"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTypeToggle } from "@/app/auth/login/components/toggle";
import { Lock, Mail, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useAuth, useLoginForm, useRegisterForm } from "./hooks/use-auth";
import { USER_TYPES } from "./constants/userTypes";
import { AuthTabEnum, UserTypeEnum } from "./enums/auth.enum";
import { UserData } from "./types";

interface LoginPageProps {
  onLogin?: (userType: string, userData: UserData) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps = {}) {
  const [activeTab, setActiveTab] = useState<string>(AuthTabEnum.LOGIN);
  const [showPassword, setShowPassword] = useState(false);

  const { loginData, updateLoginData } = useLoginForm();
  const { registerData, updateRegisterData } = useRegisterForm();
  const { handleLogin, handleRegister, isLoading } = useAuth(onLogin);

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(loginData);
  };

  const onSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister(registerData);
  };

  // Filter user types for registration (exclude SUPERADMIN)
  const registerUserTypes = USER_TYPES.filter(type => type.id !== UserTypeEnum.SUPERADMIN);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg ring-3 ring-orange-100" style={{
              background: 'linear-gradient(135deg, #e5601b, #f88124)'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L1 9l11 6 11-6L12 3z" fill="white" />
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white" />
                <circle cx="12" cy="9" r="1.5" fill="white" />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold tracking-wide leading-none" style={{
                background: 'linear-gradient(135deg, #e5601b, #f88124)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Edvios</h1>
              <p className="text-sm tracking-wide mt-0.5" style={{
                background: 'linear-gradient(135deg, #e5601b, #f88124)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 600
              }}>Educational Visionaries</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Access your personalized education portal</p>
        </div>

        <Card className="shadow-2xl border-gray-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl" style={{
              background: 'linear-gradient(135deg, #e5601b, #f88124)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-1 rounded-4xl bg-gray-100 relative">
                {/* Sliding background indicator */}
                <div 
                  className="absolute top-1 bottom-1 rounded-4xl shadow-md transition-all duration-300 ease-in-out"
                  style={{
                    background: 'linear-gradient(135deg, #e5601b, #f88124)',
                    width: 'calc(50% - 4px)',
                    left: activeTab === 'login' ? '4px' : 'calc(50% + 0px)',
                  }}
                />
                <TabsTrigger 
                  value="login"
                  className="relative z-10 data-[state=active]:text-white data-[state=inactive]:text-gray-700 rounded-4xl transition-colors duration-300 ease-in-out border-0 bg-transparent"
                  style={{
                    border: 'none',
                  }}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register"
                  className="relative z-10 data-[state=active]:text-white data-[state=inactive]:text-gray-700 rounded-4xl transition-colors duration-300 ease-in-out border-0 bg-transparent"
                  style={{
                    border: 'none',
                  }}
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6">
                <div className="space-y-4">
                  {/* User Type Toggle */}
                  <UserTypeToggle
                    options={USER_TYPES}
                    value={loginData.userType}
                    onChange={(value) => updateLoginData("userType", value)}
                    disabled={isLoading}
                    label="Login as"
                    showDescription={true}
                  />

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
                        className="pl-10 border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        disabled={isLoading}
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
                        className="pl-10 pr-10 border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        disabled={isLoading}
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
                    className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                    style={{
                      background: 'linear-gradient(135deg, #e5601b, #f88124)'
                    }} 
                    disabled={isLoading}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-6">
                <div className="space-y-4">
                  {/* User Type Toggle */}
                  <UserTypeToggle
                    options={registerUserTypes}
                    value={registerData.userType}
                    onChange={(value) => updateRegisterData("userType", value)}
                    disabled={isLoading}
                    label="Register as"
                    showDescription={true}
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
                        className="border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
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
                        className="border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
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
                        className="pl-10 border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="text-gray-700 font-medium">Phone Number (Optional)</Label>
                    <Input
                      id="register-phone"
                      placeholder="Enter your phone number"
                      value={registerData.phone}
                      onChange={(e) => updateRegisterData("phone", e.target.value)}
                      className="border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Organization */}
                  {registerData.userType === UserTypeEnum.AGENT && (
                    <div className="space-y-2">
                      <Label htmlFor="register-organization" className="text-gray-700 font-medium">
                        Agency Name (Optional)
                      </Label>
                      <Input
                        id="register-organization"
                        placeholder="Enter your agency name"
                        value={registerData.organization}
                        onChange={(e) => updateRegisterData("organization", e.target.value)}
                        className="border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  )}

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
                        className="pl-10 pr-10 border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        disabled={isLoading}
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
                        className="pl-10 border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={onSubmitRegister}
                    className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                    style={{
                      background: 'linear-gradient(135deg, #e5601b, #f88124)'
                    }} 
                    disabled={isLoading}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 Edvios - Educational Visionaries. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}