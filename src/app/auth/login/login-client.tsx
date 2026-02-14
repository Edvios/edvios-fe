"use client";

import { useState } from "react";
import Image from "next/image";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserTypeToggle } from "@/app/auth/login/components/toggle";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth, useLoginForm, useRegisterForm } from "./hooks/use-auth";
import { AuthTabEnum, UserTypeEnum } from "./enums/auth.enum";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<string>(AuthTabEnum.LOGIN);
  const { loginData, updateLoginData } = useLoginForm();
  const { registerData, updateRegisterData } = useRegisterForm();
  const { handleLogin, handleRegister, isLoading } = useAuth();

  const slowSmoothTransition = {
    type: "spring",
    stiffness: 100,
    damping: 22,
    mass: 1.2
  } as const;

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(loginData);
  };

  const onSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister(registerData);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden">
      
      <div className="w-full max-w-6xl flex items-center justify-center">
        <motion.div
          layout
          transition={slowSmoothTransition}
          className="w-full shadow-2xl border border-gray-100 overflow-hidden rounded-2xl bg-white"
        >
          <motion.div layout className="grid md:grid-cols-2 items-stretch md:min-h-[650px]">
            
            {/* Left Side: Solid Edvios Green Background */}
            <div className="hidden md:flex relative w-full h-full items-center justify-center bg-edvios-green">
              {/* Fade In / Fade Out Logo Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab} 
                  initial={{ opacity: 0, y: 10 }} // Starts slightly lower and invisible
                  animate={{ opacity: 1, y: 0 }}  // Fades in and slides to center
                  exit={{ opacity: 0, y: -10 }}   // Fades out and slides slightly up
                  transition={{ 
                    duration: 0.5, 
                    ease: "easeInOut" 
                  }}
                  className="relative z-10 w-72 h-36"
                >
                  <Image
                    src="/logoWithLetters.png"
                    alt="Edvios Logo"
                    fill
                    className="object-contain brightness-0 invert" 
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Side: Form Content */}
            <div className="p-6 md:p-10 lg:p-14 flex flex-col justify-center bg-white">
              <motion.div layout="position" transition={slowSmoothTransition}>
                <CardHeader className="text-center pb-6 px-0 pt-0">
                  <motion.div layout="position" transition={slowSmoothTransition}>
                    <CardTitle className="text-2xl text-edvios-blue font-bold">
                      {activeTab === AuthTabEnum.LOGIN ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription className="text-gray-500 mt-1">
                      {activeTab === AuthTabEnum.LOGIN 
                        ? "Sign in to your account" 
                        : "Join Edvios and start your journey"}
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent className="px-0">
                  <div className="space-y-6">
                    <UserTypeToggle
                      options={[AuthTabEnum.LOGIN, AuthTabEnum.REGISTER]}
                      value={activeTab}
                      onChange={(val) => setActiveTab(val)}
                      disabled={isLoading}
                    />

                    <AnimatePresence mode="popLayout" initial={false}>
                      {activeTab === AuthTabEnum.LOGIN ? (
                        <motion.div
                          key="login-form"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={slowSmoothTransition}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="login-email">Email</Label>
                            <Input 
                              id="login-email" 
                              type="email" 
                              placeholder="Enter your email address" 
                              value={loginData.email} 
                              onChange={(e) => updateLoginData("email", e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <Input 
                              id="login-password" 
                              type="password" 
                              placeholder="Enter your password" 
                              value={loginData.password} 
                              onChange={(e) => updateLoginData("password", e.target.value)} 
                            />
                          </div>
                          <Button 
                            onClick={onSubmitLogin} 
                            className="w-full h-10 mt-2 bg-edvios-blue hover:opacity-90 transition-all"
                            disabled={isLoading}
                          >
                            <LogIn className="w-4 h-4 mr-2" /> {isLoading ? "Logging in..." : "Login"}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="register-form"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={slowSmoothTransition}
                          className="space-y-4"
                        >
                          <UserTypeToggle
                            options={[UserTypeEnum.STUDENT, UserTypeEnum.AGENT]}
                            value={registerData.role}
                            onChange={(value) => updateRegisterData("role", value)}
                            disabled={isLoading}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>First Name</Label>
                              <Input 
                                placeholder="Enter your first name" 
                                value={registerData.firstName} 
                                onChange={(e) => updateRegisterData("firstName", e.target.value)} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Last Name</Label>
                              <Input 
                                placeholder="Enter your last name" 
                                value={registerData.lastName} 
                                onChange={(e) => updateRegisterData("lastName", e.target.value)} 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input 
                              type="email" 
                              placeholder="Enter your email address" 
                              value={registerData.email} 
                              onChange={(e) => updateRegisterData("email", e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input 
                              placeholder="Enter your phone number" 
                              value={registerData.phone} 
                              onChange={(e) => updateRegisterData("phone", e.target.value)} 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Password</Label>
                              <Input 
                                type="password" 
                                placeholder="Enter your password" 
                                value={registerData.password} 
                                onChange={(e) => updateRegisterData("password", e.target.value)} 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Confirm Password</Label>
                              <Input 
                                type="password" 
                                placeholder="Confirm your password" 
                                value={registerData.confirmPassword} 
                                onChange={(e) => updateRegisterData("confirmPassword", e.target.value)} 
                              />
                            </div>
                          </div>
                          <Button 
                            onClick={onSubmitRegister} 
                            className="w-full h-10 mt-2 bg-edvios-green hover:opacity-90 transition-all"
                          >
                            <UserPlus className="w-4 h-4 mr-2" /> Create Account
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="text-center py-4 text-gray-400 text-xs font-medium tracking-[0.2em] uppercase">
        © 2026 Edvios | All rights reserved
      </div>
    </div>
  );
}