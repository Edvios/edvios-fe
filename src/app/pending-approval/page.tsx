"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import AppToast from "@/utils/toast-utils";

export default function PendingApprovalPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Failed to sign out:", error);
      AppToast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-6">
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-green-100">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-6">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Your agent account is pending approval
        </h1>
        <p className="text-gray-600 text-center mt-3">
          Thanks for registering. An administrator will review your details and
          activate your account soon. You’ll get access once you’re approved.
        </p>
        <div className="mt-8 flex justify-center">
          <Button onClick={handleSignOut} className="px-6">
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
