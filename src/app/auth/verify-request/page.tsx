import VerifyRequestCard from "./components/verify-request-card";
import Image from "next/image";

import { use } from "react";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function VerifyRequestPage({ searchParams }: PageProps) {
    const params = use(searchParams);
    const email = typeof params.email === "string" ? params.email : "";

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
                <VerifyRequestCard email={email} />

                <div className="text-center text-gray-500 text-sm">
                    <p>© 2026 Edvios. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
