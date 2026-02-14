"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserTypeToggle } from "@/app/auth/login/components/toggle";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth, useLoginForm, useRegisterForm } from "./hooks/use-auth";
import { AuthTabEnum, UserTypeEnum } from "./enums/auth.enum";
import { motion, AnimatePresence, Variants } from "framer-motion";

export default function LoginPage() {
  const searchParams = useSearchParams();
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  } as unknown as Variants;

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const onSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(loginData);
  };

  const onSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleRegister(registerData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8 overflow-x-hidden relative">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-edvios-green/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-edvios-blue/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-6xl flex items-center justify-center relative z-10">
        <motion.div
          layout
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden rounded-3xl bg-white"
        >
          <motion.div layout className="grid md:grid-cols-2 items-stretch md:min-h-[650px]">

            {/* Left Side: Animated Background & Logo */}
            <div className="hidden md:flex relative w-full h-full items-center justify-center bg-edvios-green overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-center"
              />

              {/* Fade In / Fade Out Logo Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1, y: -20 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="relative z-10 w-72 h-36 drop-shadow-2xl"
                >
                  <Image
                    src="/logoWithLetters.png"
                    alt="Edvios Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Side: Form Content */}
            <div className="p-6 sm:p-8 md:p-10 lg:p-14 flex flex-col justify-center bg-white">
              {/* Mobile-only Logo */}
              <div className="flex md:hidden justify-center mb-8">
                <div className="relative w-48 h-20">
                  <Image
                    src="/logoWithLetters.png"
                    alt="Edvios Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <motion.div layout="position" transition={slowSmoothTransition}>
                <CardHeader className="text-center pb-4 sm:pb-6 px-0 pt-0">
                  <motion.div layout="position" transition={slowSmoothTransition}>
                    <CardTitle className="text-xl sm:text-2xl text-edvios-blue font-bold">
                      {activeTab === AuthTabEnum.LOGIN ? "Welcome Back" : "Create Account"}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 mt-1">
                      {activeTab === AuthTabEnum.LOGIN
                        ? "Sign in to your account"
                        : "Join Edvios and start your journey"}
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent className="px-0">
                  <div className="space-y-6">
                    {/* Status Messages */}
                    <div className="space-y-4 mb-4">
                      {searchParams.get('registered') === 'true' && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative text-sm" role="alert">
                          <strong className="font-bold">Registration Successful!</strong>
                          <span className="block sm:inline"> Your account is pending admin approval. You will be able to login once approved.</span>
                        </div>
                      )}

                      {searchParams.get('verified') === 'true' && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative text-sm" role="alert">
                          <strong className="font-bold">Email Verified!</strong>
                          <span className="block sm:inline"> You can now log in to your account.</span>
                        </div>
                      )}
                    </div>

                    <UserTypeToggle
                      options={[AuthTabEnum.LOGIN, AuthTabEnum.REGISTER]}
                      value={activeTab}
                      onChange={(val) => setActiveTab(val)}
                      disabled={isLoading}
                    />

                    <AnimatePresence mode="wait" initial={false}>
                      {activeTab === AuthTabEnum.LOGIN ? (
                        <motion.div
                          key="login-form"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={containerVariants}
                          className="space-y-5"
                        >
                          <motion.div variants={itemVariants} className="space-y-2.5">
                            <Label htmlFor="login-email" className="text-sm font-semibold text-slate-700 ml-1">Email</Label>
                            <Input
                              id="login-email"
                              type="email"
                              placeholder="Enter your email address"
                              value={loginData.email}
                              onChange={(e) => updateLoginData("email", e.target.value)}
                              className="focus:ring-edvios-blue/20"
                            />
                          </motion.div>
                          <motion.div variants={itemVariants} className="space-y-2.5">
                            <div className="flex justify-between items-center">
                              <Label htmlFor="login-password" className="text-sm font-semibold text-slate-700 ml-1">Password</Label>
                              <button type="button" className="text-xs font-medium text-edvios-blue hover:underline">Forgot password?</button>
                            </div>
                            <Input
                              id="login-password"
                              type="password"
                              placeholder="Enter your password"
                              value={loginData.password}
                              onChange={(e) => updateLoginData("password", e.target.value)}
                              className="focus:ring-edvios-blue/20"
                            />
                          </motion.div>
                          <motion.div variants={itemVariants}>
                            <Button
                              onClick={onSubmitLogin}
                              className="w-full h-12 mt-4 bg-edvios-blue hover:bg-edvios-blue/90 shadow-lg shadow-edvios-blue/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-white font-bold rounded-xl"
                              disabled={isLoading}
                            >
                              <LogIn className="w-5 h-5 mr-2" /> {isLoading ? "Logging in..." : "Login to Dashboard"}
                            </Button>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="register-form"
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={containerVariants}
                          className="space-y-5"
                        >
                          <motion.div variants={itemVariants}>
                            <UserTypeToggle
                              options={[UserTypeEnum.STUDENT, UserTypeEnum.AGENT]}
                              value={registerData.role}
                              onChange={(value) => updateRegisterData("role", value)}
                              disabled={isLoading}
                            />
                          </motion.div>
                          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2.5">
                              <Label className="text-sm font-semibold text-slate-700 ml-1">First Name</Label>
                              <Input
                                placeholder="First name"
                                value={registerData.firstName}
                                onChange={(e) => updateRegisterData("firstName", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2.5">
                              <Label className="text-sm font-semibold text-slate-700 ml-1">Last Name</Label>
                              <Input
                                placeholder="Last name"
                                value={registerData.lastName}
                                onChange={(e) => updateRegisterData("lastName", e.target.value)}
                              />
                            </div>
                          </motion.div>
                          <motion.div variants={itemVariants} className="space-y-2.5">
                            <Label className="text-sm font-semibold text-slate-700 ml-1">Email Address</Label>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={registerData.email}
                              onChange={(e) => updateRegisterData("email", e.target.value)}
                            />
                          </motion.div>
                          <motion.div variants={itemVariants} className="space-y-2.5">
                            <Label className="text-sm font-semibold text-slate-700 ml-1">Phone Number</Label>
                            <Input
                              placeholder="+1 (555) 000-0000"
                              value={registerData.phone}
                              onChange={(e) => updateRegisterData("phone", e.target.value)}
                            />
                          </motion.div>
                          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2.5">
                              <Label className="text-sm font-semibold text-slate-700 ml-1">Password</Label>
                              <Input
                                type="password"
                                placeholder="Min. 8 chars"
                                value={registerData.password}
                                onChange={(e) => updateRegisterData("password", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2.5">
                              <Label className="text-sm font-semibold text-slate-700 ml-1">Confirm</Label>
                              <Input
                                type="password"
                                placeholder="Repeat password"
                                value={registerData.confirmPassword}
                                onChange={(e) => updateRegisterData("confirmPassword", e.target.value)}
                              />
                            </div>
                          </motion.div>
                          <motion.div variants={itemVariants}>
                            <Button
                              onClick={onSubmitRegister}
                              className="w-full h-12 mt-4 bg-edvios-green hover:bg-edvios-green/90 shadow-lg shadow-edvios-green/20 hover:shadow-xl hover:-translate-y-0.5 transition-all text-white font-bold rounded-xl"
                              disabled={isLoading}
                            >
                              <UserPlus className="w-5 h-5 mr-2" /> {isLoading ? "Creating Account..." : "Start Your Journey"}
                            </Button>
                          </motion.div>
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