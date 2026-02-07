"use client";

import { NotificationList } from "@/components/notifications/notification-list";

export default function AgentNotificationsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-10">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Agent Notifications</h1>
                    <p className="text-gray-500 mt-2">
                        Important updates regarding your students and applications.
                    </p>
                </div>
                <NotificationList role="agent" />
            </div>
        </div>
    );
}
