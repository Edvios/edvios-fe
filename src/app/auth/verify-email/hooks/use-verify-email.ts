"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "../../login/api/auth.api";
import AppToast from "@/utils/toast-utils";

export const useVerifyEmail = () => {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid or missing verification link.");
                return;
            }

            try {
                const response = await verifyEmail(token);
                if (response.success) {
                    setStatus("success");
                    setMessage("Your email has been successfully verified.");
                    AppToast.success("Email verified!");

                    // Direct the user to login page after a short delay
                    setTimeout(() => {
                        router.push("/auth/login?verified=true");
                    }, 2000);
                } else {
                    setStatus("error");
                    setMessage(response.message || "Failed to verify email.");
                }
            } catch (error) {
                setStatus("error");
                setMessage("An unexpected error occurred while verifying your email.");
            }
        };

        verify();
    }, [token, router]);

    return { status, message };
};
