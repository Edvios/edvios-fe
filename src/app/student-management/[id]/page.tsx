'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
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
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Student } from '../types/student.types';
import { getStudent } from '../api/student.api';
import { AppToast } from '@/utils/toast-utils';
import { StudentProfileSkeleton } from '../skeletons/student-profile';

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
        return <StudentProfileSkeleton />;
    }

    if (!student) return null;

    const firstName = student.user?.firstName || student.firstName || '';
    const lastName = student.user?.lastName || student.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown Student';
    const email = student.user?.email || student.email;
    const phone = student.user?.phone || student.phone;

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full space-y-6">
                <Breadcrumb
                    items={[
                        { label: "Student Management", href: "/student-management" },
                        { label: fullName, active: true }
                    ]}
                />

                <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-edvios-green/10 via-edvios-green/5 to-transparent h-32 w-full relative group">
                        <div className="absolute -bottom-10 left-8 flex items-end gap-4">
                            <div className="w-24 h-24 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-edvios-green font-bold text-3xl shadow-md">
                                {(firstName?.[0] || '') + (lastName?.[0] || '')}
                            </div>
                            <div className="mb-2">
                                <h2 className="text-2xl font-bold text-edvios-blue">{fullName}</h2>
                                {student.visaRiskBand && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${student.visaRiskBand === 'LOW' ? 'bg-green-100 text-green-700 border-green-200' :
                                        student.visaRiskBand === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                            'bg-red-100 text-red-700 border-red-200'
                                        }`}>
                                        RISK: {student.visaRiskBand}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-16 space-y-10">
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
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">Preferred Countries for Study</p>
                                        <div className="flex flex-wrap gap-2">
                                            {student.preferredCountries && student.preferredCountries.length > 0 ? (
                                                student.preferredCountries.map((country, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-white border border-gray-200 text-xs font-bold rounded text-gray-700">
                                                        {country}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">No preferences listed</span>
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
                                                className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-lg hover:border-edvios-green/50 hover:bg-edvios-green/5 transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded bg-edvios-green/10 flex items-center justify-center text-edvios-green shrink-0">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-bold text-gray-800 truncate mb-0.5">{fileName}</p>
                                                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Download</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
    <h3 className="text-[10px] font-bold text-edvios-green uppercase tracking-widest flex items-center gap-2 border-b border-edvios-green/10 pb-2">
        <Icon className="w-3.5 h-3.5" /> {title}
    </h3>
);

const DetailItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) => (
    <div className="flex items-start gap-3 py-2 group">
        <div className="w-8 h-8 rounded bg-edvios-green/5 border border-edvios-green/10 flex items-center justify-center text-edvios-green group-hover:bg-edvios-green/10 transition-colors shrink-0">
            <Icon className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm text-gray-900 font-medium break-words leading-tight">{value}</p>
        </div>
    </div>
);

export default StudentProfilePage;
