'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
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
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Agent } from '../types/agent.types';
import { getAgent, approveAgent } from '../api/agent.api';
import { AppToast } from '@/utils/toast-utils';
import { LucideIcon } from 'lucide-react';

const AgentProfilePage = () => {
    const params = useParams();
    const router = useRouter();
    const agentId = params.id as string;

    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAgentData = useCallback(async () => {
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
    }, [agentId, router]);

    useEffect(() => {
        if (agentId) {
            fetchAgentData();
        }
    }, [agentId, fetchAgentData]);

    const handleApprove = async () => {
        if (!agent) return;
        try {
            setActionLoading(true);
            await approveAgent(agent.id);
            AppToast.success('Agent approved successfully');
            fetchAgentData(); // Refresh data
        } catch {
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
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full space-y-6">
                <div className="flex items-center justify-between">
                    <Breadcrumb
                        items={[
                            { label: "Agent Management", href: "/agent-management" },
                            { label: fullName, active: true }
                        ]}
                        className="mb-0"
                    />
                    {agent.role === 'PENDING_AGENT' && (
                        <Button
                            onClick={handleApprove}
                            disabled={actionLoading}
                            className="bg-edvios-green hover:bg-edvios-green/90 text-white font-bold text-xs uppercase tracking-widest h-10 px-6 rounded-md shadow-none"
                        >
                            {actionLoading
                                ? <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                : <CheckCircle className="w-4 h-4 mr-2" />
                            }
                            Approve Agent
                        </Button>
                    )}
                </div>

                <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                    <div className="bg-edvios-green/5 h-32 w-full relative group">
                        <div className="absolute -bottom-10 left-8 flex items-end gap-4 overflow-visible">
                            <div className="w-24 h-24 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-edvios-green font-bold text-3xl shadow-sm">
                                {(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}
                            </div>
                            <div className="mb-2">
                                <h1 className="text-2xl font-bold text-edvios-blue">{fullName}</h1>
                                <div className="flex gap-2 mt-1">
                                    <Badge
                                        className={
                                            agent.role === 'AGENT'
                                                ? 'bg-edvios-green/10 text-edvios-green border-edvios-green/20 px-2 py-0.5 rounded-full font-bold text-[10px]'
                                                : 'bg-yellow-100 text-yellow-700 border-yellow-200 px-2 py-0.5 rounded-full font-bold text-[10px]'
                                        }
                                    >
                                        {agent.role === 'AGENT' ? 'APPROVED' : 'PENDING'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-16 space-y-12 bg-white">

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
                                            <div className="p-6 bg-gray-50 rounded-lg border border-gray-100 flex flex-col gap-6">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Primary Markets</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {agent.primaryStudentMarkets && agent.primaryStudentMarkets.length > 0 ? (
                                                            agent.primaryStudentMarkets.map((m, i) => (
                                                                <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold rounded text-gray-700">{m}</span>
                                                            ))
                                                        ) : <span className="text-gray-400 text-xs italic">N/A</span>}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Main Destinations</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {agent.mainDestinations && agent.mainDestinations.length > 0 ? (
                                                            agent.mainDestinations.map((d, i) => (
                                                                <span key={i} className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold rounded text-gray-700">{d}</span>
                                                            ))
                                                        ) : <span className="text-gray-400 text-xs italic">N/A</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Area */}
                            <div className="space-y-12">
                                {/* Verification Status Info */}
                                <div className="rounded-lg p-6 bg-gray-50 border border-gray-100 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-edvios-green/10 rounded flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-edvios-green" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">System Status</h4>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verification record</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-gray-200">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-4">
                                <SectionHeader icon={Info} title="Services Provided" />
                                <div className="flex flex-wrap gap-2">
                                    {agent.servicesProvided && agent.servicesProvided.length > 0 ? (
                                        agent.servicesProvided.map((s, i) => (
                                            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded border border-gray-100 group">
                                                <div className="w-1.5 h-1.5 rounded-full bg-edvios-green"></div>
                                                <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{s.replace(/_/g, ' ')}</span>
                                            </div>
                                        ))
                                    ) : <p className="text-gray-400 text-xs italic">None listed</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <SectionHeader icon={FileText} title="Goal/Mission on Platform" />
                                <div className="p-6 bg-background rounded-lg border border-gray-100">
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                                        &quot;{agent.reasonToUseEdvios || 'No specific mission provided at registration.'}&quot;
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section: Documents */}
                        <div className="space-y-6 pt-4">
                            <SectionHeader icon={FileText} title="Documentation & Compliance" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {agent.businessRegistrationCertificate && (
                                    <DocumentCard
                                        title="Registration Certificate"
                                        url={agent.businessRegistrationCertificate}
                                        subtitle="Primary Proof"
                                    />
                                )}
                                {agent.officeAddressProof && (
                                    <DocumentCard
                                        title="Office Address Proof"
                                        url={agent.officeAddressProof}
                                        subtitle="Utility bill/Lease"
                                    />
                                )}
                                {!agent.businessRegistrationCertificate && !agent.officeAddressProof && (
                                    <div className="col-span-full p-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No documentation uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {agent.notes && (
                            <div className="space-y-4 pt-4">
                                <SectionHeader icon={FileText} title="Administrative Notes" />
                                <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <p className="text-xs text-yellow-900 font-medium leading-relaxed">{agent.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ------------------ Helpers ------------------ */

const SectionHeader = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
        <Icon className="w-3.5 h-3.5" /> {title}
    </h3>
);

const DetailItem = ({ icon: Icon, label, value, isLink }: { icon: LucideIcon; label: string; value: string; isLink?: boolean }) => (
    <div className="flex items-start gap-3 py-2">
        <div className="w-8 h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
            <Icon className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                {label}
            </p>

            {isLink ? (
                <a
                    href={value.startsWith('http') ? value : `https://${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-edvios-green font-bold text-sm break-all hover:underline flex items-center gap-2"
                >
                    {value}
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
            ) : (
                <p className="text-sm text-gray-900 font-medium break-all">
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
            className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg hover:border-edvios-green/50 hover:bg-edvios-green/5 transition-all group shadow-sm"
        >
            <div className="w-10 h-10 rounded bg-edvios-green/10 flex items-center justify-center text-edvios-green shrink-0">
                <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-800 truncate mb-0.5">{title}</p>
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{subtitle}</p>
            </div>
        </a>
    );
};

export default AgentProfilePage;
