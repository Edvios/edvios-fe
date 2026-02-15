"use client";

import { useState } from "react";
import AppToast from "@/utils/toast-utils";
import { resendVerificationEmail } from "../../login/api/auth.api";

export const useVerifyRequest = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleResend = async (email: string) => {
        if (!email) return;

        setIsLoading(true);
        try {
            const response = await resendVerificationEmail(email);
            if (response.success) {
                AppToast.success(response.message);
            } else {
                AppToast.error(response.message);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            AppToast.error("Failed to resend email");
        } finally {
            setIsLoading(false);
        }
    };

    return { handleResend, isLoading };
};
