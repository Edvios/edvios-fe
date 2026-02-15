import VerifyEmailStatus from "./components/verify-email-status";
import Image from "next/image";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="flex justify-center">
                    <Image
                        src="/logo.png"
                        alt="Edvios Logo"
                        width={120}
                        height={120}
                        className="h-24 w-auto drop-shadow-sm"
                        priority
                    />
                </div>

                <Suspense fallback={
                    <Card className="w-full max-w-md shadow-2xl border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-center text-edvios-blue">
                                Loading Verification
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-16 w-16 text-edvios-blue animate-spin" />
                        </CardContent>
                    </Card>
                }>
                    <VerifyEmailStatus />
                </Suspense>

                <div className="text-center text-gray-500 text-sm">
                    <p>© 2026 Edvios. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
