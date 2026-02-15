'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    User,
    Clock,
    FileText,
    Globe,
    Building2,
    Briefcase,
    Shield,
    Award,
    CheckCircle2,
    ExternalLink,
    Loader2,
    Info,
    XCircle,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Agent } from '../types/agent.types';
import { getAgent, approveAgent } from '../api/agent.api';
import { AppToast } from '@/utils/toast-utils';
import {LucideIcon} from 'lucide-react';   

const AgentProfilePage = () => {
    const params = useParams();
    const router = useRouter();
    const agentId = params.id as string;

    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAgentData = async () => {
        try {
            setLoading(true);
            const data = await getAgent(agentId);
            setAgent(data);
        } catch (error) {
            console.error('Error fetching agent:', error);
            AppToast.error('Failed to load agent details');
            router.push('/agent-management');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (agentId) {
            fetchAgentData();
        }
    }, [agentId, router]);

    const handleApprove = async () => {
        if (!agent) return;
        try {
            setActionLoading(true);
            await approveAgent(agent.id);
            AppToast.success('Agent approved successfully');
            fetchAgentData(); // Refresh data
        } catch (error) {
            AppToast.error('Failed to approve agent');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-edvios-green animate-spin" />
                    <p className="text-gray-500 font-medium">Loading agent profile...</p>
                </div>
            </div>
        );
    }

    if (!agent) return null;

    const fullName = `${agent.firstName} ${agent.lastName}`.trim() || agent.agentName || 'Unknown Agent';

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-12">
            {/* Header / Navigation */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/agent-management')}
                        className="gap-2 hover:bg-edvios-green/10 text-gray-600 hover:text-edvios-green transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to List
                    </Button>
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Agent Profile</span>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <span className="text-xs font-bold text-edvios-green">{fullName}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <Card className="border-none shadow-2xl overflow-hidden rounded-3xl">
                    <div className=" h-40 md:h-50 w-full relative">
                        {agent.role === 'PENDING_AGENT' && (
                            <div className="md:mb-4 shrink-0 p-2 flex justify-end">
                                <Button
                                    onClick={handleApprove}
                                    disabled={actionLoading}
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-6 rounded-2xl shadow-xl  transition-all hover:scale-105 active:scale-95"
                                >
                                    {actionLoading 
                                        ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> 
                                        : <CheckCircle className="w-5 h-5 mr-2" />
                                    }
                                    Approve Agent Access
                                </Button>
                            </div>
                        )}

                        <div className="absolute -bottom-16 left-6 md:left-12 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8 text-center md:text-left w-[calc(100%-48px)]">
                            <div className="hidden md:flex w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-white shadow-2xl items-center justify-center text-edvios-green font-bold text-4xl md:text-6xl border-8 border-white shrink-0">
                                {(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}
                            </div>

                            
                            <div className="md:mb-4 flex-1">
                                <p className="text-3xl md:text-5xl font-black text-edvios-blue drop-shadow-sm truncate">{fullName}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                                    <Badge
                                        className={
                                            agent.role === 'AGENT'
                                                ? 'bg-white text-edvios-green border-none shadow-lg px-4 py-1.5 rounded-xl font-bold text-xs'
                                                : 'bg-yellow-400 text-yellow-900 border-none shadow-lg px-4 py-1.5 rounded-xl font-bold text-xs'
                                        }
                                    >
                                        {agent.role === 'AGENT' ? '✓ APPROVED AGENT' : '⧗ PENDING APPROVAL'}
                                    </Badge>

                                    {/* {agent.agentTier && (
                                        <Badge className="bg-blue-600 text-white border-none shadow-lg px-4 py-1.5 rounded-xl font-bold text-xs uppercase">
                                            {agent.agentTier} TIER
                                        </Badge>
                                    )} */}

                                 
                                </div>
                            </div>

                           
                        </div>
                    </div>

                    <CardContent className="p-6 md:p-12 pt-28 md:pt-32 space-y-16 bg-white">

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left Content Area */}
                            <div className="lg:col-span-2 space-y-16">

                                {/* Section: Company Information */}
                                <div className="space-y-8">
                                    <SectionHeader icon={Building2} title="Company Information" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <DetailItem icon={Globe} label="Legal Name" value={agent.legalName || 'N/A'} />
                                        <DetailItem icon={Award} label="Trading Name" value={agent.tradingName || 'N/A'} />
                                        <DetailItem icon={Calendar} label="Year Established" value={agent.yearEstablished?.toString() || 'N/A'} />
                                        <DetailItem icon={Globe} label="Gov Registration #" value={agent.businessRegistrationNumber || 'N/A'} />
                                        <DetailItem icon={MapPin} label="Country of Registration" value={agent.countryOfRegistration || 'N/A'} />
                                        <DetailItem
                                            icon={ExternalLink}
                                            label="Website"
                                            value={agent.websiteUrl || 'N/A'}
                                            isLink={!!agent.websiteUrl}
                                        />
                                        <DetailItem
                                            icon={ExternalLink}
                                            label="Calendly Link"
                                            value={agent.calendlyLink || 'N/A'}
                                            isLink={!!agent.calendlyLink}
                                        />
                                        <DetailItem icon={Award} label="Business Registration Number" value={agent.businessRegistrationNumber || 'N/A'} />

                                    </div>
                                </div>

                                {/* Section: Contact Information */}
                                <div className="space-y-8">
                                    <SectionHeader icon={User} title="Contact Information" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <DetailItem icon={User} label="Contact Person" value={agent.contactPersonName || fullName} />
                                        <DetailItem icon={Briefcase} label="Designation" value={agent.designation || 'N/A'} />
                                        <DetailItem icon={Mail} label="Official Email" value={agent.officialEmail || agent.email} />
                                        <DetailItem icon={Phone} label="Official Phone" value={agent.phoneNumber || agent.phone || 'N/A'} />
                                        <div className="sm:col-span-2">
                                            <DetailItem icon={MapPin} label="Office Address" value={agent.officeAddress || 'N/A'} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Academic Background / Business Details */}
                                <div className="space-y-8">
                                    <SectionHeader icon={Briefcase} title="Business Operations" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <DetailItem icon={Clock} label="Avg Students/Year" value={agent.averageStudentsPerYearLast2Years?.toString() || 'N/A'} />
                                        <DetailItem icon={Award} label="Active Counsellors" value={agent.numberOfCounsellors?.toString() || 'N/A'} />

                                        <div className="sm:col-span-2">
                                            <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col gap-6 shadow-sm">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Primary Markets</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {agent.primaryStudentMarkets && agent.primaryStudentMarkets.length > 0 ? (
                                                            agent.primaryStudentMarkets.map((m, i) => (
                                                                <span key={i} className="px-4 py-2 bg-white border border-edvios-green/20 text-edvios-green text-sm font-bold rounded-2xl shadow-sm">{m}</span>
                                                            ))
                                                        ) : <span className="text-gray-400 text-sm italic">N/A</span>}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-3">Main Destinations</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {agent.mainDestinations && agent.mainDestinations.length > 0 ? (
                                                            agent.mainDestinations.map((d, i) => (
                                                                <span key={i} className="px-4 py-2 bg-white border border-blue-200 text-blue-600 text-sm font-bold rounded-2xl shadow-sm">{d}</span>
                                                            ))
                                                        ) : <span className="text-gray-400 text-sm italic">N/A</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Area */}
                            <div className="space-y-12">
                                {/* Verification Status Card */}
                                <div className="rounded-[2.5rem] p-8 text-white shadow-2xl space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-edvios-green rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                            <Shield className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black tracking-tight">System Status</h4>
                                            <p className="text-xs text-gray-400 font-medium">Verification record</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-white/10">
                                        <Row label="Member Since" value={new Date(agent.createdAt).toLocaleDateString()} />
                                        <Row label="Security Role" value={agent.role} />
                                    </div>

                                    
                                </div>

                                {/* Accreditations & Boolean Checks */}
                                <div className="space-y-6">
                                    <SectionHeader icon={Award} title="Accreditations" />
                                    <div className="space-y-3">
                                        <BooleanRow label="Gov Education Councils" value={agent.registeredWithEducationCouncils} />
                                        <BooleanRow label="Working with UK Inst." value={agent.workingWithUkInstitutions} />
                                        <BooleanRow label="Working with Canada Inst." value={agent.workingWithCanadaInstitutions} />
                                        <BooleanRow label="Working with Australia Inst." value={agent.workingWithAustraliaInstitutions} />
                                        <BooleanRow label="In-house Visa Support" value={agent.inHouseVisaSupport} />
                                    </div>
                                </div>

                                {/* Platform Interests */}
                                <div className="space-y-6">
                                    <SectionHeader icon={CheckCircle2} title="Interested Features" />
                                    <div className="flex flex-wrap gap-2">
                                        {agent.interestedFeatures && agent.interestedFeatures.length > 0 ? (
                                            agent.interestedFeatures.map((f, i) => (
                                                <Badge key={i} variant="outline" className="px-4 py-2 border-edvios-green/20 bg-edvios-green/5 text-edvios-green text-[10px] font-black uppercase tracking-wider rounded-xl">
                                                    {f.replace(/_/g, ' ')}
                                                </Badge>
                                            ))
                                        ) : <span className="text-gray-400 text-xs italic">N/A</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Services & Reason Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                            <div className="space-y-8">
                                <SectionHeader icon={Info} title="Services Provided" />
                                <div className="flex flex-wrap gap-3">
                                    {agent.servicesProvided && agent.servicesProvided.length > 0 ? (
                                        agent.servicesProvided.map((s, i) => (
                                            <div key={i} className="flex items-center gap-3 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-edvios-green transition-all">
                                                <div className="w-2 h-2 rounded-full bg-edvios-green group-hover:scale-150 transition-transform"></div>
                                                <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{s.replace(/_/g, ' ')}</span>
                                            </div>
                                        ))
                                    ) : <p className="text-gray-400 text-xs italic">None listed</p>}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <SectionHeader icon={FileText} title="Goal/Mission on Platform" />
                                <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                                    <p className="text-sm md:text-base text-blue-900 leading-relaxed font-medium italic relative z-10">
                                        &quot;{agent.reasonToUseEdvios || 'No specific mission provided at registration.'}&quot;
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section: Documents */}
                        <div className="space-y-10 pt-8">
                            <SectionHeader icon={FileText} title="Documentation & Compliance" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {agent.businessRegistrationCertificate && (
                                    <DocumentCard
                                        title="Registration Certificate"
                                        url={agent.businessRegistrationCertificate}
                                        subtitle="Primary Proof of Business"
                                    />
                                )}
                                {agent.officeAddressProof && (
                                    <DocumentCard
                                        title="Office Address Proof"
                                        url={agent.officeAddressProof}
                                        subtitle="Utility bill or lease agreement"
                                    />
                                )}
                                {!agent.businessRegistrationCertificate && !agent.officeAddressProof && (
                                    <div className="col-span-full p-16 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                                        <p className="text-gray-400 font-black uppercase tracking-widest">No digital documentation uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {agent.notes && (
                            <div className="space-y-6 pt-8">
                                <SectionHeader icon={FileText} title="Internal Administrative Notes" />
                                <div className="p-8 bg-yellow-50 rounded-[2rem] border border-yellow-200 shadow-sm">
                                    <p className="text-sm text-yellow-900 font-medium leading-relaxed">{agent.notes}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

/* ------------------ Helpers ------------------ */

const SectionHeader = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
    <h3 className="text-xs md:text-sm font-black text-edvios-blue uppercase tracking-[0.3em] flex items-center gap-4 border-b-2 border-edvios-green/10 pb-6 mb-2">
        <Icon className="w-6 h-6 text-edvios-green" /> {title}
    </h3>
);

const DetailItem = ({ icon: Icon, label, value, isLink }: { icon: LucideIcon; label: string; value: string; isLink?: boolean }) => (
    <div className="flex items-start gap-4 p-1 hover:bg-edvios-green/5 rounded-[1.5rem] transition-all group border border-transparent hover:border-edvios-green/10 h-full min-w-0 w-full">
        
        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-edvios-green group-hover:bg-white transition-all shrink-0 shadow-sm group-hover:shadow-md group-hover:-translate-y-1">
            <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1 py-1 w-full">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">
                {label}
            </p>

            {isLink ? (
                <a
                    href={value.startsWith('http') ? value : `https://${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-edvios-green font-black text-base break-all whitespace-pre-wrap hover:underline flex items-center gap-2"
                >
                    {value}
                    <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
            ) : (
                <p className="text-gray-900 font-black text-base break-all whitespace-pre-wrap">
                    {value}
                </p>
            )}
        </div>
    </div>
);


const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-2 px-3 rounded-xl hover:bg-white/5 transition-colors">
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{label}</span>
        <span className="font-mono text-xs text-edvios-green font-bold bg-edvios-green/10 px-2 py-1 rounded-md">{value}</span>
    </div>
);

const BooleanRow = ({ label, value }: { label: string; value?: boolean }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{label}</span>
        {value ? (
            <div className="bg-edvios-green/10 p-1.5 rounded-full scale-110">
                <CheckCircle2 className="w-4 h-4 text-edvios-green" />
            </div>
        ) : (
            <div className="bg-gray-200/50 p-1.5 rounded-full opacity-50">
                <XCircle className="w-4 h-4 text-gray-400" />
            </div>
        )}
    </div>
);

const DocumentCard = ({ title, url, subtitle }: { title: string; url: string; subtitle: string }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-5 p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:border-edvios-green/50 hover:bg-edvios-green/5 transition-all group shadow-sm hover:shadow-xl text-center relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-edvios-green transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="w-20 h-20 mx-auto rounded-3xl bg-edvios-green/10 flex items-center justify-center text-edvios-green group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner">
                <FileText className="w-10 h-10" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-black text-gray-900 mb-1">{title}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">{subtitle}</p>
                <div className="flex items-center justify-center gap-2 text-xs font-black text-edvios-green opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    VIEW DOCUMENT <ExternalLink className="w-3 h-3" />
                </div>
            </div>
        </a>
    );
};

export default AgentProfilePage;
