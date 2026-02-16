"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoLoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LogoLoading({ className, size = "md", text }: LogoLoadingProps) {
  const sizeClasses = {
    sm: "w-24 h-12",
    md: "w-48 h-24",
    lg: "w-64 h-32",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className={cn("relative", sizeClasses[size])}
      >
        <Image
          src="/logoWithLetters.png"
          alt="Edvios Logo"
          fill
          className="object-contain"
          priority
        />
      </motion.div>
      
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3, y: 0 }}
            animate={{ opacity: 1, y: -4 }}
            transition={{
              duration: 0.4,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="w-2.5 h-2.5 rounded-full bg-edvios-green"
          />
        ))}
      </div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-edvios-blue font-medium tracking-wide uppercase text-xs"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}