"use client";

import { useNotifications, NotificationWithState } from "@/app/notifications/hooks/use-notifications";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Clock, Mail } from "lucide-react";
import { cn } from "@/utils/cn";

interface NotificationListProps {
    role: "student" | "agent";
}

export function NotificationList({ role }: NotificationListProps) {
    const { notifications, loading } = useNotifications(role);

    if (loading) {
        return (
            <div className="flex flex-col space-y-4 p-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-gray-100/50" />
                ))}
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <div className="w-full space-y-4 p-4">
            <div className="flex items-center justify-between px-1">
                <div className="text-sm text-gray-500 font-medium">
                    Notifications
                </div>
            </div>

            <ScrollArea className="h-[400px]">
                <div className="space-y-3 pr-3">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 mb-3">
                                <Bell className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">No notifications</p>
                            <p className="text-xs text-gray-500 mt-1">You are all caught up!</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                formatDate={formatDate}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function NotificationItem({
    notification,
    formatDate
}: {
    notification: NotificationWithState;
    formatDate: (d: string) => string;
}) {
    return (
        <Card
            className={cn(
                "transition-all duration-200 border-l-4 group relative overflow-hidden",
                "bg-white border-l-blue-500 shadow-sm hover:shadow-md"
            )}
        >
            <div className="p-3 flex gap-3">
                <div className={cn(
                    "mt-1 h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs",
                    "bg-blue-100 text-blue-600"
                )}>
                    <Mail className="h-3.5 w-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate pr-2 text-gray-900">
                            System Notification
                        </h4>
                        <span className="flex items-center text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                            <Clock className="mr-1 h-2.5 w-2.5" />
                            {formatDate(notification.createdAt)}
                        </span>
                    </div>

                    <p className="text-xs leading-relaxed text-gray-700">
                        {notification.message}
                    </p>
                </div>
            </div>
        </Card>
    );
}
