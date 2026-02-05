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
import { Users, GraduationCap, Target, FileText, CheckCircle, ArrowRight, ArrowLeft, Send, Bot, Loader2 } from 'lucide-react';
import { useRegistration } from './hooks/use-registration';
import { StudentRegistrationData } from './types/registration.types';

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
    handleAIAssistance,
  } = useRegistration();

  const stepIcons = [Users, GraduationCap, Target, FileText, CheckCircle];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Personal Information</p>
                <p className="text-sm text-muted-foreground text-black ">Tell us about yourself</p>
              </div>
            </div>
            
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 group">
                <Label htmlFor="firstName" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="firstName" 
                  value={formData.firstName} 
                  onChange={(e) => handleInputChange('firstName', e.target.value)} 
                  placeholder="Enter your first name"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="lastName" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="lastName" 
                  value={formData.lastName} 
                  onChange={(e) => handleInputChange('lastName', e.target.value)} 
                  placeholder="Enter your last name"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                  placeholder="your.email@example.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 bg-muted/50 cursor-not-allowed"
                  readOnly
                  disabled
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="phone" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)} 
                  placeholder="+1 234 567 8900"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="dob" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="dob" 
                  type="date" 
                  value={formData.dob} 
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                />
              </div>

              <div className="space-y-2 group">
                <Label htmlFor="nationality" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Nationality
                </Label>
                <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger className="transition-all duration-200">
                    <SelectValue placeholder="Select your nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="pakistani">Pakistani</SelectItem>
                    <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                    <SelectItem value="nigerian">Nigerian</SelectItem>
                    <SelectItem value="nepali">Nepali</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="address" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Address
                </Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={(e) => handleInputChange('address', e.target.value)} 
                  placeholder="Enter your address"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="currentCountry" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Current Country
                </Label>
                <Input 
                  id="currentCountry" 
                  value={formData.currentCountry} 
                  onChange={(e) => handleInputChange('currentCountry', e.target.value)} 
                  placeholder="Country where you currently live"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="currentCity" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Current City
                </Label>
                <Input 
                  id="currentCity" 
                  value={formData.currentCity} 
                  onChange={(e) => handleInputChange('currentCity', e.target.value)} 
                  placeholder="City where you currently live"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
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
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Academic Background</p>
                <p className="text-sm text-muted-foreground">Your educational journey</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 group">
                <Label htmlFor="currentEducationLevel" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Current Education Level <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.currentEducationLevel} onValueChange={(value) => handleInputChange('currentEducationLevel', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                    <SelectValue placeholder="Select your current education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
                    <SelectItem value="master">Master&apos;s Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="currentInstitution" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Current Institution
                </Label>
                <Input 
                  id="currentInstitution" 
                  value={formData.currentInstitution} 
                  onChange={(e) => handleInputChange('currentInstitution', e.target.value)} 
                  placeholder="Name of your current school/university"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="fieldOfStudy" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Field of Study <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.fieldOfStudy} onValueChange={(value) => handleInputChange('fieldOfStudy', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                    <SelectValue placeholder="Select your field of study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="business">Business Administration</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                    <SelectItem value="sciences">Natural Sciences</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="gpa" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  GPA/Percentage
                </Label>
                <Input 
                  id="gpa" 
                  value={formData.gpa} 
                  onChange={(e) => handleInputChange('gpa', e.target.value)} 
                  placeholder="e.g., 3.8 or 85%"
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="graduationDate" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Graduation Date
                </Label>
                <Input 
                  id="graduationDate" 
                  type="date" 
                  value={formData.graduationDate} 
                  onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="englishTest" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  English Proficiency Test
                </Label>
                <Select value={formData.englishTest} onValueChange={(value) => handleInputChange('englishTest', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                    <SelectValue placeholder="Select test taken" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                    <SelectItem value="TOEFL">TOEFL</SelectItem>
                    <SelectItem value="PTE">PTE</SelectItem>
                    <SelectItem value="DUOLINGO">Duolingo</SelectItem>
                    <SelectItem value="NONE">Not taken yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(formData.englishTest === 'IELTS' || formData.englishTest === 'TOEFL' || formData.englishTest === 'PTE' || formData.englishTest === 'DUOLINGO') && (
                <div className="space-y-2 group animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Label htmlFor="englishScore" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                    {formData.englishTest} Score
                  </Label>
                  <Input 
                    id="englishScore" 
                    value={formData.englishScore} 
                    onChange={(e) => handleInputChange('englishScore', e.target.value)} 
                    placeholder="e.g., 7.0 or 100"
                    className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Study Preferences</p>
                <p className="text-sm text-muted-foreground">Where do you want to study?</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 group">
                <Label htmlFor="preferredDestination" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Preferred Destination <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.preferredDestination} onValueChange={(value) => handleInputChange('preferredDestination', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                    <SelectValue placeholder="Select preferred country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="new-zealand">New Zealand</SelectItem>
                    <SelectItem value="ireland">Ireland</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="netherlands">Netherlands</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="preferredProgram" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Preferred Program <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.preferredProgram} onValueChange={(value) => handleInputChange('preferredProgram', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                    <SelectValue placeholder="Select program type" />
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
                <Label htmlFor="preferredStudyLevel" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Study Level <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.preferredStudyLevel} onValueChange={(value) => handleInputChange('preferredStudyLevel', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                    <SelectValue placeholder="Select study level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BACHELORS">Bachelor&apos;s Degree</SelectItem>
                    <SelectItem value="MASTERS">Master&apos;s Degree</SelectItem>
                    <SelectItem value="PHD">PhD</SelectItem>
                    <SelectItem value="DIPLOMA">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="preferredIntake" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Preferred Intake
                </Label>
                <Select value={formData.preferredIntake} onValueChange={(value) => handleInputChange('preferredIntake', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                    <SelectValue placeholder="Select intake period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="september-2024">September 2024</SelectItem>
                    <SelectItem value="january-2025">January 2025</SelectItem>
                    <SelectItem value="september-2025">September 2025</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 group md:col-span-2">
                <Label htmlFor="budgetRange" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Budget Range (per year)
                </Label>
                <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-20k">Under $20,000</SelectItem>
                    <SelectItem value="20k-40k">$20,000 - $40,000</SelectItem>
                    <SelectItem value="40k-60k">$40,000 - $60,000</SelectItem>
                    <SelectItem value="60k-80k">$60,000 - $80,000</SelectItem>
                    <SelectItem value="above-80k">Above $80,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-3">
                  <Checkbox 
                  id="scholarshipInterest" 
                  checked={formData.scholarshipInterest} 
                  onCheckedChange={(checked) => handleInputChange('scholarshipInterest', checked === true)}
                  className="data-[state=checked]:bg-gradient"
                />
                <Label htmlFor="scholarshipInterest" className="text-sm font-medium cursor-pointer">
                  I&apos;m Interested in scholarships
                </Label>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Document Readiness</p>
                <p className="text-sm text-muted-foreground">Tell us about the document preparation</p>
              </div>
            </div>
            
            <div className="space-y-4">
                <Label htmlFor="extracurriculars" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Please indicate which documents you currently have ready. This helps us provide better guidance.
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
                    className="data-[state=checked]:bg-gradient"
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
                <Label htmlFor="workExperience" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Work Experience (if any)
                </Label>
                <Textarea 
                  id="workExperience" 
                  value={formData.workExperience} 
                  onChange={(e) => handleInputChange('workExperience', e.target.value)} 
                  placeholder="Briefly describe your work experience..."
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 resize-none"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="extraCurricular" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Extracurricular Activities
                </Label>
                <Textarea 
                  id="extraCurricular" 
                  value={formData.extraCurricular} 
                  onChange={(e) => handleInputChange('extraCurricular', e.target.value)} 
                  placeholder="Sports, volunteering, leadership roles, etc..."
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 resize-none"
                />
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="careerGoals" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Career Goals
                </Label>
                <Textarea 
                  id="careerGoals" 
                  value={formData.careerGoals} 
                  onChange={(e) => handleInputChange('careerGoals', e.target.value)} 
                  placeholder="What are your career aspirations after graduation?"
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 resize-none"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold secondary-foreground">Communication Preferences & Final Details</p>
                <p className="text-sm text-muted-foreground">Just a few more things...</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 group">
                <Label htmlFor="referralSource" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  How did you hear about us?
                </Label>
                <Select value={formData.referralSource} onValueChange={(value) => handleInputChange('referralSource', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="agent">Education Agent</SelectItem>
                    <SelectItem value="friend">Friend/Family</SelectItem>
                    <SelectItem value="advertisement">Advertisement</SelectItem>
                    <SelectItem value="education-fair">Education Fair</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 group">
                <Label htmlFor="preferredContactMethod" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Preferred Contact Method
                </Label>
                <Select value={formData.preferredContactMethod} onValueChange={(value) => handleInputChange('preferredContactMethod', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
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
                <Label htmlFor="bestTimeToContact" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Best Time to Contact
                </Label>
                <Select value={formData.bestTimeToContact} onValueChange={(value) => handleInputChange('bestTimeToContact', value)}>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20">
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
                <Label htmlFor="additionalQuestions" className="text-sm font-medium transition-colors group-focus-within:text-gradient">
                  Additional Requirements or Questions
                </Label>
                <Textarea 
                  id="additionalQuestions" 
                  value={formData.additionalQuestions} 
                  onChange={(e) => handleInputChange('additionalQuestions', e.target.value)} 
                  placeholder="Any specific requirements, questions, or concerns you'd like to discuss..."
                  rows={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-green-500/20 resize-none"
                />
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="p-4 rounded-lg border-2 border-green-500/30 bg-green-500/5 hover:border-green-500/50 transition-all duration-200 space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="marketingConsent" 
                  checked={formData.marketingConsent} 
                  onCheckedChange={(checked) => handleInputChange('marketingConsent', checked === true)}
                  className="mt-1"
                />
                <Label htmlFor="marketingConsent" className="text-sm cursor-pointer leading-relaxed">
                  I agree to receive marketing communications and updates about programs and services
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
                  I accept the <span className="text-gradient font-medium underline">Terms and Conditions</span> and <span className="text-gradient font-medium underline">Privacy Policy</span> <span className="text-destructive">*</span>
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-500/5 p-4 md:p-6 lg:p-8">
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
                <div className="h-full bg-gradient rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
              </Progress>
            </div>
            
            <div className="flex justify-center gap-3 mt-6">
              {[1, 2, 3, 4, 5].map((step) => {
                const Icon = stepIcons[step - 1];
                return (
                  <div
                    key={step}
                    className={`relative flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      step < currentStep
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
                    className="hover:border-green-500 hover:text-gradient transition-all duration-200"
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
                    className="bg-gradient hover:opacity-90 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px]"
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleSubmit(onSubmit, onClose)}
                    disabled={isSubmitting}
                    className="bg-gradient hover:opacity-90 text-white px-8 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px] disabled:opacity-50"
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