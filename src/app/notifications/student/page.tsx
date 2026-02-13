"use client";

import { NotificationList } from "@/app/notifications/components/notification-list";

export default function StudentNotificationsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-10">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <p className="text-3xl font-bold text-edvios-blue">Your Notifications</p>
                    <p className="text-gray-500 mt-2">
                        Stay updated with the latest announcements and status changes.
                    </p>
                </div>
                <NotificationList role="student" />
            </div>
        </div>
    );
}
