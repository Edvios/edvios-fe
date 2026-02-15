"use client";

import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useVerifyEmail } from "../hooks/use-verify-email";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailStatus() {
    const { status, message } = useVerifyEmail();

    return (
        <Card className="w-full max-w-md shadow-2xl border-gray-200">
            <CardHeader>
                <CardTitle className="text-center text-edvios-blue">
                    {status === "loading" && "Verification in Progress"}
                    {status === "success" && "Verification Successful"}
                    {status === "error" && "Verification Failed"}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-6">
                {status === "loading" && (
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-16 w-16 text-edvios-blue animate-spin" />
                        <p className="text-gray-600 text-center">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <p className="text-gray-700 text-center text-lg font-medium">{message}</p>
                        <p className="text-sm text-gray-500">Redirecting to login...</p>
                        <Button asChild className="w-full bg-edvios-blue hover:bg-edvios-green transition-colors mt-4">
                            <Link href="/auth/login">Proceed to Login</Link>
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
                        <XCircle className="h-16 w-16 text-red-500" />
                        <p className="text-gray-700 text-center">{message}</p>
                        <div className="w-full pt-4">
                            <Button asChild className="w-full bg-edvios-blue hover:bg-edvios-green transition-colors">
                                <Link href="/auth/login">Back to Login</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
