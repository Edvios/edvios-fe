"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserTypeEnum } from "@/app/auth/login/enums/auth.enum";
import { ChatUser } from "../types/chat.types";

export function useCurrentUser() {
  const [user, setUser] = useState<ChatUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First try to get from session storage (for students)
        const userSession = sessionStorage.getItem("user-session");
        
        if (userSession) {
          const parsedUser = JSON.parse(userSession);
          setUser({
            id: parsedUser.id,
            name: parsedUser.name || parsedUser.email,
            email: parsedUser.email,
            role: parsedUser.role as UserTypeEnum,
          });
          setIsLoading(false);
          return;
        }

        // Fallback to Supabase session (for agents)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          router.push("/auth/login");
          return;
        }

        const supabaseUser = session.user;
        const role =
          (supabaseUser.user_metadata?.role ||
            supabaseUser.app_metadata?.role ||
            "STUDENT") as UserTypeEnum;

        setUser({
          id: supabaseUser.id,
          name:
            `${supabaseUser.user_metadata?.firstName || ""} ${supabaseUser.user_metadata?.lastName || ""}`.trim() ||
            supabaseUser.email ||
            "User",
          email: supabaseUser.email || "",
          role,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router, supabase.auth]);

  return { user, isLoading };
}
