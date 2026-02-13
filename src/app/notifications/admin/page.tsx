"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { notificationService } from "@/app/notifications/api/notification.service";
import { toast } from "react-hot-toast";
import { Loader2, Send } from "lucide-react";

export default function CreateNotificationPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [audience, setAudience] = useState<"student" | "agent">("student");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setLoading(true);

        try {
            if (audience === "student") {
                await notificationService.createStudentNotification({ message });
            } else {
                await notificationService.createAgentNotification({ message });
            }

            toast.success("Notification sent successfully");
            setMessage("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send notification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gradient">Create Notification</CardTitle>
                    <CardDescription>
                        Send a system notification to students or agents.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="audience">Target Audience</Label>
                            <Select
                                value={audience}
                                onValueChange={(val: "student" | "agent") => setAudience(val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Students</SelectItem>
                                    <SelectItem value="agent">Agents</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                placeholder="Type your notification message here..."
                                className="min-h-[120px] resize-none"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {message.length} characters
                            </p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-edvios-green">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4 " />
                                        Send Notification
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
