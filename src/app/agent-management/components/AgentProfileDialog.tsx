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
    onApprove?: (agentId: string) => void;
}

export const AgentProfileDialog: React.FC<AgentProfileDialogProps> = ({
    agent,
    open,
    onClose,
    onApprove,
}) => {
    if (!agent) return null;

    const fullName = `${agent.firstName} ${agent.lastName}`.trim();

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-[95vw] md:w-full overflow-hidden p-0 border-none shadow-2xl rounded-2xl md:rounded-[2rem]">
                {/* Header Banner */}
                <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 h-32 md:h-40 w-full relative">
                    <div className="absolute -bottom-14 left-4 md:left-8 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 text-center md:text-left w-full md:w-auto px-4 md:px-0">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl md:rounded-3xl bg-white shadow-2xl flex items-center justify-center text-green-600 font-bold text-3xl md:text-4xl border-4 border-white">
                            {(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}
                        </div>
                        <div className="md:mb-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 md:text-white drop-shadow-none md:drop-shadow-md bg-white md:bg-transparent px-4 py-1 rounded-xl md:p-0 shadow-sm md:shadow-none">{fullName}</h2>
                            <div className="flex flex-col md:flex-row items-center gap-2 mt-1">
                                <Badge className={agent.role === 'AGENT' ? 'bg-green-100 text-green-700 border-none px-3 py-1 text-[10px]' : 'bg-yellow-101 text-yellow-700 border-none px-3 py-1 text-[10px]'}>
                                    {agent.role === 'AGENT' ? 'Approved Agent' : 'Pending Approval'}
                                </Badge>
                                <span className="text-gray-500 md:text-green-50 text-[10px] md:text-xs font-medium opacity-80 uppercase tracking-widest">ID: {agent.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-10 pt-28 md:pt-20 space-y-8 md:space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Information Sections */}
                        <div className="space-y-6 md:space-y-8">
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

                        <div className="space-y-6 md:space-y-8">
                            <div>
                                <h4 className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Shield className="w-3 h-3" /> Account Details
                                </h4>
                                <div className="space-y-4 bg-green-50/30 p-5 rounded-2xl md:rounded-3xl border border-green-100/50">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Member Since</span>
                                        <span className="font-bold text-gray-700">{new Date(agent.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Profile Status</span>
                                        <span className={`font-bold ${agent.role === 'AGENT' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {agent.role === 'AGENT' ? 'Verified' : 'In Review'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500">Last Update</span>
                                        <span className="font-bold text-gray-700">{new Date(agent.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 md:p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl md:rounded-3xl text-white shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-green-500/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-green-500 flex items-center justify-center shadow-lg flex-shrink-0">
                                        <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Portal Access</p>
                                        <p className="text-xs md:text-sm font-medium text-gray-300">
                                            {agent.role === 'AGENT' ? 'Full administrative access granted.' : 'Access restricted until approval.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 md:p-8 border-t bg-gray-50/50 rounded-b-2xl md:rounded-b-[2rem] flex flex-col-reverse sm:flex-row gap-3">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-12 px-8 rounded-xl md:rounded-2xl border-gray-200 hover:bg-white hover:text-green-600 transition-all font-bold">
                        Close Profile
                    </Button>

                    {agent.role === 'PENDING_AGENT' && onApprove && (
                        <Button
                            onClick={() => {
                                onApprove(agent.id);
                                onClose();
                            }}
                            className="w-full sm:w-auto h-12 px-8 rounded-xl md:rounded-2xl bg-orange-600 hover:bg-orange-700 text-white transition-all font-bold shadow-lg shadow-orange-200"
                        >
                            Approve Agent
                        </Button>
                    )}
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
