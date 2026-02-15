import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../providers/theme-provider";
import { AuthProvider } from "../providers/auth-provider";
import { ToastProvider } from '@/components/ui/toast-provider';
import SidebarLayout from "@/components/sidebar-layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edvios",
  description: "Your personalized education portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <SidebarLayout>{children}</SidebarLayout>
          </ThemeProvider>
        </AuthProvider>
        <ToastProvider position="top-right" />
      </body>
    </html>
  );
}
