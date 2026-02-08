"use client";


import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationList } from "./notification-list";
import { useState } from "react";

interface NotificationBellProps {
    role: "student" | "agent";
}

export function NotificationBell({ role }: NotificationBellProps) {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-900">
                    <Bell className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[400px] p-0 shadow-xl border-gray-100">
                <div className="max-h-[600px] overflow-hidden flex flex-col">
                    <div className="p-4 border-b bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="overflow-y-auto">
                        <NotificationList role={role} />
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
