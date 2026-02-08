"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { notificationService, Notification } from "@/app/notifications/api/notification.service";

// Just aliasing for now in case we add more client-side state later, or use Notification directly
export type NotificationWithState = Notification;

type Role = "student" | "agent";

export function useNotifications(role: Role) {
    const [notifications, setNotifications] = useState<NotificationWithState[]>([]);
    const [loading, setLoading] = useState(true);
    const [supabase] = useState(() => createClient());
    const tableName = role === "student" ? "student_notifications" : "agent_notifications";

    useEffect(() => {
        // 1. Fetch initial data via API (Axios -> NestJS)
        const fetchNotifications = async () => {
            try {
                let data: Notification[] = [];
                if (role === "student") {
                    data = await notificationService.getAllStudentNotifications();
                } else {
                    data = await notificationService.getAllAgentNotifications();
                }

                if (data) {
                    // Sort desc by date
                    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setNotifications(data);
                }
            } catch (err) {
                console.error("Unexpected error fetching notifications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();

        // 2. Subscribe to realtime updates via Supabase
        const channel = supabase
            .channel(`realtime_${tableName}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: tableName,
                },
                (payload) => {
                    const newNotif = payload.new as Notification;
                    setNotifications((prev) => [newNotif, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [role, tableName]);

    return {
        notifications,
        loading,
    };
}
