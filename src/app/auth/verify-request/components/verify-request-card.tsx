"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useVerifyRequest } from "../hooks/use-verify-request";
import { Label } from "@/components/ui/label";

interface VerifyRequestCardProps {
    email: string;
}

export default function VerifyRequestCard({ email }: VerifyRequestCardProps) {
    const { handleResend, isLoading } = useVerifyRequest();

    return (
        <Card className="w-full max-w-md shadow-2xl border-gray-200">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center text-edvios-blue">Check your email</CardTitle>
                <CardDescription className="text-center text-gray-600">
                    We have sent a verification link to your email address.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email sent to:</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            id="email"
                            value={email}
                            readOnly
                            className="pl-10 bg-gray-50 text-gray-600"
                        />
                    </div>
                </div>

                <Button
                    variant="default"
                    className="w-full bg-edvios-blue hover:bg-edvios-green transition-colors duration-300"
                    onClick={() => handleResend(email)}
                    disabled={isLoading || !email}
                >
                    {isLoading ? "Sending..." : "Resend Email"}
                </Button>

                <div className="pt-2 text-center text-sm">
                    <Link href="/auth/login" className="text-gray-500 hover:text-edvios-blue transition-colors flex items-center justify-center gap-2 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
