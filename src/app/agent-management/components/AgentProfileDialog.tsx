'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Agent } from '../types/agent.types';
import {
    Mail,
    Phone,
    MapPin,
    Building2,
    User,
    Shield,
    Globe,
    Briefcase,
    LucideIcon,
} from 'lucide-react';

interface AgentProfileDialogProps {
    agent: Agent | null;
    open: boolean;
    onClose: () => void;
}

export const AgentProfileDialog: React.FC<AgentProfileDialogProps> = ({
    agent,
    open,
    onClose,
}) => {
    if (!agent) return null;

    const fullName = `${agent.firstName} ${agent.lastName}`.trim();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl overflow-hidden p-0 border-none shadow-2xl rounded-[2rem]">
                {/* Header Banner */}
                <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 h-40 w-full relative">
                    <div className="absolute -bottom-14 left-8 flex items-end gap-6">
                        <div className="w-28 h-28 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-green-600 font-bold text-4xl border-4 border-white">
                            {(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}
                        </div>
                        <div className="mb-4">
                            <h2 className="text-3xl font-bold text-white drop-shadow-md">{fullName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className={agent.role === 'AGENT' ? 'bg-green-100 text-green-700 border-none' : 'bg-yellow-100 text-yellow-700 border-none'}>
                                    {agent.role === 'AGENT' ? 'Approved Agent' : 'Pending Approval'}
                                </Badge>
                                <span className="text-green-50 text-xs font-medium opacity-80">ID: {agent.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 pt-20 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Information Sections */}
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <User className="w-3 h-3" /> Basic Information
                                </h4>
                                <div className="space-y-4">
                                    <InfoRow icon={Mail} label="Email Address" value={agent.email} />
                                    <InfoRow icon={Phone} label="Phone Number" value={agent.phone || 'Not provided'} />
                                    <InfoRow icon={Building2} label="Organization" value={agent.organization || 'Independent Consultant'} />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Location
                                </h4>
                                <div className="space-y-4">
                                    <InfoRow icon={Globe} label="Country" value={agent.country || 'Not specified'} />
                                    <InfoRow icon={MapPin} label="City / Address" value={`${agent.city ? agent.city + ', ' : ''}${agent.address || 'Not specified'}`} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> Account Details
                                </h4>
                                <div className="space-y-4 bg-green-50/30 p-5 rounded-3xl border border-green-100/50">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Member Since</span>
                                        <span className="font-bold text-gray-700">{new Date(agent.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Profile Status</span>
                                        <span className={`font-bold ${agent.role === 'AGENT' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {agent.role === 'AGENT' ? 'Verified' : 'In Review'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Last Update</span>
                                        <span className="font-bold text-gray-700">{new Date(agent.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg">
                                        <Briefcase className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Portal Access</p>
                                        <p className="text-sm font-medium text-gray-300">
                                            {agent.role === 'AGENT' ? 'Full administrative access granted.' : 'Access restricted until approval.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-8 border-t bg-gray-50/50 rounded-b-[2rem]">
                    <Button variant="outline" onClick={onClose} className="h-12 px-8 rounded-2xl border-gray-200 hover:bg-white hover:text-green-600 transition-all font-bold">
                        Close Profile
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-green-500 group-hover:border-green-200 transition-all">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
            <p className="text-gray-700 font-semibold">{value}</p>
        </div>
    </div>
);
