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
    Phone,
    MapPin,
    FileText,
    Edit3,
    Loader2,
    Users,
    TrendingUp,
    Award,
    Briefcase,
    Calendar,
    Link as LinkIcon,
} from "lucide-react";

export default function AgentProfilePage() {
    const { data: profileData, loading, saveAgent } = useAgentProfile();

    const [isEditing, setIsEditing] = useState(false);
    const [draftData, setDraftData] = useState<AgentProfileData>({});
    const formData = isEditing ? draftData : (profileData || {});

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
            await saveAgent(profileData.id, draftData);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save profile:", err);
            alert("Failed to save profile. Please try again.");
        }
    };

    const handleCancel = () => {
        setDraftData(profileData || {});
        setIsEditing(false);
    };

    const updateField = (field: keyof AgentProfileData, value: AgentProfileData[keyof AgentProfileData]) => {
        setDraftData((prev) => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field: keyof AgentProfileData, item: string) => {
        const currentArray = (formData[field] as string[]) || [];
        const newArray = currentArray.includes(item)
            ? currentArray.filter((i) => i !== item)
            : [...currentArray, item];
        updateField(field, newArray);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
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
                                        {formData.agentName || formData.legalName || "Agent Profile"}
                                    </p>
                                    <p className="text-blue-100 mt-1">
                                        {formData.countryOfRegistration || "Education Agent"}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center space-x-2">
                                {!isEditing ? (
                                    <Button
                                        className="bg-white text-[rgba(37,130,235,1)] hover:bg-blue-50"
                                        size="sm"
                                        onClick={() => {
                                            setDraftData(profileData || {});
                                            setIsEditing(true);
                                        }}
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
                                            className="bg-white text-indigo-600 hover:bg-blue-50"
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
                    {/* Company Information */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                                <CardTitle className="text-gray-800">Company Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" /> Legal Name
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.legalName || ""}
                                        onChange={(e) => updateField("legalName", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.legalName || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Trading Name</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.tradingName || ""}
                                        onChange={(e) => updateField("tradingName", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.tradingName || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Agent Name</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.agentName || ""}
                                        onChange={(e) => updateField("agentName", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.agentName || "-"}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                                        <Globe className="w-3 h-3" /> Country of Registration
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={formData.countryOfRegistration || ""}
                                            onChange={(e) => updateField("countryOfRegistration", e.target.value)}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.countryOfRegistration || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Year Established
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={formData.yearEstablished || ""}
                                            onChange={(e) => updateField("yearEstablished", parseInt(e.target.value))}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.yearEstablished || "-"}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" /> Website URL
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.websiteUrl || ""}
                                        onChange={(e) => updateField("websiteUrl", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">
                                        {formData.websiteUrl ? (
                                            <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {formData.websiteUrl}
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Calendly Link
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.calendlyLink || ""}
                                        onChange={(e) => updateField("calendlyLink", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">
                                        {formData.calendlyLink ? (
                                            <a href={formData.calendlyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {formData.calendlyLink}
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <Mail className="w-5 h-5 text-green-600" />
                                <CardTitle className="text-gray-800">Contact Information</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Office Address
                                </Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.officeAddress || ""}
                                        onChange={(e) => updateField("officeAddress", e.target.value)}
                                        className="mt-1"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.officeAddress || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Contact Person Name</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.contactPersonName || ""}
                                        onChange={(e) => updateField("contactPersonName", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.contactPersonName || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Designation</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.designation || ""}
                                        onChange={(e) => updateField("designation", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.designation || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> Official Email
                                </Label>
                                {isEditing ? (
                                    <Input
                                        type="email"
                                        value={formData.officialEmail || ""}
                                        onChange={(e) => updateField("officialEmail", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.officialEmail || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> Phone Number
                                </Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.phoneNumber || ""}
                                        onChange={(e) => updateField("phoneNumber", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.phoneNumber || "-"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registration Documents */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-purple-600" />
                                <CardTitle className="text-gray-800">Registration Documents</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label className="text-xs text-gray-500">Business Registration Number</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.businessRegistrationNumber || ""}
                                        onChange={(e) => updateField("businessRegistrationNumber", e.target.value)}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.businessRegistrationNumber || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Business Registration Certificate</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.businessRegistrationCertificate || ""}
                                        onChange={(e) => updateField("businessRegistrationCertificate", e.target.value)}
                                        className="mt-1"
                                        placeholder="Document URL or reference"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.businessRegistrationCertificate || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Office Address Proof</Label>
                                {isEditing ? (
                                    <Input
                                        value={formData.officeAddressProof || ""}
                                        onChange={(e) => updateField("officeAddressProof", e.target.value)}
                                        className="mt-1"
                                        placeholder="Document URL or reference"
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.officeAddressProof || "-"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Partnerships & Accreditations */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <Award className="w-5 h-5 text-orange-600" />
                                <CardTitle className="text-gray-800">Partnerships & Accreditations</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="educationCouncils"
                                    checked={formData.registeredWithEducationCouncils || false}
                                    onCheckedChange={(checked) => updateField("registeredWithEducationCouncils", checked)}
                                    disabled={!isEditing}
                                />
                                <Label htmlFor="educationCouncils" className="text-sm cursor-pointer">
                                    Registered with Education Councils
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="ukInstitutions"
                                    checked={formData.workingWithUkInstitutions || false}
                                    onCheckedChange={(checked) => updateField("workingWithUkInstitutions", checked)}
                                    disabled={!isEditing}
                                />
                                <Label htmlFor="ukInstitutions" className="text-sm cursor-pointer">
                                    Working with UK Institutions
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="canadaInstitutions"
                                    checked={formData.workingWithCanadaInstitutions || false}
                                    onCheckedChange={(checked) => updateField("workingWithCanadaInstitutions", checked)}
                                    disabled={!isEditing}
                                />
                                <Label htmlFor="canadaInstitutions" className="text-sm cursor-pointer">
                                    Working with Canada Institutions
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="australiaInstitutions"
                                    checked={formData.workingWithAustraliaInstitutions || false}
                                    onCheckedChange={(checked) => updateField("workingWithAustraliaInstitutions", checked)}
                                    disabled={!isEditing}
                                />
                                <Label htmlFor="australiaInstitutions" className="text-sm cursor-pointer">
                                    Working with Australia Institutions
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Business Details */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow lg:col-span-2">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <CardTitle className="text-gray-800">Business Details</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-gray-500">Average Students Per Year (Last 2 Years)</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={formData.averageStudentsPerYearLast2Years || ""}
                                            onChange={(e) => updateField("averageStudentsPerYearLast2Years", parseInt(e.target.value))}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.averageStudentsPerYearLast2Years || "-"}</p>
                                    )}
                                </div>

                                <div>
                                    <Label className="text-xs text-gray-500 flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Number of Counsellors
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={formData.numberOfCounsellors || ""}
                                            onChange={(e) => updateField("numberOfCounsellors", parseInt(e.target.value))}
                                            className="mt-1"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900 mt-1">{formData.numberOfCounsellors || "-"}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Typical Student Profile Strength</Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.typicalStudentProfileStrength || ""}
                                        onChange={(e) => updateField("typicalStudentProfileStrength", e.target.value)}
                                        className="mt-1"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.typicalStudentProfileStrength || "-"}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="visaSupport"
                                    checked={formData.inHouseVisaSupport || false}
                                    onCheckedChange={(checked) => updateField("inHouseVisaSupport", checked)}
                                    disabled={!isEditing}
                                />
                                <Label htmlFor="visaSupport" className="text-sm cursor-pointer">
                                    In-House Visa Support Available
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services Provided */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <Briefcase className="w-5 h-5 text-teal-600" />
                                <CardTitle className="text-gray-800">Services Provided</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            {Object.values(ServiceType).map((service) => (
                                <div key={service} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`service-${service}`}
                                        checked={formData.servicesProvided?.includes(service) || false}
                                        onCheckedChange={() => toggleArrayItem("servicesProvided", service)}
                                        disabled={!isEditing}
                                    />
                                    <Label htmlFor={`service-${service}`} className="text-sm cursor-pointer">
                                        {service.replace(/_/g, " ")}
                                    </Label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Platform Usage */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-gradient p-1">
                            <div className="flex items-center space-x-2">
                                <Award className="w-5 h-5 text-pink-600" />
                                <CardTitle className="text-gray-800">Platform Usage</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <Label className="text-xs text-gray-500">Reason to Use Edvios</Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.reasonToUseEdvios || ""}
                                        onChange={(e) => updateField("reasonToUseEdvios", e.target.value)}
                                        className="mt-1"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.reasonToUseEdvios || "-"}</p>
                                )}
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500 mb-2 block">Interested Features</Label>
                                <div className="space-y-2">
                                    {Object.values(FeatureType).map((feature) => (
                                        <div key={feature} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`feature-${feature}`}
                                                checked={formData.interestedFeatures?.includes(feature) || false}
                                                onCheckedChange={() => toggleArrayItem("interestedFeatures", feature)}
                                                disabled={!isEditing}
                                            />
                                            <Label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer">
                                                {feature.replace(/_/g, " ")}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label className="text-xs text-gray-500">Notes</Label>
                                {isEditing ? (
                                    <Textarea
                                        value={formData.notes || ""}
                                        onChange={(e) => updateField("notes", e.target.value)}
                                        className="mt-1"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="font-medium text-gray-900 mt-1">{formData.notes || "-"}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
