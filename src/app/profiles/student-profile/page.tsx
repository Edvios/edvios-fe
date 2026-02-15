"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStudentProfile } from "./hooks/use-student-profile";
import { StudentProfileData, Gender, EnglishTestType, StudyLevel, FundingSource } from "./types/student-profile.types";
import {
    User,
    GraduationCap,
    Globe,
    DollarSign,
    FileText,
    Edit3,
    Loader2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Award,
    Plane,
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

    const initials = useMemo(() => {
        const firstName = formData.firstName || "";
        const lastName = formData.lastName || "";
        if (firstName || lastName) {
            return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        }
        return (formData.email?.slice(0, 2).toUpperCase()) || "ST";
    }, [formData.firstName, formData.lastName, formData.email]);

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header Card */}
                <Card className="shadow-lg border-0 bg-gradient text-white">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-white">
                                        {formData.firstName && formData.lastName
                                            ? `${formData.firstName} ${formData.lastName}`
                                            : formData.email || "Student Profile"}
                                    </p>
                                    <p className="text-blue-100 mt-1">
                                        {formData.nationality || "International Student"}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center space-x-2">
                                {!isEditing ? (
                                    <Button
                                        className="bg-white text-black hover:bg-blue-50"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            size="sm"
                                            disabled={loading}
                                            onClick={handleSave}
                                            className="bg-white text-blue-600 hover:bg-blue-50"
                                        >
                                            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                                            Save Changes
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCancel}
                                            className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-blue-100">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <User className="w-5 h-5 text-blue-600" />
                                <CardTitle className="text-gray-800">Personal Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                                        <User className="w-3 h-3" /> First Name
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.firstName || ""}
                                            onChange={(e) => updateField("firstName", e.target.value)}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.firstName || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                                        <User className="w-3 h-3" /> Last Name
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.lastName || ""}
                                            onChange={(e) => updateField("lastName", e.target.value)}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.lastName || "-"}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Date of Birth
                                </Label>
                                {isEditing ? (
                                    <Input
                                        type="date"
                                        value={formData.dob ? formData.dob.split("T")[0] : ""}
                                        onChange={(e) => updateField("dob", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">
                                        {formData.dob ? new Date(formData.dob).toLocaleDateString() : "-"}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Gender</Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.gender || ""}
                                        onValueChange={(value) => updateField("gender", value as Gender)}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={Gender.MALE}>Male</SelectItem>
                                            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                                            <SelectItem value={Gender.OTHER}>Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.gender || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> Nationality
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.nationality || ""}
                                        onChange={(e) => updateField("nationality", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.nationality || "-"}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500">Passport Number</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.passportNumber || ""}
                                            onChange={(e) => updateField("passportNumber", e.target.value)}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.passportNumber || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500">Passport Expiry</Label>
                                    {isEditing ? (
                                        <Input
                                            type="date"
                                            value={formData.passportExpiryDate ? formData.passportExpiryDate.split("T")[0] : ""}
                                            onChange={(e) => updateField("passportExpiryDate", e.target.value)}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">
                                            {formData.passportExpiryDate
                                                ? new Date(formData.passportExpiryDate).toLocaleDateString()
                                                : "-"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Country of Residence
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.countryOfResidence || ""}
                                        onChange={(e) => updateField("countryOfResidence", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.countryOfResidence || "-"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-blue-100">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <Mail className="w-5 h-5 text-green-600" />
                                <CardTitle className="text-gray-800">Contact Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Email
                                </Label>
                                {isEditing ? (
                                    <Input
                                        type="email"
                                        value={formData.email || ""}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.email || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Phone
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.phone || ""}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.phone || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Emergency Contact
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.emergencyContact || ""}
                                        onChange={(e) => updateField("emergencyContact", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.emergencyContact || "-"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Background */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-blue-100">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <GraduationCap className="w-5 h-5 text-purple-600" />
                                <CardTitle className="text-gray-800">Academic Background</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Award className="w-3 h-3" /> Highest Qualification
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.highestQualification || ""}
                                        onChange={(e) => updateField("highestQualification", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.highestQualification || "-"}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500">Year of Completion</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={formData.yearOfCompletion || ""}
                                            onChange={(e) => updateField("yearOfCompletion", parseInt(e.target.value))}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.yearOfCompletion || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500">Medium of Instruction</Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.mediumOfInstruction || ""}
                                            onChange={(e) => updateField("mediumOfInstruction", e.target.value)}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.mediumOfInstruction || "-"}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" /> Institution Name
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.institutionName || ""}
                                        onChange={(e) => updateField("institutionName", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.institutionName || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Grades Summary</Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.gradesSummary || ""}
                                        onChange={(e) => updateField("gradesSummary", e.target.value)}
                                        className="mt-1"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.gradesSummary || "-"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* English Test */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-blue-100">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-orange-600" />
                                <CardTitle className="text-gray-800">English Proficiency</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label className="text-xs text-gray-500">Test Type</Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.englishTestTaken || ""}
                                        onValueChange={(value) => updateField("englishTestTaken", value as EnglishTestType)}
                                    >
                                        <SelectTrigger className="mt-1">
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
                                    <p className="font-medium text-gray-900 mt-1">{formData.englishTestTaken || "-"}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500">Overall Score</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            step="0.5"
                                            value={formData.overallScore || ""}
                                            onChange={(e) => updateField("overallScore", parseFloat(e.target.value))}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.overallScore || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500">Test Expiry Date</Label>
                                    {isEditing ? (
                                        <Input
                                            type="date"
                                            value={formData.testExpiryDate ? formData.testExpiryDate.split("T")[0] : ""}
                                            onChange={(e) => updateField("testExpiryDate", e.target.value)}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">
                                            {formData.testExpiryDate
                                                ? new Date(formData.testExpiryDate).toLocaleDateString()
                                                : "-"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Study Preferences */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow lg:col-span-2 bg-blue-100">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <Globe className="w-5 h-5 text-indigo-600" />
                                <CardTitle className="text-gray-800">Study Preferences</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500">Intended Intake Month</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            min="1"
                                            max="12"
                                            value={formData.intendedIntakeMonth || ""}
                                            onChange={(e) => updateField("intendedIntakeMonth", parseInt(e.target.value))}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.intendedIntakeMonth || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500">Intended Intake Year</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={formData.intendedIntakeYear || ""}
                                            onChange={(e) => updateField("intendedIntakeYear", parseInt(e.target.value))}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.intendedIntakeYear || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500">Preferred Study Level</Label>
                                    {isEditing ? (
                                        <Select
                                            value={formData.preferredStudyLevel || ""}
                                            onValueChange={(value) => updateField("preferredStudyLevel", value as StudyLevel)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={StudyLevel.BACHELORS}>Bachelor</SelectItem>
                                                <SelectItem value={StudyLevel.PHD}>PHD</SelectItem>
                                                <SelectItem value={StudyLevel.DIPLOMA}>Diploma</SelectItem>
                                                <SelectItem value={StudyLevel.CERTIFICATE}>Certificate</SelectItem>
                                                <SelectItem value={StudyLevel.MASTERS}>Masters</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.preferredStudyLevel || "-"}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Preferred Field of Study</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.preferredFieldOfStudy || ""}
                                        onChange={(e) => updateField("preferredFieldOfStudy", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.preferredFieldOfStudy || "-"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial Information */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-blue-100" >
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <CardTitle className="text-gray-800">Financial Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label className="text-xs text-gray-500">Estimated Budget (USD)</Label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={formData.estimatedBudget || ""}
                                        onChange={(e) => updateField("estimatedBudget", parseFloat(e.target.value))}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">
                                        {formData.estimatedBudget ? `$${formData.estimatedBudget.toLocaleString()}` : "-"}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Funding Source</Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.fundingSource || ""}
                                        onValueChange={(value) => updateField("fundingSource", value as FundingSource)}
                                    >
                                        <SelectTrigger className="mt-1">
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
                                    <p className="font-medium text-gray-900 mt-1">
                                        {formData.fundingSource?.replace(/_/g, " ") || "-"}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visa & Immigration */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-blue-100">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <Plane className="w-5 h-5 text-red-600" />
                                <CardTitle className="text-gray-800">Visa & Immigration</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label className="text-xs text-gray-500">Previous Visa Refusal</Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.previousVisaRefusal ? "true" : "false"}
                                        onValueChange={(value) => updateField("previousVisaRefusal", value === "true")}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="false">No</SelectItem>
                                            <SelectItem value="true">Yes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">
                                        {formData.previousVisaRefusal ? "Yes" : "No"}
                                    </p>
                                )}
                            </div>

                            {formData.previousVisaRefusal && (
                                <div>
                                    <Label className="text-xs text-gray-500">Refusal Details</Label>
                                    {isEditing ? (
                                        <Textarea
                                            value={formData.visaRefusalDetails || ""}
                                            onChange={(e) => updateField("visaRefusalDetails", e.target.value)}
                                            className="mt-1"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.visaRefusalDetails || "-"}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <Label className="text-xs text-gray-500">Travel History</Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.travelHistory || ""}
                                        onChange={(e) => updateField("travelHistory", e.target.value)}
                                        className="mt-1"
                                        rows={2}
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.travelHistory || "-"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
