"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAgentProfile } from "./hooks/use-agent-profile";
import { AgentProfileData, ServiceType, FeatureType } from "./types/agent-profile.types";
import {
    Building2,
    Globe,
    Mail,
    FileText,
    Edit3,
    Loader2,
    Users,
    Award,
    Briefcase,
    Save,
    X,
} from "lucide-react";

export default function AgentProfilePage() {
    const { data: profileData, loading, saveAgent } = useAgentProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<AgentProfileData>(profileData || {});

    const [prevProfileData, setPrevProfileData] = useState(profileData);

    // Update form data when profile data arrives or changes
    if (profileData !== prevProfileData) {
        setPrevProfileData(profileData);
        if (profileData) {
            setFormData(profileData);
        }
    }

    const initials = useMemo(() => {
        const name = formData.agentName || formData.legalName || "";
        return name
            .split(" ")
            .map((n) => n.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2) || "AG";
    }, [formData.agentName, formData.legalName]);

    const handleSave = async () => {
        if (!profileData?.id) {
            alert("Agent ID not found");
            return;
        }

        try {
            await saveAgent(profileData.id, formData);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Failed to save profile. Please try again.");
        }
    };

    const handleCancel = () => {
        setFormData(profileData || {});
        setIsEditing(false);
    };

    const updateField = <K extends keyof AgentProfileData>(field: K, value: AgentProfileData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: keyof AgentProfileData, item: string) => {
        const currentArray = (formData[field] as string[]) || [];
        const newArray = currentArray.includes(item)
            ? currentArray.filter((i) => i !== item)
            : [...currentArray, item];
        updateField(field, newArray);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-lg bg-edvios-blue text-white flex items-center justify-center text-xl font-semibold">
                                {initials}
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {formData.agentName || formData.legalName || "Agent Profile"}
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {formData.countryOfRegistration || "Education Agent"}
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
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Company Information */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-gray-600" />
                                Company Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Legal Name</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.legalName || ""}
                                        onChange={(e) => updateField("legalName", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.legalName || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Trading Name</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.tradingName || ""}
                                        onChange={(e) => updateField("tradingName", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.tradingName || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Agent Name</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.agentName || ""}
                                        onChange={(e) => updateField("agentName", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.agentName || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Country of Registration</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.countryOfRegistration || ""}
                                        onChange={(e) => updateField("countryOfRegistration", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.countryOfRegistration || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Year Established</Label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={formData.yearEstablished || ""}
                                        onChange={(e) => updateField("yearEstablished", parseInt(e.target.value))}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.yearEstablished || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Website</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.websiteUrl || ""}
                                        onChange={(e) => updateField("websiteUrl", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">
                                        {formData.websiteUrl ? (
                                            <a
                                                href={formData.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {formData.websiteUrl}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Calendly Link</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.calendlyLink || ""}
                                        onChange={(e) => updateField("calendlyLink", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">
                                        {formData.calendlyLink ? (
                                            <a
                                                href={formData.calendlyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {formData.calendlyLink}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-gray-600" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Office Address</Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.officeAddress || ""}
                                        onChange={(e) => updateField("officeAddress", e.target.value)}
                                        className="border-gray-300"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.officeAddress || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Contact Person</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.contactPersonName || ""}
                                        onChange={(e) => updateField("contactPersonName", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.contactPersonName || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Designation</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.designation || ""}
                                        onChange={(e) => updateField("designation", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.designation || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Email</Label>
                                {isEditing ? (
                                    <Input
                                        type="email"
                                        value={formData.officialEmail || ""}
                                        onChange={(e) => updateField("officialEmail", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.officialEmail || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Phone Number</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.phoneNumber || ""}
                                        onChange={(e) => updateField("phoneNumber", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.phoneNumber || "—"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registration Documents */}
                    {/* Business Details */}
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-600" />
                                Business Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">
                                    Avg. Students Per Year (Last 2 Years)
                                </Label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={formData.averageStudentsPerYearLast2Years || ""}
                                        onChange={(e) =>
                                            updateField("averageStudentsPerYearLast2Years", parseInt(e.target.value))
                                        }
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.averageStudentsPerYearLast2Years || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Number of Counsellors</Label>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        value={formData.numberOfCounsellors || ""}
                                        onChange={(e) => updateField("numberOfCounsellors", parseInt(e.target.value))}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.numberOfCounsellors || "—"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">
                                    Student Profile Strength
                                </Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.typicalStudentProfileStrength || ""}
                                        onChange={(e) => updateField("typicalStudentProfileStrength", e.target.value)}
                                        className="border-gray-300"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.typicalStudentProfileStrength || "—"}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="visaSupport"
                                    checked={formData.inHouseVisaSupport || false}
                                    onCheckedChange={(checked) => updateField("inHouseVisaSupport", checked === true)}
                                    disabled={!isEditing}
                                />
                                <Label htmlFor="visaSupport" className="text-sm text-gray-700 cursor-pointer">
                                    In-House Visa Support Available
                                </Label>
                            </div>
                        </CardContent>
                    </Card>



                    {/* Partnerships & Accreditations */}
                    <Card className="border-gray-200 shadow-sm lg:col-span-2">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Award className="w-5 h-5 text-gray-600" />
                                Partnerships & Accreditations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="educationCouncils"
                                        checked={formData.registeredWithEducationCouncils || false}
                                        onCheckedChange={(checked) =>
                                            updateField("registeredWithEducationCouncils", checked === true)
                                        }
                                        disabled={!isEditing}
                                    />
                                    <Label htmlFor="educationCouncils" className="text-sm text-gray-700 cursor-pointer">
                                        Registered with Education Councils
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="ukInstitutions"
                                        checked={formData.workingWithUkInstitutions || false}
                                        onCheckedChange={(checked) => updateField("workingWithUkInstitutions", checked === true)}
                                        disabled={!isEditing}
                                    />
                                    <Label htmlFor="ukInstitutions" className="text-sm text-gray-700 cursor-pointer">
                                        Working with UK Institutions
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="canadaInstitutions"
                                        checked={formData.workingWithCanadaInstitutions || false}
                                        onCheckedChange={(checked) =>
                                            updateField("workingWithCanadaInstitutions", checked === true)
                                        }
                                        disabled={!isEditing}
                                    />
                                    <Label htmlFor="canadaInstitutions" className="text-sm text-gray-700 cursor-pointer">
                                        Working with Canada Institutions
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="australiaInstitutions"
                                        checked={formData.workingWithAustraliaInstitutions || false}
                                        onCheckedChange={(checked) =>
                                            updateField("workingWithAustraliaInstitutions", checked === true)
                                        }
                                        disabled={!isEditing}
                                    />
                                    <Label htmlFor="australiaInstitutions" className="text-sm text-gray-700 cursor-pointer">
                                        Working with Australia Institutions
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-600" />
                                Registration Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-1.5 block">
                                    Business Registration Number
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.businessRegistrationNumber || ""}
                                        onChange={(e) => updateField("businessRegistrationNumber", e.target.value)}
                                        className="border-gray-300"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-900">{formData.businessRegistrationNumber || "—"}</p>
                                )}
                            </div>



                        </CardContent>
                    </Card>


                    {/* Services Provided */}
                    <Card className="border-gray-200 shadow-sm lg:col-span-2">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-gray-600" />
                                Services Provided
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.values(ServiceType).map((service) => (
                                    <div key={service} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`service-${service}`}
                                            checked={formData.servicesProvided?.includes(service) || false}
                                            onCheckedChange={() => toggleArrayItem("servicesProvided", service)}
                                            disabled={!isEditing}
                                        />
                                        <Label htmlFor={`service-${service}`} className="text-sm text-gray-700 cursor-pointer">
                                            {service.replace(/_/g, " ")}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Platform Usage */}
                    <Card className="border-gray-200 shadow-sm lg:col-span-3">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-gray-600" />
                                Platform Usage
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Reason to Use Edvios</Label>
                                    {isEditing ? (
                                        <Textarea
                                            value={formData.reasonToUseEdvios || ""}
                                            onChange={(e) => updateField("reasonToUseEdvios", e.target.value)}
                                            className="border-gray-300"
                                            rows={4}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.reasonToUseEdvios || "—"}</p>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-xs font-medium text-gray-700 mb-1.5 block">Notes</Label>
                                    {isEditing ? (
                                        <Textarea
                                            value={formData.notes || ""}
                                            onChange={(e) => updateField("notes", e.target.value)}
                                            className="border-gray-300"
                                            rows={4}
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-900">{formData.notes || "—"}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs font-medium text-gray-700 mb-3 block">Interested Features</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.values(FeatureType).map((feature) => (
                                        <div key={feature} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`feature-${feature}`}
                                                checked={formData.interestedFeatures?.includes(feature) || false}
                                                onCheckedChange={() => toggleArrayItem("interestedFeatures", feature)}
                                                disabled={!isEditing}
                                            />
                                            <Label htmlFor={`feature-${feature}`} className="text-sm text-gray-700 cursor-pointer">
                                                {feature.replace(/_/g, " ")}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}