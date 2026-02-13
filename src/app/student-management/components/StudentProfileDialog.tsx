'use client';

import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
      DialogFooter,
} from '@/components/ui/dialog';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Student } from '../types/student.types';
import { LucideIcon } from "lucide-react";

import {
    Mail,
    Phone,
    MapPin,
    BookOpen,
    Calendar,
    User,
    GraduationCap,
    Clock,
    FileText,
    Globe,
    Building2,
    Briefcase,
    Heart
} from 'lucide-react';

interface StudentProfileDialogProps {
    student: Student | null;
    open: boolean;
    onClose: () => void;
}

export const StudentProfileDialog: React.FC<StudentProfileDialogProps> = ({
    student,
    open,
    onClose,
}) => {
    if (!student) return null;

    // Help extract name safely
    const firstName = student.user?.firstName || student.firstName || '';
    const lastName = student.user?.lastName || student.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown Student';
    const email = student.user?.email || student.email;
    const phone = student.user?.phone || student.phone;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-[95vw] md:w-full max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-2xl md:rounded-3xl">
                <VisuallyHidden>
                    <DialogTitle>Agent profile</DialogTitle>
                    <DialogDescription>
                    View detailed agent information and account status.
                    </DialogDescription>
                </VisuallyHidden>
                <div className="bg-edvios-green h-32 md:h-40 w-full relative">
                    <div className="absolute -bottom-12 left-4 md:left-8 flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 text-center md:text-left w-full md:w-auto px-4 md:px-0">
                        <div className="mt-2 w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary font-bold text-3xl md:text-4xl border-4 border-white">
                            {(firstName?.[0] || '') + (lastName?.[0] || '')}
                        </div>
                        <div className="md:mb-2 md:pb-2">
                            <p className="text-2xl md:text-3xl font-bold text-gray-900 md:text-white bg-white md:bg-transparent px-4 py-1 rounded-xl md:p-0 shadow-sm md:shadow-none">{fullName}</p>
                            <p className="text-primary md:text-primary font-medium text-sm md:text-base">Student ID: {student.id}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-8 pt-24 md:pt-20 space-y-8 md:space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        {/* Personal & Contact Details */}
                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[10px] md:text-xs font-bold text-gradient uppercase tracking-[0.2em] flex items-center gap-2">
                                <User className="w-3.5 h-3.5 md:w-4 md:h-4" /> Personal & Contact
                            </h4>
                            <div className="grid gap-3 md:gap-4">
                                <DetailItem icon={Mail} label="Email Address" value={email} />
                                <DetailItem icon={Phone} label="Phone Number" value={phone || 'Not Provided'} />
                                <DetailItem icon={Globe} label="Nationality" value={student.nationality || 'Not Provided'} />
                                <DetailItem icon={MapPin} label="Current Location" value={`${student.currentCity ? student.currentCity + ', ' : ''}${student.currentCountry || 'Not Provided'}`} />
                                <DetailItem icon={Calendar} label="Date of Birth" value={student.dob ? new Date(student.dob).toLocaleDateString() : 'Not Provided'} />
                            </div>
                        </div>

                        {/* Academic Background */}
                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[10px] md:text-xs font-bold text-gradient uppercase tracking-[0.2em] flex items-center gap-2">
                                <GraduationCap className="w-3.5 h-3.5 md:w-4 md:h-4" /> Academic Background
                            </h4>
                            <div className="grid gap-3 md:gap-4">
                                <DetailItem icon={Building2} label="Last Institution" value={student.currentInstitution || 'Not Provided'} />
                                <DetailItem icon={BookOpen} label="Field of Study" value={student.fieldOfStudy || 'Not Provided'} />
                                <DetailItem icon={FileText} label="GPA / Grade" value={student.gpa || 'Not Provided'} />
                                <DetailItem icon={Calendar} label="Graduation Date" value={student.graduationDate ? new Date(student.graduationDate).toLocaleDateString() : 'Not Provided'} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        {/* Preferences */}
                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[10px] md:text-xs font-bold text-gradient uppercase tracking-[0.2em] flex items-center gap-2\">
                                <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" /> Study Preferences
                            </h4>
                            <div className="grid gap-3 md:gap-4">
                                <DetailItem icon={Globe} label="Preferred Destination" value={student.preferredDestination || 'Not Provided'} />
                                <DetailItem icon={BookOpen} label="Preferred Program" value={student.preferredProgram || 'Not Provided'} />
                                <DetailItem icon={Clock} label="Preferred Intake" value={student.preferredIntake || 'Not Provided'} />
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[10px] md:text-xs font-bold text-gradient uppercase tracking-[0.2em] flex items-center gap-2">
                                <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4" /> Additional Information
                            </h4>
                            <div className="grid gap-3 md:gap-4">
                                <DetailItem icon={Briefcase} label="Work Experience" value={student.workExperience || 'None'} />
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <span className="text-[10px] text-gray-500 font-medium uppercase">Scholarship Interest</span>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${student.scholarshipInterest ? 'bg-edvios-green text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {student.scholarshipInterest ? 'YES' : 'NO'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4 text-xs md:text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>Registered: {new Date(student.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>Last Updated: {new Date(student.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 md:p-8 border-t bg-gray-50/80 rounded-b-2xl md:rounded-b-3xl">
                    <Button variant="outline" onClick={onClose} className="w-full md:w-auto h-12 px-8 rounded-xl border-gray-200 hover:bg-white hover:text-gradient transition-all font-semibold">
                        Close Profile
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DetailItem = ({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) => (
    <div className="flex items-start gap-3 p-3 hover:bg-edvios-green/5 rounded-2xl transition-colors group">
        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-gradient group-hover:border-gradient transition-all">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
            <p className="text-gray-700 font-semibold">{value}</p>
        </div>
    </div>
);
