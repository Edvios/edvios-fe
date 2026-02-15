'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    BookOpen,
    Calendar,
    User,
    GraduationCap,
    FileText,
    Globe,
    Building2,
    Briefcase,
    Heart,
    LucideIcon,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Student } from '../types/student.types';
import { getStudent } from '../api/student.api';
import { AppToast } from '@/utils/toast-utils';

const StudentProfilePage = () => {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;

    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                const data = await getStudent(studentId);
                setStudent(data);
            } catch (error) {
                console.error('Error fetching student:', error);
                AppToast.error('Failed to load student details');
                router.push('/student-management');
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudentData();
        }
    }, [studentId, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-edvios-green animate-spin" />
                    <p className="text-gray-500 font-medium">Loading student profile...</p>
                </div>
            </div>
        );
    }

    if (!student) return null;

    const firstName = student.user?.firstName || student.firstName || '';
    const lastName = student.user?.lastName || student.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown Student';
    const email = student.user?.email || student.email;
    const phone = student.user?.phone || student.phone;

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-12">
            {/* Header / Navigation */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="gap-2 hover:bg-edvios-green/10 text-gray-600 hover:text-edvios-green transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to List
                    </Button>
                    <div className="hidden md:flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Student Profile</span>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <span className="text-xs font-bold text-edvios-green">{student.firstName} {student.lastName}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
                <Card className="border-none shadow-2xl overflow-hidden rounded-3xl">
                    <div className="bg-edvios-green h-40 md:h-50 w-full relative">
                        <div className="absolute -bottom-16 left-6 md:left-12 flex flex-col md:flex-row items-center md:items-end gap-2 text-center md:text-left">
                            <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl bg-white shadow-2xl flex items-center justify-center text-edvios-green font-bold text-4xl md:text-6xl border-8 border-white">
                                {(firstName?.[0] || '') + (lastName?.[0] || '')}
                            </div>
                            <div className="md:mb-4 ">
                                <p className="text-3xl md:text-5xl font-black text-edvios-blue drop-shadow-sm ">{fullName}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">

                                    {student.visaRiskBand && (
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border shadow-lg ${student.visaRiskBand === 'LOW' ? 'bg-green-100 text-green-700 border-green-200' :
                                            student.visaRiskBand === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                                'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                            Risk Band: {student.visaRiskBand}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-6 md:p-12 pt-28 md:pt-24 space-y-12 bg-white">
                        {/* Section: Personal & contact */}
                        <div className="space-y-8">
                            <SectionHeader icon={User} title="Personal & Contact Information" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailItem icon={Mail} label="Email Address" value={email} />
                                <DetailItem icon={Phone} label="Phone Number" value={phone || 'N/A'} />
                                <DetailItem icon={Phone} label="Emergency Contact" value={student.emergencyContact || 'N/A'} />
                                <DetailItem icon={Globe} label="Nationality" value={student.nationality || 'N/A'} />
                                <DetailItem icon={MapPin} label="Country of Residence" value={student.countryOfResidence || 'N/A'} />
                                <DetailItem icon={Calendar} label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'} />
                                <DetailItem icon={User} label="Gender" value={student.gender || 'N/A'} />
                                <DetailItem icon={FileText} label="Passport Number" value={student.passportNumber || 'N/A'} />
                                <DetailItem icon={Calendar} label="Passport Expiry" value={student.passportExpiryDate ? new Date(student.passportExpiryDate).toLocaleDateString() : 'N/A'} />
                            </div>
                        </div>

                        {/* Section: Academic Background */}
                        <div className="space-y-8">
                            <SectionHeader icon={GraduationCap} title="Academic Background" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailItem icon={GraduationCap} label="Highest Qualification" value={student.highestQualification || 'N/A'} />
                                <DetailItem icon={Building2} label="Institution Name" value={student.institutionName || 'N/A'} />
                                <DetailItem icon={Calendar} label="Completion Year" value={student.yearOfCompletion?.toString() || 'N/A'} />
                                <DetailItem icon={BookOpen} label="Medium of Instruction" value={student.mediumOfInstruction || 'N/A'} />
                                <DetailItem icon={FileText} label="Grades Summary" value={student.gradesSummary || 'N/A'} />
                            </div>
                        </div>

                        {/* Section: English Test */}
                        <div className="space-y-8">
                            <SectionHeader icon={Globe} title="English Proficiency" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailItem icon={Globe} label="Test Taken" value={student.englishTestTaken || 'NONE'} />
                                <DetailItem icon={FileText} label="Overall Score" value={student.overallScore?.toString() || 'N/A'} />
                                <DetailItem icon={Calendar} label="Test Expiry Date" value={student.testExpiryDate ? new Date(student.testExpiryDate).toLocaleDateString() : 'N/A'} />
                            </div>
                        </div>

                        {/* Section: Study Preferences */}
                        <div className="space-y-8">
                            <SectionHeader icon={Heart} title="Study Preferences" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <DetailItem icon={BookOpen} label="Preferred Field" value={student.preferredFieldOfStudy || 'N/A'} />
                                <DetailItem icon={GraduationCap} label="Preferred level" value={student.preferredStudyLevel || 'N/A'} />
                                <DetailItem icon={Calendar} label="Intended Intake" value={`${student.intendedIntakeMonth}/${student.intendedIntakeYear}`} />
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">Preferred Countries for Study</p>
                                        <div className="flex flex-wrap gap-2">
                                            {student.preferredCountries && student.preferredCountries.length > 0 ? (
                                                student.preferredCountries.map((country, idx) => (
                                                    <span key={idx} className="px-4 py-2 bg-white border border-edvios-green/20 text-edvios-green text-sm font-bold rounded-2xl shadow-sm">
                                                        {country}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">No preferences listed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Financial & Visa */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Financial */}
                            <div className="space-y-8">
                                <SectionHeader icon={Briefcase} title="Financial Overview" />
                                <div className="grid gap-6">
                                    <DetailItem icon={Briefcase} label="Estimated Budget" value={student.estimatedBudget ? `$${student.estimatedBudget.toLocaleString()}` : 'N/A'} />
                                    <DetailItem icon={Building2} label="Funding Source" value={student.fundingSource || 'N/A'} />
                                </div>
                            </div>

                            {/* Visa */}
                            <div className="space-y-8">
                                <SectionHeader icon={MapPin} title="Visa & Immigration History" />
                                <div className="grid gap-6">
                                    <DetailItem icon={FileText} label="Has Previous Visa Refusal?" value={student.previousVisaRefusal ? 'YES' : 'NO'} />
                                    {student.previousVisaRefusal && (
                                        <DetailItem icon={FileText} label="Visa Refusal Details" value={student.visaRefusalDetails || 'N/A'} />
                                    )}
                                    <DetailItem icon={Globe} label="Travel History" value={student.travelHistory || 'None'} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Documents */}
                        <div className="space-y-8">
                            <SectionHeader icon={FileText} title="Academic Certificates & Documents" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {student.academicCertificates && student.academicCertificates.length > 0 ? (
                                    student.academicCertificates.map((docUrl, idx) => {
                                        const fileName = docUrl.split('/').pop()?.split('?')[0] || `Document ${idx + 1}`;
                                        return (
                                            <a
                                                key={idx}
                                                href={docUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-col gap-4 p-6 bg-white border border-gray-100 rounded-3xl hover:border-edvios-green/50 hover:bg-edvios-green/5 transition-all group shadow-sm text-center"
                                            >
                                                <div className="w-16 h-16 mx-auto rounded-2xl bg-edvios-green/10 flex items-center justify-center text-edvios-green group-hover:scale-110 transition-transform">
                                                    <FileText className="w-8 h-8" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 break-all mb-1">{fileName}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Click to Download</p>
                                                </div>
                                            </a>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full p-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-400 font-bold">No academic documentation uploaded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const SectionHeader = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
    <h3 className="text-xs md:text-sm font-black text-edvios-blue uppercase tracking-[0.2em] flex items-center gap-3 border-b-2 border-edvios-green/10 pb-4">
        <Icon className="w-5 h-5 text-edvios-green" /> {title}
    </h3>
);

const DetailItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
    <div className="flex items-start gap-4 p-1 hover:bg-edvios-green/5 rounded-3xl transition-all group border border-transparent hover:border-edvios-green/10 h-full">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-edvios-green group-hover:bg-white transition-all shrink-0 shadow-sm">
            <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
            <p className="text-gray-900 font-black text-base break-words whitespace-pre-wrap">{value}</p>
        </div>
    </div>
);

export default StudentProfilePage;
