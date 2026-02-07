"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { notificationService } from "@/services/notification.service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Send, Users, UserCog, Loader2, CheckCircle2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminNotificationsPage() {
    const [targetRole, setTargetRole] = useState<"student" | "agent">("student");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setSending(true);

        try {
            if (targetRole === "student") {
                await notificationService.createStudentNotification({ message: message.trim() });
            } else {
                await notificationService.createAgentNotification({ message: message.trim() });
            }

            toast.success(
                <div className="flex flex-col gap-1">
                    <span className="font-medium">Notification Sent!</span>
                    <span className="text-xs opacity-90">
                        Sent to all {targetRole}s successfully.
                    </span>
                </div>,
                { duration: 4000, icon: <CheckCircle2 className="text-green-500 h-5 w-5" /> }
            );
            setMessage("");
        } 
        catch (err: unknown) {
        console.error(err);

        if (err instanceof Error) {
            toast.error(`Failed to send: ${err.message}`);
        } else {
            toast.error('Failed to send notification');
        }
        }
        finally {
            setSending(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-12 px-4">
            <Toaster position="top-center" />
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Admin Notifications
                </h1>
                <p className="text-gray-500">
                    Send real-time updates and announcements to your users.
                </p>
            </div>

            <Card className="border-t-4 border-t-purple-600 shadow-lg">
                <CardHeader>
                    <CardTitle>Compose Message</CardTitle>
                    <CardDescription>
                        This message will be broadcasted instantly to all users in the selected group.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Target Audience</Label>
                        <RadioGroup
                            value={targetRole}
                            onValueChange={(v) => setTargetRole(v as "student" | "agent")}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="student" id="role-student" className="peer sr-only" />
                                <Label
                                    htmlFor="role-student"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-100 bg-white hover:bg-gray-50 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50 cursor-pointer transition-all"
                                >
                                    <Users className={`h-6 w-6 mb-2 ${targetRole === 'student' ? 'text-purple-600' : 'text-gray-500'}`} />
                                    <span className="font-medium">Students</span>
                                </Label>
                            </div>

                            <div>
                                <RadioGroupItem value="agent" id="role-agent" className="peer sr-only" />
                                <Label
                                    htmlFor="role-agent"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-100 bg-white hover:bg-gray-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all"
                                >
                                    <UserCog className={`h-6 w-6 mb-2 ${targetRole === 'agent' ? 'text-blue-600' : 'text-gray-500'}`} />
                                    <span className="font-medium">Agents</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="message" className="text-base font-semibold">Message Content</Label>
                        <Textarea
                            id="message"
                            placeholder={`Enter the notification message for ${targetRole}s...`}
                            className="min-h-[150px] resize-none focus-visible:ring-purple-500 p-4 text-base"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 text-right">
                            {message.length} characters
                        </p>
                    </div>

                    <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-lg h-12"
                        onClick={handleSend}
                        disabled={sending}
                    >
                        {sending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending Broadcast...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-5 w-5" />
                                Send Notification to {targetRole === 'student' ? 'Students' : 'Agents'}
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Visual cue for context - optional */}
            <div className="mt-8 p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-500 flex gap-3">
                <div className="shrink-0 bg-yellow-100 text-yellow-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">!</div>
                <p>
                    Note: These notifications are saved permanently in the database and displayed to users immediately via real-time connection.
                </p>
            </div>
        </div>
    );
}
