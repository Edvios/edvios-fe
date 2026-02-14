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
import { Users, GraduationCap, Target, Plane, FileText, CheckCircle, ArrowRight, ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useRegistration } from './hooks/use-registration';
import { StudentRegistrationData } from './types';

interface StudentRegistrationFormProps {
  onSubmit?: (data: StudentRegistrationData) => void;
  onClose?: () => void;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ onSubmit, onClose }) => {
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
  } = useRegistration();

  const stepIcons = [Users, GraduationCap, Target, Plane, FileText, CheckCircle];

  const toggleCountry = (country: string) => {
    const current = formData.preferredDestination || [];
    if (current.includes(country)) {
      handleInputChange('preferredDestination', current.filter(c => c !== country));
    } else {
      handleInputChange('preferredDestination', [...current, country]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-edvios-green flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Personal Information</p>
                <p className="text-sm text-muted-foreground text-black ">Tell us about yourself</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name mapped to First/Last */}
              <div className="space-y-2 group">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="dob" className="text-sm font-medium">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="transition-all duration-200">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="nationality" className="text-sm font-medium">
                  Nationality <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="Enter your nationality"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="currentCountry" className="text-sm font-medium">
                  Country of Residence
                </Label>
                <Input
                  id="currentCountry"
                  value={formData.currentCountry}
                  onChange={(e) => handleInputChange('currentCountry', e.target.value)}
                  placeholder="Country where you live"
                />
              </div>

              {/* Passport Info */}
              <div className="space-y-2 group">
                <Label htmlFor="passportNumber" className="text-sm font-medium">
                  Passport Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                  placeholder="Enter passport number"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="passportExpiryDate" className="text-sm font-medium">
                  Passport Expiry Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="passportExpiryDate"
                  type="date"
                  value={formData.passportExpiryDate}
                  onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-muted/50 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Mobile Number (WhatsApp) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>

              {/* Emergency Contact */}
              <div className="space-y-2 group">
                <Label htmlFor="emergencyContactName" className="text-sm font-medium">
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  placeholder="Contact person name"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="emergencyContactNumber" className="text-sm font-medium">
                  Emergency Contact Number
                </Label>
                <Input
                  id="emergencyContactNumber"
                  value={formData.emergencyContactNumber}
                  onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-edvios-green flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Academic Background</p>
                <p className="text-sm text-muted-foreground">Your educational journey</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 group">
                <Label htmlFor="currentEducationLevel" className="text-sm font-medium">
                  Highest Qualification Completed <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.currentEducationLevel} onValueChange={(value) => handleInputChange('currentEducationLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelor">BachelorDegree</SelectItem>
                    <SelectItem value="master">Master Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="yearOfCompletion" className="text-sm font-medium">
                  Year of Completion <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="yearOfCompletion"
                  type="number"
                  value={formData.yearOfCompletion}
                  onChange={(e) => handleInputChange('yearOfCompletion', e.target.value)}
                  placeholder="YYYY"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="currentInstitution" className="text-sm font-medium">
                  Institution Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="currentInstitution"
                  value={formData.currentInstitution}
                  onChange={(e) => handleInputChange('currentInstitution', e.target.value)}
                  placeholder="Name of school/university"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="mediumOfInstruction" className="text-sm font-medium">
                  Medium of Instruction
                </Label>
                <Select value={formData.mediumOfInstruction} onValueChange={(value) => handleInputChange('mediumOfInstruction', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="gpa" className="text-sm font-medium">
                  Grades / Results Summary
                </Label>
                <Input
                  id="gpa"
                  value={formData.gpa}
                  onChange={(e) => handleInputChange('gpa', e.target.value)}
                  placeholder="e.g., 3.8 GPA or 85%"
                />
              </div>

              <div className="space-y-2 group md:col-span-2">
                <Label htmlFor="academicCertificates" className="text-sm font-medium">
                  Academic Certificates (Upload)
                </Label>
                <Input
                  id="academicCertificates"
                  type="file"
                  multiple
                  onChange={(e) => {
                    // Add file handling logic if needed, currently just logging
                    console.log(e.target.files);
                  }}
                />
                <p className="text-xs text-muted-foreground">Upload relevant certificates (placeholder only)</p>
              </div>

              <div className="col-span-1 md:col-span-2">
                <Separator className="my-2" />
                <h4 className="text-sm font-medium mt-2 mb-4">English Proficiency</h4>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="englishTest" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  English Proficiency Test<span className="text-destructive">*</span>
                </Label>
                <Select value={formData.englishTest} onValueChange={(value) => handleInputChange('englishTest', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test taken" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                    <SelectItem value="PTE">PTE</SelectItem>
                    <SelectItem value="DUOLINGO">Duolingo</SelectItem>
                    <SelectItem value="NONE">Not taken yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.englishTest === 'IELTS' || formData.englishTest === 'TOEFL' || formData.englishTest === 'PTE' || formData.englishTest === 'DUOLINGO') && (
                <>
                  <div className="space-y-2 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Label htmlFor="englishScore" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                      Overall Score
                    </Label>
                    <Input
                      id="englishScore"
                      value={formData.englishScore}
                      onChange={(e) => handleInputChange('englishScore', e.target.value)}
                      placeholder="e.g., 7.0 or 100"
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                  <div className="space-y-2 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Label htmlFor="testExpiryDate" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                      Test Expiry Date
                    </Label>
                    <Input
                      id="testExpiryDate"
                      type="date"
                      value={formData.testExpiryDate}
                      onChange={(e) => handleInputChange('testExpiryDate', e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-edvios-green flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Study Preferences</p>
                <p className="text-sm text-muted-foreground">What and where do you want to study?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="space-y-2 group md:col-span-2">
                <Label htmlFor="preferredDestination" className="text-sm font-medium">
                  Preferred Countries <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['UK', 'USA', 'Canada', 'Australia', 'New Zealand', 'Ireland', 'Germany', 'Netherlands'].map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${country}`}
                        checked={(formData.preferredDestination || []).includes(country)}
                        onCheckedChange={() => toggleCountry(country)}
                      />
                      <Label htmlFor={`country-${country}`} className="text-sm cursor-pointer">{country}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="preferredStudyLevel" className="text-sm font-medium">
                  Preferred Study Level <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.preferredStudyLevel} onValueChange={(value) => handleInputChange('preferredStudyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BACHELORS">Bachelor Degree</SelectItem>
                    <SelectItem value="MASTERS">Master Degree</SelectItem>
                    <SelectItem value="PHD">PhD</SelectItem>
                    <SelectItem value="DIPLOMA">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="preferredProgram" className="text-sm font-medium">
                  Preferred Field of Study <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.preferredProgram} onValueChange={(value) => handleInputChange('preferredProgram', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="business-administration">Business Administration</SelectItem>
                    <SelectItem value="mba">MBA</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="preferredIntake" className="text-sm font-medium">
                  Intended Intake (Month/Year)
                </Label>
                <Input
                  id="preferredIntake"
                  value={formData.preferredIntake}
                  onChange={(e) => handleInputChange('preferredIntake', e.target.value)}
                  placeholder="e.g. September-2024"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="estimatedBudget" className="text-sm font-medium">
                  Estimated Budget (Tuition + Living) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="estimatedBudget"
                  type="number"
                  value={formData.estimatedBudget}
                  onChange={(e) => handleInputChange('estimatedBudget', e.target.value)}
                  placeholder="In USD/GBP"
                />
              </div>

              <div className="space-y-2 group md:col-span-2">
                <Label htmlFor="fundingSource" className="text-sm font-medium">
                  Funding Source
                </Label>
                <Select value={formData.fundingSource} onValueChange={(value) => handleInputChange('fundingSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select funding source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SELF">Self Funded</SelectItem>
                    <SelectItem value="PARENTS">Parents/Family</SelectItem>
                    <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
                    <SelectItem value="LOAN">Bank Loan</SelectItem>
                    <SelectItem value="SPONSER">Sponsor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-edvios-green flex items-center justify-center">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Visa & Immigration History</p>
                <p className="text-sm text-muted-foreground">Your travel and visa details</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-3 p-4 border rounded-md">
                <Label className="text-base font-medium">Have you previously been refused a visa?</Label>
                <RadioGroup
                  value={formData.previousVisaRefusal ? "yes" : "no"}
                  onValueChange={(val) => handleInputChange('previousVisaRefusal', val === "yes")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="visa-yes" />
                    <Label htmlFor="visa-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="visa-no" />
                    <Label htmlFor="visa-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.previousVisaRefusal && (
                <div className="space-y-2 group animate-in fade-in">
                  <Label htmlFor="visaRefusalDetails" className="text-sm font-medium">
                    Visa Refusal Details <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="visaRefusalDetails"
                    value={formData.visaRefusalDetails}
                    onChange={(e) => handleInputChange('visaRefusalDetails', e.target.value)}
                    placeholder="Please explain the reason for refusal, country, and year..."
                    rows={3}
                  />
                </div>
              )}

              <div className="space-y-2 group">
                <Label htmlFor="travelHistory" className="text-sm font-medium">Travel History</Label>
                <Textarea
                  id="travelHistory"
                  value={formData.travelHistory}
                  onChange={(e) => handleInputChange('travelHistory', e.target.value)}
                  placeholder="List countries you have visited in the last 10 years..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="ongoingImmigrationApps" className="text-sm font-medium">Ongoing Immigration Applications</Label>
                <Textarea
                  id="ongoingImmigrationApps"
                  value={formData.ongoingImmigrationApps}
                  onChange={(e) => handleInputChange('ongoingImmigrationApps', e.target.value)}
                  placeholder="Details of any currently pending visa or immigration applications..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-edvios-green flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Document Readiness</p>
                <p className="text-sm text-muted-foreground">Tell us about the document preparation</p>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Please indicate which documents you currently have ready.
              </Label>
              {[
                { id: 'hasValidPassport', label: 'Valid Passport', field: 'hasValidPassport' },
                { id: 'hasAcademicTranscripts', label: 'Academic Transcripts', field: 'hasAcademicTranscripts' },
                { id: 'hasRecommendationLetters', label: 'Recommendation Letters', field: 'hasRecommendationLetters' },
                { id: 'hasPersonalStatement', label: 'Personal Statement/Essay', field: 'hasPersonalStatement' }
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={item.id}
                    checked={formData[item.field as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => handleInputChange(item.field, checked)}
                    className="data-[state=checked]:bg-edvios-green"
                  />
                  <Label htmlFor={item.id} className="text-sm font-medium cursor-pointer flex-1">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-5">
              <div className="space-y-2 group">
                <Label htmlFor="workExperience" className="text-sm font-medium">
                  Work Experience (if any)
                </Label>
                <Textarea
                  id="workExperience"
                  value={formData.workExperience}
                  onChange={(e) => handleInputChange('workExperience', e.target.value)}
                  placeholder="Briefly describe your work experience..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="extraCurricular" className="text-sm font-medium">
                  Extracurricular Activities
                </Label>
                <Textarea
                  id="extraCurricular"
                  value={formData.extraCurricular}
                  onChange={(e) => handleInputChange('extraCurricular', e.target.value)}
                  placeholder="Sports, volunteering, etc..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="careerGoals" className="text-sm font-medium">
                  Career Goals
                </Label>
                <Textarea
                  id="careerGoals"
                  value={formData.careerGoals}
                  onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                  placeholder="What are your career aspirations?"
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-edvios-green flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Final Details</p>
                <p className="text-sm text-muted-foreground">Just a few more things...</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 group">
                <Label htmlFor="referralSource" className="text-sm font-medium">
                  How did you hear about us?
                </Label>
                <Select value={formData.referralSource} onValueChange={(value) => handleInputChange('referralSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="agent">Education Agent</SelectItem>
                    <SelectItem value="friend">Friend/Family</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="preferredContactMethod" className="text-sm font-medium">
                  Preferred Contact Method
                </Label>
                <Select value={formData.preferredContactMethod} onValueChange={(value) => handleInputChange('preferredContactMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="video-call">Video Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 group md:col-span-2">
                <Label htmlFor="bestTimeToContact" className="text-sm font-medium">
                  Best Time to Contact
                </Label>
                <Select value={formData.bestTimeToContact} onValueChange={(value) => handleInputChange('bestTimeToContact', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select best time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                    <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 group md:col-span-2">
                <Label htmlFor="additionalQuestions" className="text-sm font-medium">
                  Additional Requirements or Questions
                </Label>
                <Textarea
                  id="additionalQuestions"
                  value={formData.additionalQuestions}
                  onChange={(e) => handleInputChange('additionalQuestions', e.target.value)}
                  placeholder="Any specific requirements, questions, or concerns..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>

            <Separator className="my-6" />

            <div className="p-4 rounded-lg border-2 border-edvios-green/30 bg-edvios-green/5 hover:border-edvios-green/50 transition-all duration-200 space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => handleInputChange('marketingConsent', checked === true)}
                  className="mt-1"
                />
                <Label htmlFor="marketingConsent" className="text-sm cursor-pointer leading-relaxed">
                  I agree to receive marketing communications and updates
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleInputChange('termsAccepted', checked === true)}
                  className="mt-1"
                />
                <Label htmlFor="termsAccepted" className="text-sm cursor-pointer leading-relaxed">
                  I accept the <span className="font-medium underline">Terms and Conditions</span> and <span className="font-medium underline">Privacy Policy</span> <span className="text-destructive">*</span>
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-edvios-green/5 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-2xl border-0 overflow-hidden">

          <CardHeader className="text-center relative pb-8 pt-10">
            <CardTitle className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-black-400">
                Student Registration
              </span>
            </CardTitle>

            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="font-medium">Step {currentStep} of {totalSteps}</span>
                <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-secondary">
                <div className="h-full bg-edvios-green rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
              </Progress>
            </div>

            <div className="flex justify-center gap-3 mt-6">
              {[1, 2, 3, 4, 5, 6].map((step) => {
                const Icon = stepIcons[step - 1];
                return (
                  <div
                    key={step}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300 ${step < currentStep
                      ? 'bg-gradient text-white scale-95'
                      : step === currentStep
                        ? 'bg-gradient text-white scale-110 shadow-lg'
                        : 'bg-secondary text-muted-foreground scale-90'
                      }`}
                  >
                    {step < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="relative">

            {renderStepContent()}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-4">
              <div className="flex gap-2 order-2 sm:order-1">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="order-1 sm:order-2">
                {currentStep < totalSteps ? (
                  <Button 
                    onClick={handleNextStep}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSubmit(onSubmit, onClose)}
                    disabled={isSubmitting}
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;