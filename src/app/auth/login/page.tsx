"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const { loginData, updateLoginData, setDemoCredentials } = useLoginForm();
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

  const selectedUserType = USER_TYPES.find(type => type.id === loginData.userType);
  const selectedRegisterType = USER_TYPES.find(type => type.id === registerData.userType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl ring-4 ring-green-100 mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L1 9l11 6 11-6L12 3z" fill="white" />
              <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" fill="white" />
              <circle cx="12" cy="9" r="1.5" fill="white" />
            </svg>
          </div>
          <h1 className="text-4xl font-normal text-blue-500 tracking-wide mb-2">Edvios</h1>
          <p className="text-blue-600 font-semibold text-lg tracking-wide">Educational Visionaries</p>
          <p className="text-gray-600 mt-2">Access your personalized education portal</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-6">
                <form onSubmit={onSubmitLogin} className="space-y-4">
                  {/* User Type */}
                  <div className="space-y-2">
                    <Label htmlFor="login-user-type">Login as</Label>
                    <Select 
                      value={loginData.userType} 
                      onValueChange={(value) => updateLoginData("userType", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                              <span>{type.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedUserType && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <selectedUserType.icon className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-sm">{selectedUserType.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{selectedUserType.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => updateLoginData("email", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => updateLoginData("password", e.target.value)}
                        className="pl-10 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <LogIn className="w-4 h-4 mr-2" />
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
                {/* Demo Accounts */}
                <div className="space-y-3">
                  <div className="text-center text-sm text-gray-500">
                    Quick Demo Access
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {USER_TYPES.map(type => (
                      <Button
                        key={type.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setDemoCredentials(type.id)}
                        className="justify-start"
                        disabled={isLoading}
                      >
                        <type.icon className="w-4 h-4 mr-2" />
                        {type.id === UserTypeEnum.SUPERADMIN ? 'Super Admin' : `Demo ${type.name}`}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-6">
                <form onSubmit={onSubmitRegister} className="space-y-4">
                  {/* User Type */}
                  <div className="space-y-2">
                    <Label htmlFor="register-user-type">Register as</Label>
                    <Select 
                      value={registerData.userType} 
                      onValueChange={(value) => updateRegisterData("userType", value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        {USER_TYPES.filter(type => type.id !== UserTypeEnum.SUPERADMIN).map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                              <span>{type.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedRegisterType && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <selectedRegisterType.icon className="w-4 h-4 text-gray-600" />
                          <span className="font-medium text-sm">{selectedRegisterType.name}</span>
                        </div>
                        <p className="text-xs text-gray-600">{selectedRegisterType.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstname">First Name</Label>
                      <Input
                        id="register-firstname"
                        placeholder="First name"
                        value={registerData.firstName}
                        onChange={(e) => updateRegisterData("firstName", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-lastname">Last Name</Label>
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
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerData.email}
                        onChange={(e) => updateRegisterData("email", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">Phone Number (Optional)</Label>
                    <Input
                      id="register-phone"
                      placeholder="Enter your phone number"
                      value={registerData.phone}
                      onChange={(e) => updateRegisterData("phone", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Organization */}
                  {registerData.userType === UserTypeEnum.AGENT && (
                    <div className="space-y-2">
                      <Label htmlFor="register-organization">
                        Agency Name (Optional)
                      </Label>
                      <Input
                        id="register-organization"
                        placeholder="Enter your agency name"
                        value={registerData.organization}
                        onChange={(e) => updateRegisterData("organization", e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={registerData.password}
                        onChange={(e) => updateRegisterData("password", e.target.value)}
                        className="pl-10 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={registerData.confirmPassword}
                        onChange={(e) => updateRegisterData("confirmPassword", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
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
