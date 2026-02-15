"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStudentProfile } from "./hooks/use-student-profile";
import { StudentProfileData, Gender, EnglishTestType, StudyLevel, FundingSource } from "./types/student-profile.types";
import {
    Edit3,
    Loader2,
    Save,
    X,
} from "lucide-react";

export default function StudentProfilePage() {
    // Get student ID from session storage
    const getStudentIdFromSession = (): string | undefined => {
        if (typeof window === "undefined") return undefined;
        const raw = sessionStorage.getItem("user-session");
        if (!raw) return undefined;
        try {
            const parsed: { id?: string; userId?: string; studentId?: string; data?: { id?: string } } = JSON.parse(raw);
            return parsed?.id || parsed?.userId || parsed?.studentId || parsed?.data?.id;
        } catch {
            return undefined;
        }
    };

    const studentId = getStudentIdFromSession();
    const { data: profileData, loading, saveStudent } = useStudentProfile(studentId);

    const mergedProfileData = useMemo(() => {
        if (!profileData) return {} as StudentProfileData;
        return {
            ...profileData,
            firstName: profileData.firstName || profileData.user?.firstName || "",
            lastName: profileData.lastName || profileData.user?.lastName || "",
            email: profileData.email || profileData.user?.email || "",
            phone: profileData.phone || profileData.user?.phone || "",
        } as StudentProfileData;
    }, [profileData]);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<StudentProfileData>(mergedProfileData);

    const [prevProfileData, setPrevProfileData] = useState(profileData);

    // Sync form data when profile data arrives or changes
    if (profileData !== prevProfileData) {
        setPrevProfileData(profileData);
        setFormData(mergedProfileData);
    }



    const handleSave = async () => {
        if (!studentId) {
            alert("Student ID not found");
            return;
        }

        try {
            await saveStudent(studentId, formData);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Failed to save profile. Please try again.");
        }
    };

    const handleCancel = () => {
        setFormData(mergedProfileData);
        setIsEditing(false);
    };

    const updateField = <K extends keyof StudentProfileData>(field: K, value: StudentProfileData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="w-full px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {formData.firstName && formData.lastName
                                        ? `${formData.firstName} ${formData.lastName}`
                                        : formData.email || "Student Profile"}
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {formData.nationality || "International Student"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {!isEditing ? (
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditing(true)}
                                    className="border-gray-300"
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="border-gray-300"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={loading}
                                        onClick={handleSave}
                                        className="bg-slate-700 hover:bg-slate-800"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4 mr-2" />
                                        )}
                                        Save Changes
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="w-full px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <div className="border border-gray-100 rounded-lg lg:col-span-2">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                                Personal Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">First Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.firstName || ""}
                                            onChange={(e) => updateField("firstName", e.target.value)}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.firstName || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Last Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.lastName || ""}
                                            onChange={(e) => updateField("lastName", e.target.value)}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.lastName || "—"}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Date of Birth</Label>
                                    {isEditing ? (
                                        <Input
                                            type="date"
                                            value={formData.dob ? formData.dob.split("T")[0] : ""}
                                            onChange={(e) => updateField("dob", e.target.value)}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">
                                            {formData.dob ? new Date(formData.dob).toLocaleDateString() : "—"}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Gender</Label>
                                    {isEditing ? (
                                        <Select
                                            value={formData.gender || ""}
                                            onValueChange={(value) => updateField("gender", value as Gender)}
                                        >
                                            <SelectTrigger className="border-gray-300">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={Gender.MALE}>Male</SelectItem>
                                                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                                <SelectItem value={Gender.OTHER}>Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.gender || "—"}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Nationality</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.nationality || ""}
                                            onChange={(e) => updateField("nationality", e.target.value)}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.nationality || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Country of Residence</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.countryOfResidence || ""}
                                            onChange={(e) => updateField("countryOfResidence", e.target.value)}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.countryOfResidence || "—"}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Passport Number</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.passportNumber || ""}
                                            onChange={(e) => updateField("passportNumber", e.target.value)}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.passportNumber || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Passport Expiry</Label>
                                    {isEditing ? (
                                        <Input
                                            type="date"
                                            value={formData.passportExpiryDate ? formData.passportExpiryDate.split("T")[0] : ""}
                                            onChange={(e) => updateField("passportExpiryDate", e.target.value)}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">
                                            {formData.passportExpiryDate
                                                ? new Date(formData.passportExpiryDate).toLocaleDateString()
                                                : "—"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border border-gray-100 rounded-lg">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                                Contact Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Email</Label>
                                {isEditing ? (
                                    <Input
                                        type="email"
                                        value={formData.email || ""}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.email || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Phone</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.phone || ""}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.phone || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Emergency Contact</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.emergencyContact || ""}
                                        onChange={(e) => updateField("emergencyContact", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.emergencyContact || "—"}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Academic Background */}
                    <div className="border border-gray-100 rounded-lg lg:col-span-2">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                                Academic Background
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Highest Qualification</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.highestQualification || ""}
                                        onChange={(e) => updateField("highestQualification", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.highestQualification || "—"}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Institution Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.institutionName || ""}
                                            onChange={(e) => updateField("institutionName", e.target.value)}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.institutionName || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Year of Completion</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={formData.yearOfCompletion || ""}
                                            onChange={(e) => updateField("yearOfCompletion", parseInt(e.target.value))}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.yearOfCompletion || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Medium of Instruction</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.mediumOfInstruction || ""}
                                            onChange={(e) => updateField("mediumOfInstruction", e.target.value)}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.mediumOfInstruction || "—"}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Grades Summary</Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.gradesSummary || ""}
                                        onChange={(e) => updateField("gradesSummary", e.target.value)}
                                        className="border-gray-300"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.gradesSummary || "—"}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* English Proficiency */}
                    <div className="border border-gray-100 rounded-lg">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                                English Proficiency
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Test Type</Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.englishTestTaken || ""}
                                        onValueChange={(value) => updateField("englishTestTaken", value as EnglishTestType)}
                                    >
                                        <SelectTrigger className="border-gray-300">
                                            <SelectValue placeholder="Select test type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={EnglishTestType.IELTS}>IELTS</SelectItem>
                                            <SelectItem value={EnglishTestType.PTE}>PTE</SelectItem>
                                            <SelectItem value={EnglishTestType.DUOLINGO}>Duolingo</SelectItem>
                                            <SelectItem value={EnglishTestType.NONE}>None</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.englishTestTaken || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Overall Score</Label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        step="0.5"
                                        value={formData.overallScore || ""}
                                        onChange={(e) => updateField("overallScore", parseFloat(e.target.value))}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.overallScore || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Test Expiry Date</Label>
                                {isEditing ? (
                                    <Input
                                        type="date"
                                        value={formData.testExpiryDate ? formData.testExpiryDate.split("T")[0] : ""}
                                        onChange={(e) => updateField("testExpiryDate", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">
                                        {formData.testExpiryDate
                                            ? new Date(formData.testExpiryDate).toLocaleDateString()
                                            : "—"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Study Preferences */}
                    <div className="border border-gray-100 rounded-lg lg:col-span-2">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                                Study Preferences
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Intake Month</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={formData.intendedIntakeMonth || ""}
                                            onChange={(e) => updateField("intendedIntakeMonth", parseInt(e.target.value))}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.intendedIntakeMonth || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Intake Year</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={formData.intendedIntakeYear || ""}
                                            onChange={(e) => updateField("intendedIntakeYear", parseInt(e.target.value))}
                                            className="border-gray-300"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.intendedIntakeYear || "—"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Study Level</Label>
                                    {isEditing ? (
                                        <Select
                                            value={formData.preferredStudyLevel || ""}
                                            onValueChange={(value) => updateField("preferredStudyLevel", value as StudyLevel)}
                                        >
                                            <SelectTrigger className="border-gray-300">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={StudyLevel.BACHELORS}>Bachelor</SelectItem>
                                                <SelectItem value={StudyLevel.MASTERS}>Masters</SelectItem>
                                                <SelectItem value={StudyLevel.PHD}>PhD</SelectItem>
                                                <SelectItem value={StudyLevel.DIPLOMA}>Diploma</SelectItem>
                                                <SelectItem value={StudyLevel.CERTIFICATE}>Certificate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.preferredStudyLevel || "—"}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Preferred Field of Study</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.preferredFieldOfStudy || ""}
                                        onChange={(e) => updateField("preferredFieldOfStudy", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.preferredFieldOfStudy || "—"}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="border border-gray-100 rounded-lg">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                                Financial Information
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Estimated Budget (USD)</Label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={formData.estimatedBudget || ""}
                                        onChange={(e) => updateField("estimatedBudget", parseFloat(e.target.value))}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">
                                        {formData.estimatedBudget ? `$${formData.estimatedBudget.toLocaleString()}` : "—"}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Funding Source</Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.fundingSource || ""}
                                        onValueChange={(value) => updateField("fundingSource", value as FundingSource)}
                                    >
                                        <SelectTrigger className="border-gray-300">
                                            <SelectValue placeholder="Select funding source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={FundingSource.SELF}>Self Funded</SelectItem>
                                            <SelectItem value={FundingSource.PARENTS}>Parents</SelectItem>
                                            <SelectItem value={FundingSource.SPONSOR}>Sponsor</SelectItem>
                                            <SelectItem value={FundingSource.LOAN}>Loan</SelectItem>
                                            <SelectItem value={FundingSource.SCHOLARSHIP}>Scholarship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="text-sm text-gray-900">
                                        {formData.fundingSource?.replace(/_/g, " ") || "—"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Visa & Immigration */}
                    <div className="border border-gray-100 rounded-lg lg:col-span-3">
                        <div className="border-b border-gray-100 px-6 py-4">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                                Visa & Immigration
                            </h3>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Previous Visa Refusal</Label>
                                    {isEditing ? (
                                        <Select
                                            value={formData.previousVisaRefusal ? "true" : "false"}
                                            onValueChange={(value) => updateField("previousVisaRefusal", value === "true")}
                                        >
                                            <SelectTrigger className="border-gray-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="false">No</SelectItem>
                                                <SelectItem value="true">Yes</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-sm text-gray-900">
                                            {formData.previousVisaRefusal ? "Yes" : "No"}
                                        </p>
                                    )}
                                </div>

                                {formData.previousVisaRefusal && (
                                    <div className="md:col-span-2">
                                        <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Refusal Details</Label>
                                        {isEditing ? (
                                            <Textarea
                                                value={formData.visaRefusalDetails || ""}
                                                onChange={(e) => updateField("visaRefusalDetails", e.target.value)}
                                                className="border-gray-300"
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-sm text-gray-900">{formData.visaRefusalDetails || "—"}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Travel History</Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.travelHistory || ""}
                                        onChange={(e) => updateField("travelHistory", e.target.value)}
                                        className="border-gray-300"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.travelHistory || "—"}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}