import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../providers/them
import TopPanel from "@/components/ui
import { Toaster } from 'react-hot-toast';
import SidebarLayout from "@/components/sidebar-layo

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edvios - Educational Visionaries",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <TopPanel />
          <SidebarLayout>{children}</SidebarLayout>
        </ThemeProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
