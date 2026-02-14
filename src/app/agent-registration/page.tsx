'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase, User, Building, Globe, Layers, CheckCircle, ArrowRight, ArrowLeft, Send, Loader2, Settings } from 'lucide-react';
import { useAgentRegistration } from './hooks/use-registration';
import { AgentRegistrationData } from './types/registation.types';
import { ServiceType, FeatureType } from './enums/registration.enums';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import FileUploadField from '@/components/ui/file-upload-field';

interface AgentRegistrationFormProps {
    onSubmit?: (data: AgentRegistrationData) => void;
    onClose?: () => void;
}

const AgentRegistrationForm: React.FC<AgentRegistrationFormProps> = ({ onSubmit, onClose }) => {
    const {
        currentStep,
        formData,
        isSubmitting,
        totalSteps,
        progressPercentage,
        handleInputChange,
        handleNextStep,
        handlePrevStep,
        handleSubmit,
    } = useAgentRegistration();

    const { uploadFile, isUploading, uploadProgress } = useCloudinaryUpload();

    const stepIcons = [Briefcase, User, Building, Globe, Layers, Settings];

    // Helper for multi-select (Markets, Destinations, Services, Features)
    const toggleSelection = (field: keyof AgentRegistrationData, value: string) => {
        const current = (formData[field] as string[]) || [];
        if (current.includes(value)) {
            handleInputChange(field, current.filter(item => item !== value));
        } else {
            handleInputChange(field, [...current, value]);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                                <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-bold secondary-foreground">Agency Information</p>
                                <p className="text-sm text-muted-foreground">Tell us about your organization</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 group">
                                <Label htmlFor="legalName" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Agency Legal Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="legalName"
                                    value={formData.legalName}
                                    onChange={(e) => handleInputChange('legalName', e.target.value)}
                                    placeholder="Official name of the company"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="tradingName" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Trading Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="tradingName"
                                    value={formData.tradingName}
                                    onChange={(e) => handleInputChange('tradingName', e.target.value)}
                                    placeholder="Marketing/Brand name"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="agentName" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Agent Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="agentName"
                                    value={formData.agentName}
                                    onChange={(e) => handleInputChange('agentName', e.target.value)}
                                    placeholder="Enter agent name"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="countryOfRegistration" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Country of Registration <span className="text-destructive">*</span></Label>
                                <Input
                                    id="countryOfRegistration"
                                    value={formData.countryOfRegistration}
                                    onChange={(e) => handleInputChange('countryOfRegistration', e.target.value)}
                                    placeholder="e.g., United Kingdom"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="yearEstablished" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Year Established <span className="text-destructive">*</span></Label>
                                <Input
                                    id="yearEstablished"
                                    type="number"
                                    value={formData.yearEstablished}
                                    onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                                    placeholder="YYYY"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="websiteUrl" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Website URL</Label>
                                <Input
                                    id="websiteUrl"
                                    value={formData.websiteUrl}
                                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                                    placeholder="https://www.example.com"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="calendlyLink" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Calendly Link</Label>
                                <Input
                                    id="calendlyLink"
                                    value={formData.calendlyLink}
                                    onChange={(e) => handleInputChange('calendlyLink', e.target.value)}
                                    placeholder="https://calendly.com/example"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group md:col-span-2">
                                <Label htmlFor="officeAddress" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Office Address <span className="text-destructive">*</span></Label>
                                <Textarea
                                    id="officeAddress"
                                    value={formData.officeAddress}
                                    onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                                    placeholder="Full registered address"
                                    className="resize-none transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                    rows={2}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                                <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-bold secondary-foreground">Contact Person</p>
                                <p className="text-sm text-muted-foreground">Primary point of contact for Edvios</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 group">
                                <Label htmlFor="contactPersonName" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Full Name <span className="text-destructive">*</span></Label>
                                <Input
                                    id="contactPersonName"
                                    value={formData.contactPersonName}
                                    onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                                    placeholder="Name of contact person"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="designation" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Designation</Label>
                                <Input
                                    id="designation"
                                    value={formData.designation}
                                    onChange={(e) => handleInputChange('designation', e.target.value)}
                                    placeholder="e.g., Director, Manager"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="officialEmail" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Official Email <span className="text-destructive">*</span></Label>
                                <Input
                                    id="officialEmail"
                                    type="email"
                                    value={formData.officialEmail}
                                    onChange={(e) => handleInputChange('officialEmail', e.target.value)}
                                    placeholder="email@company.com"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="phoneNumber" className="text-sm font-medium transition-colors group-focus-within:text-gradient">WhatsApp / Phone Number <span className="text-destructive">*</span></Label>
                                <Input
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    placeholder="+1 234 567 8900"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                                <Building className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-bold secondary-foreground">Business Verification</p>
                                <p className="text-sm text-muted-foreground">Verifying your business credentials</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 group md:col-span-2">
                                <Label htmlFor="businessRegistrationNumber" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Business Registration Number <span className="text-destructive">*</span></Label>
                                <Input
                                    id="businessRegistrationNumber"
                                    value={formData.businessRegistrationNumber}
                                    onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                                    placeholder="Registration / License Number"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <FileUploadField
                                    id="businessRegistrationCertificate"
                                    label="Upload Registration Certificate"
                                    isUploading={isUploading}
                                    uploadProgress={uploadProgress}
                                    value={formData.businessRegistrationCertificate}
                                    hint="PDF, JPG, PNG (max 10MB)"
                                    onFileSelect={async (files) => {
                                        const file = files[0];
                                        if (file) {
                                            const url = await uploadFile(file, 'edvios/agents/registration-certificates');
                                            if (url) {
                                                handleInputChange('businessRegistrationCertificate', url);
                                            }
                                        }
                                    }}
                                    onRemove={() => handleInputChange('businessRegistrationCertificate', '')}
                                />
                            </div>

                            <div className="space-y-2 group">
                                <FileUploadField
                                    id="officeAddressProof"
                                    label="Upload Office Address Proof"
                                    isUploading={isUploading}
                                    uploadProgress={uploadProgress}
                                    value={formData.officeAddressProof}
                                    hint="Utility Bill, Lease Agreement, etc. (max 10MB)"
                                    onFileSelect={async (files) => {
                                        const file = files[0];
                                        if (file) {
                                            const url = await uploadFile(file, 'edvios/agents/address-proofs');
                                            if (url) {
                                                handleInputChange('officeAddressProof', url);
                                            }
                                        }
                                    }}
                                    onRemove={() => handleInputChange('officeAddressProof', '')}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                                <Globe className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-bold secondary-foreground">Operational Profile</p>
                                <p className="text-sm text-muted-foreground">Your market reach and experience</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="registeredWithEducationCouncils"
                                    checked={formData.registeredWithEducationCouncils}
                                    onCheckedChange={(checked) => handleInputChange('registeredWithEducationCouncils', checked === true)}
                                    className="data-[state=checked]:bg-gradient"
                                />
                                <Label htmlFor="registeredWithEducationCouncils" className="text-sm cursor-pointer font-medium">
                                    Registered with Education Councils (ICEF, etc.)
                                </Label>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label className="text-sm font-medium transition-colors group-focus-within:text-gradient">Currently working with institutions in:</Label>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="workingWithUkInstitutions"
                                            checked={formData.workingWithUkInstitutions}
                                            onCheckedChange={(checked) => handleInputChange('workingWithUkInstitutions', checked === true)}
                                            className="data-[state=checked]:bg-gradient"
                                        />
                                        <Label htmlFor="workingWithUkInstitutions" className="text-sm cursor-pointer">United Kingdom</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="workingWithCanadaInstitutions"
                                            checked={formData.workingWithCanadaInstitutions}
                                            onCheckedChange={(checked) => handleInputChange('workingWithCanadaInstitutions', checked === true)}
                                            className="data-[state=checked]:bg-gradient"
                                        />
                                        <Label htmlFor="workingWithCanadaInstitutions" className="text-sm cursor-pointer">Canada</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="workingWithAustraliaInstitutions"
                                            checked={formData.workingWithAustraliaInstitutions}
                                            onCheckedChange={(checked) => handleInputChange('workingWithAustraliaInstitutions', checked === true)}
                                            className="data-[state=checked]:bg-gradient"
                                        />
                                        <Label htmlFor="workingWithAustraliaInstitutions" className="text-sm cursor-pointer">Australia</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                                <div className="space-y-2 group">
                                    <Label htmlFor="averageStudentsPerYearLast2Years" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Avg. Students Sent Per Year (Last 2 Years) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="averageStudentsPerYearLast2Years"
                                        type="number"
                                        value={formData.averageStudentsPerYearLast2Years}
                                        onChange={(e) => handleInputChange('averageStudentsPerYearLast2Years', e.target.value)}
                                        placeholder="e.g. 50"
                                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <Label htmlFor="primaryStudentMarkets" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Primary Student Markets <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="primaryStudentMarkets"
                                        placeholder="e.g. India, Nigeria (comma separated)"
                                        value={formData.primaryStudentMarkets.join(', ')}
                                        onChange={(e) => handleInputChange('primaryStudentMarkets', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                    />
                                    <p className="text-xs text-muted-foreground">Enter countries separated by commas</p>
                                </div>

                                <div className="space-y-2 group">
                                    <Label htmlFor="mainDestinations" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Main Destinations <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="mainDestinations"
                                        placeholder="e.g. UK, USA (comma separated)"
                                        value={formData.mainDestinations.join(', ')}
                                        onChange={(e) => handleInputChange('mainDestinations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                                <Layers className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-bold secondary-foreground">Services & Capabilities</p>
                                <p className="text-sm text-muted-foreground">What do you offer to students?</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 group">
                                <Label htmlFor="numberOfCounsellors" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Number of Counsellors <span className="text-destructive">*</span></Label>
                                <Input
                                    id="numberOfCounsellors"
                                    type="number"
                                    value={formData.numberOfCounsellors}
                                    onChange={(e) => handleInputChange('numberOfCounsellors', e.target.value)}
                                    placeholder="Count"
                                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label htmlFor="typicalStudentProfileStrength" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Typical Student Profile Strength <span className="text-destructive">*</span></Label>
                                <Select
                                    value={formData.typicalStudentProfileStrength || undefined}
                                    onValueChange={(value) => handleInputChange('typicalStudentProfileStrength', value)}
                                >
                                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                                        <SelectValue placeholder="Select Profile Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High Achievers (Top Universities)</SelectItem>
                                        <SelectItem value="mid">Mid-Range (State Universities)</SelectItem>
                                        <SelectItem value="budget">Budget Focused (Colleges/Pathways)</SelectItem>
                                        <SelectItem value="mixed">Mixed Profiles</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2 group">
                                <Label className="text-sm font-medium transition-colors group-focus-within:text-gradient">Services Provided <span className="text-destructive">*</span></Label>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    {[
                                        { id: ServiceType.ADMISSIONS, label: 'Admissions' },
                                        { id: ServiceType.VISA, label: 'Visa Support' },
                                        { id: ServiceType.END_TO_END, label: 'End-to-End Service' }
                                    ].map((service) => (
                                        <div key={service.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`service-${service.id}`}
                                                checked={(formData.servicesProvided || []).includes(service.id)}
                                                onCheckedChange={() => toggleSelection('servicesProvided', service.id)}
                                                className="data-[state=checked]:bg-gradient"
                                            />
                                            <Label htmlFor={`service-${service.id}`} className="text-sm cursor-pointer">{service.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2 pt-2 group">
                                <Label className="text-sm font-medium transition-colors group-focus-within:text-gradient">Do you have In-house Visa Support?</Label>
                                <RadioGroup
                                    value={formData.inHouseVisaSupport ? "yes" : "no"}
                                    onValueChange={(val) => handleInputChange('inHouseVisaSupport', val === "yes")}
                                    className="flex space-x-4 mt-1"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="yes" id="visa-yes" />
                                        <Label htmlFor="visa-yes" className="text-sm cursor-pointer">Yes</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="no" id="visa-no" />
                                        <Label htmlFor="visa-no" className="text-sm cursor-pointer">No</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                                <Settings className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xl font-bold secondary-foreground">Final Step</p>
                                <p className="text-sm text-muted-foreground">Why Edvios?</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2 group">
                                <Label htmlFor="reasonToUseEdvios" className="text-sm font-medium transition-colors group-focus-within:text-gradient">Reason to Use Edvios <span className="text-destructive">*</span></Label>
                                <Textarea
                                    id="reasonToUseEdvios"
                                    value={formData.reasonToUseEdvios}
                                    onChange={(e) => handleInputChange('reasonToUseEdvios', e.target.value)}
                                    placeholder="What are your goals with us?"
                                    rows={3}
                                    className="resize-none transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label className="text-sm font-medium transition-colors group-focus-within:text-gradient">Interested Features</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                    {[
                                        { id: FeatureType.AI_MATCHING, label: 'AI Matching' },
                                        { id: FeatureType.VISA_RISK, label: 'Visa Risk Analysis' },
                                        { id: FeatureType.CRM, label: 'CRM Tools' },
                                        { id: FeatureType.ANALYTICS, label: 'Performance Analytics' },
                                        { id: FeatureType.DOCUMENT_MANAGEMENT, label: 'Document Management' },
                                    ].map((feature) => (
                                        <div key={feature.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`feature-${feature.id}`}
                                                checked={(formData.interestedFeatures || []).includes(feature.id)}
                                                onCheckedChange={() => toggleSelection('interestedFeatures', feature.id)}
                                                className="data-[state=checked]:bg-gradient"
                                            />
                                            <Label htmlFor={`feature-${feature.id}`} className="text-sm cursor-pointer">{feature.label}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 pt-2">
                                <Checkbox
                                    id="openToPilotUsage"
                                    checked={formData.openToPilotUsage}
                                    onCheckedChange={(checked) => handleInputChange('openToPilotUsage', checked === true)}
                                    className="data-[state=checked]:bg-gradient"
                                />
                                <Label htmlFor="openToPilotUsage" className="cursor-pointer font-medium text-gradient">
                                    Are you open to pilot usage (BETA testing)?
                                </Label>
                            </div>

                            <Separator className="my-2" />

                            <div className="p-4 rounded-lg border-2 border-green-500/30 bg-green-500/5 hover:border-green-500/50 transition-all duration-200 space-y-4">
                                <div className="flex items-start space-x-3 mb-2">
                                    <Checkbox
                                        id="marketingConsent"
                                        checked={formData.marketingConsent}
                                        onCheckedChange={(checked) => handleInputChange('marketingConsent', checked === true)}
                                        className="mt-1 data-[state=checked]:bg-gradient"
                                    />
                                    <Label htmlFor="marketingConsent" className="text-sm cursor-pointer">
                                        I agree to receive communications and updates.
                                    </Label>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="termsAccepted"
                                        checked={formData.termsAccepted}
                                        onCheckedChange={(checked) => handleInputChange('termsAccepted', checked === true)}
                                        className="mt-1 data-[state=checked]:bg-gradient"
                                    />
                                    <Label htmlFor="termsAccepted" className="text-sm cursor-pointer">
                                        I accept the <span className="text-gradient font-medium underline">Terms and Conditions</span>. <span className="text-destructive">*</span>
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5 p-4 md:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-2xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-8 pt-10 border-b border-gray-100/50">
                        <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
                            <span className="text-gradient text-3xl">
                                Agent Registration
                            </span>
                        </CardTitle>

                        <div className="mt-8 space-y-3">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Step {currentStep} of {totalSteps}</span>
                                <span>{Math.round(progressPercentage)}% Complete</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                        </div>

                        <div className="flex justify-center gap-4 mt-8">
                            {[1, 2, 3, 4, 5, 6].map((step) => {
                                const Icon = stepIcons[step - 1];
                                const isActive = step === currentStep;
                                const isCompleted = step < currentStep;

                                return (
                                    <div
                                        key={step}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isActive
                                            ? 'bg-gradient text-white shadow-lg scale-110'
                                            : isCompleted
                                                ? 'bg-green-500 text-white'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                    </div>
                                );
                            })}
                        </div>
                    </CardHeader>

                    <CardContent className="p-6 md:p-10 relative min-h-[500px]">
                        {renderStepContent()}

                        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
                            <Button
                                variant="outline"
                                onClick={handlePrevStep}
                                disabled={currentStep === 1}
                                className="w-32 hover:bg-gray-50 border-gray-200"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Previous
                            </Button>

                            {currentStep < totalSteps ? (
                                <Button
                                    onClick={handleNextStep}
                                    className="w-32 bg-gradient text-white shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    Next
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleSubmit(onSubmit, onClose)}
                                    disabled={isSubmitting}
                                    className="w-40 bg-gradient text-white shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Submit
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AgentRegistrationForm;
