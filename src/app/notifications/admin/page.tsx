"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { notificationService } from "@/app/notifications/api/notification.service";
import { AppToast } from "@/utils/toast-utils";
import { Loader2, Send, Users, UserCheck, MessageSquarePlus } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";

export default function CreateNotificationPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [audience, setAudience] = useState<"student" | "agent">("student");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim()) {
            AppToast.error("Please enter a message content");
            return;
        }

        setLoading(true);

        try {
            if (audience === "student") {
                await notificationService.createStudentNotification({ message });
            } else {
                await notificationService.createAgentNotification({ message });
            }

            AppToast.success(`Notification sent to all ${audience}s successfully`);
            setMessage("");
        } catch (error) {
            console.error(error);
            AppToast.error("Failed to broadcast notification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <Breadcrumb
                    items={[
                        { label: "Admin Dashboard", href: "/dashboard/admin" },
                        { label: "Broadcast Notifications", active: true }
                    ]}
                />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl overflow-hidden">
                        <div className="h-1.5 bg-gradient-to-r from-edvios-green to-edvios-blue w-full" />
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-edvios-green/10 rounded-lg">
                                    <MessageSquarePlus className="w-5 h-5 text-edvios-green" />
                                </div>
                                <CardTitle className="text-xl font-bold text-gray-900 tracking-tight">
                                    System Broadcast
                                </CardTitle>
                            </div>
                            <CardDescription className="text-sm text-gray-500 font-medium">
                                Compose and send instant notifications to your global platform users.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                Target Audience
                                            </Label>
                                            <Select
                                                value={audience}
                                                onValueChange={(val: "student" | "agent") => setAudience(val)}
                                            >
                                                <SelectTrigger className="h-11 border-gray-100 bg-gray-50/50 focus:ring-edvios-green/20">
                                                    <SelectValue placeholder="Select audience" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="student">
                                                        <div className="flex items-center gap-2">
                                                            <UserCheck className="w-3.5 h-3.5 text-edvios-green" />
                                                            <span>All Registered Students</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="agent">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="w-3.5 h-3.5 text-edvios-blue" />
                                                            <span>All Registered Agents</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <Label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                Notification Message
                                            </Label>
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${message.length > 200 ? 'text-amber-500' : 'text-gray-300'}`}>
                                                {message.length} / 500
                                            </span>
                                        </div>
                                        <div className="relative group">
                                            <Textarea
                                                id="message"
                                                placeholder="Enter the notification content here..."
                                                className="min-h-[160px] resize-none border-gray-100 bg-gray-50/50 focus:bg-white transition-all duration-300 text-sm p-4 rounded-xl focus:ring-edvios-green/20"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                                            />
                                            <div className="absolute inset-0 rounded-xl border border-edvios-green/0 group-focus-within:border-edvios-green/20 pointer-events-none transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <Button
                                        type="submit"
                                        disabled={loading || !message.trim()}
                                        className="flex-1 h-12 bg-edvios-green hover:bg-edvios-green/90 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-edvios-green/10"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing Broadcast...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Broadcast Message
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setMessage("")}
                                        className="h-12 border-gray-100 font-bold uppercase tracking-widest text-xs hover:bg-gray-50"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="p-4 rounded-xl bg-edvios-blue/5 border border-edvios-blue/10 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Users className="w-5 h-5 text-edvios-blue" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-edvios-blue uppercase tracking-widest mb-1">Impact Analysis</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            Notifications are delivered instantly to active sessions and stored in the user&apos;s inbox.
                            Avoid frequent global broadcasts unless urgent to maintain user engagement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
