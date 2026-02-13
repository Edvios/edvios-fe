import React, { useState } from 'react';
import { StudyLevel, ProgramStatus } from '../enums';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';


interface Institution {
  id: string;
  name: string;
}

interface Intake {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface BackendProgramData {
  id?: string;
  title: string;
  level: string;
  intakeId: string;
  duration: string;
  tuitionFee: string;
  applicationFee: string;
  englishTestScore: string;
  subjectId: string;
  scholarship: boolean;
  applicationDeadline: string;
  ucasCode: string;
  englishWaiver: boolean;
  popularityRank: number;
  institutionId: string;
  status: string;
}

interface ProgramFormData {
  id?: string;
  title: string;
  institutionId?: string;
  university: string;
  location: string;
  tuition: string;
  applicationFee: string;
  duration: string;
  intakeId?: string;
  intake: string;
  level?: StudyLevel;
  englishTestScore: string;
  scholarship: boolean;
  applicationDeadline: string;
  subjectId?: string;
  subjectName: string;
  ucasCode: string;
  popularityRank?: number;
  englishWaiver: boolean;
  status?: ProgramStatus;
}

interface FormErrors {
  [key: string]: string;
}

interface CreateProgramFormProps {
  isEdit?: boolean;
  initialData?: Partial<ProgramFormData>;
  institutions: Institution[];
  locations: string[];
  intakes: Intake[];
  subjectsList: Subject[];
  onSubmit: (data: BackendProgramData) => Promise<void>;
  onCancel: () => void;
}

const CreateProgramForm: React.FC<CreateProgramFormProps> = ({
  isEdit = false,
  initialData,
  institutions,
  locations,
  intakes,
  subjectsList,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState<ProgramFormData>({
    title: '',
    institutionId: '',
    university: '',
    location: '',
    tuition: '',
    applicationFee: '',
    duration: '',
    intakeId: '',
    intake: '',
    englishTestScore: '',
    scholarship: false,
    applicationDeadline: '',
    subjectId: '',
    subjectName: '',
    ucasCode: '',
    englishWaiver: false,
    popularityRank: 0,
    ...initialData,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof ProgramFormData, value: string | number | boolean | StudyLevel | ProgramStatus | undefined) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Transform to backend DTO format
      const backendData: BackendProgramData = {
        title: form.title,
        level: form.level || 'BACHELORS',
        intakeId: form.intakeId || '',
        duration: form.duration,
        tuitionFee: form.tuition,
        applicationFee: form.applicationFee,
        englishTestScore: form.englishTestScore,
        subjectId: form.subjectId || '',
        scholarship: form.scholarship,
        applicationDeadline: form.applicationDeadline,
        ucasCode: form.ucasCode || '',
        englishWaiver: form.englishWaiver,
        popularityRank: form.popularityRank || 0,
        institutionId: form.institutionId || '',
        status: form.status || 'AVAILABLE',
      };
      
      // Include id when editing
      if (isEdit && form.id) {
        backendData.id = form.id;
      }
      
      await onSubmit(backendData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStudyLevelLabel = (level: StudyLevel): string => {
    const labels = {
      [StudyLevel.BACHELORS]: 'Bachelors',
      [StudyLevel.MASTERS]: 'Masters',
      [StudyLevel.PHD]: 'PhD',
      [StudyLevel.DIPLOMA]: 'Diploma',
    };
    return labels[level];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Basic Information</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Program Title */}
          <div className="lg:col-span-2 space-y-2">
            <Label htmlFor="title">
              Program Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              aria-invalid={errors.title ? 'true' : undefined}
              className={errors.title ? 'border-red-300' : ''}
              placeholder="e.g., Master of Science in Computer Science"
            />
            {errors.title && (
              <div className="mt-1 text-sm text-red-600">{errors.title}</div>
            )}
          </div>

      {/* University */}
      <div className="space-y-2">
        <Label htmlFor="university">
          University <span className="text-red-500">*</span>
        </Label>
        <Select
          value={form.institutionId}
          onValueChange={(value) => {
            const institution = institutions.find(i => i.id === value);
            updateField('institutionId', value);
            updateField('university', institution?.name || '');
          }}
        >
          <SelectTrigger className={errors.university ? 'border-red-300' : ''}>
            <SelectValue placeholder="Select university" />
          </SelectTrigger>
          <SelectContent>
            {institutions.map((inst) => (
              <SelectItem key={inst.id} value={inst.id}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.university && (
          <div className="mt-1 text-sm text-red-600">{errors.university}</div>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select
          value={form.location}
          onValueChange={(value) => updateField('location', value)}
        >
          <SelectTrigger className={errors.location ? 'border-red-300' : ''}>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {form.location && !locations.includes(form.location) && (
              <SelectItem value={form.location}>{form.location}</SelectItem>
            )}
            {locations.map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.location && (
          <div className="mt-1 text-sm text-red-600">{errors.location}</div>
        )}
      </div>
        </div>
      </div>

      {/* Financial Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Financial Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tuition */}
          <div className="space-y-2">
            <Label htmlFor="tuition">Tuition (1st year)</Label>
            <Input
              id="tuition"
              type="text"
              value={form.tuition}
              onChange={(e) => updateField('tuition', e.target.value)}
              className={errors.tuition ? 'border-red-300' : ''}
              placeholder="£37,380 – £62,820"
            />
            {errors.tuition && (
              <div className="mt-1 text-sm text-red-600">{errors.tuition}</div>
            )}
          </div>

      {/* Application Fee */}
      <div className="space-y-2">
        <Label htmlFor="applicationFee">Application Fee</Label>
        <Input
          id="applicationFee"
          type="text"
          value={form.applicationFee}
          onChange={(e) => updateField('applicationFee', e.target.value)}
          className={errors.applicationFee ? 'border-red-300' : ''}
          placeholder="e.g., $100"
        />
        {errors.applicationFee && (
          <div className="mt-1 text-sm text-red-600">{errors.applicationFee}</div>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          type="text"
          value={form.duration}
          onChange={(e) => updateField('duration', e.target.value)}
          className={errors.duration ? 'border-red-300' : ''}
          placeholder="36 months"
        />
        {errors.duration && (
          <div className="mt-1 text-sm text-red-600">{errors.duration}</div>
        )}
      </div>
        </div>
      </div>

      {/* Program Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Program Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Intake */}
          <div className="space-y-2">
            <Label htmlFor="intake">Intake</Label>
            <Select
              value={form.intakeId}
              onValueChange={(value) => {
                const intake = intakes.find(i => i.id === value);
                updateField('intakeId', value);
                updateField('intake', intake?.name || '');
              }}
            >
              <SelectTrigger className={errors.intake ? 'border-red-300' : ''}>
                <SelectValue placeholder="Select intake" />
              </SelectTrigger>
              <SelectContent>
                {intakes.map((intake) => (
                  <SelectItem key={intake.id} value={intake.id}>
                    {intake.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.intake && (
              <div className="mt-1 text-sm text-red-600">{errors.intake}</div>
            )}
          </div>

      {/* Level */}
      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Select
          value={form.level || ''}
          onValueChange={(value) => updateField('level', value || undefined)}
        >
          <SelectTrigger className={errors.level ? 'border-red-300' : ''}>
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(StudyLevel).map((v) => (
              <SelectItem key={v} value={v}>
                {getStudyLevelLabel(v)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.level && (
          <div className="mt-1 text-sm text-red-600">{errors.level}</div>
        )}
      </div>
        {errors.level && (
          <div className="mt-1 text-sm text-red-600">{errors.level}</div>
        )}
      </div>

      {/* English Test Score */}
      <div className="space-y-2">
        <label htmlFor="englishTestScore" className="block text-sm font-medium">
          English Test Score
        </label>
        <input
          id="englishTestScore"
          type="text"
          value={form.englishTestScore}
          onChange={(e) => updateField('englishTestScore', e.target.value)}
          className={`w-full mt-2 h-10 px-4 rounded-md border ${
            errors.englishTestScore ? 'border-red-300' : 'border-gray-200'
          } bg-transparent focus:ring-2 focus:ring-green-500`}
          placeholder="e.g. IELTS 6.5"
        />
        {errors.englishTestScore && (
          <div className="mt-1 text-sm text-red-600">{errors.englishTestScore}</div>
        )}
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium">
          Subject
        </label>
        <select
          id="subject"
          value={form.subjectId || ''}
          onChange={(e) => {
            const val = e.target.value;
            const sub = subjectsList.find((s) => s.id === val);
            updateField('subjectId', val || undefined);
            updateField('subjectName', sub?.name ?? '');
          }}
          className={`w-full mt-2 px-4 h-10 rounded-md border ${
            errors.subjectId ? 'border-red-300' : 'border-gray-200'
          } bg-transparent focus:ring-2 focus:ring-green-500`}
        >
          <option value="">Select subject</option>
          {subjectsList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.subjectId && (
          <div className="mt-1 text-sm text-red-600">{errors.subjectId}</div>
        )}
      </div>
        </div>
      

      {/* Additional Settings Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b">Additional Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Application Deadline */}
          <div className="space-y-2">
            <Label htmlFor="applicationDeadline">Application Deadline</Label>
            <Input
              id="applicationDeadline"
              type="datetime-local"
              value={form.applicationDeadline}
              onChange={(e) => updateField('applicationDeadline', e.target.value)}
              className={errors.applicationDeadline ? 'border-red-300' : ''}
            />
            {errors.applicationDeadline && (
              <div className="mt-1 text-sm text-red-600">{errors.applicationDeadline}</div>
            )}
          </div>

          {/* UCAS Code */}
          <div className="space-y-2">
            <Label htmlFor="ucasCode">UCAS Code</Label>
            <Input
              id="ucasCode"
              type="text"
              value={form.ucasCode}
              onChange={(e) => updateField('ucasCode', e.target.value)}
              className={errors.ucasCode ? 'border-red-300' : ''}
              placeholder="e.g., G400"
            />
            {errors.ucasCode && (
              <div className="mt-1 text-sm text-red-600">{errors.ucasCode}</div>
            )}
          </div>

          {/* Popularity Rank */}
          <div className="space-y-2">
            <Label htmlFor="popularityRank">Popularity Rank</Label>
            <Input
              id="popularityRank"
              type="number"
              value={form.popularityRank ?? ''}
              onChange={(e) =>
                updateField('popularityRank', e.target.value ? Number(e.target.value) : undefined)
              }
              className={errors.popularityRank ? 'border-red-300' : ''}
              placeholder="e.g., 1"
            />
            {errors.popularityRank && (
              <div className="mt-1 text-sm text-red-600">{errors.popularityRank}</div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={form.status || ''}
              onValueChange={(value) =>
                updateField('status', value ? (value as ProgramStatus) : undefined)
              }
            >
              <SelectTrigger className={errors.status ? 'border-red-300' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProgramStatus).map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <div className="mt-1 text-sm text-red-600">{errors.status}</div>
            )}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Scholarship */}
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <Checkbox
              id="scholarship"
              checked={form.scholarship}
              onCheckedChange={(checked) => updateField('scholarship', checked)}
            />
            <Label htmlFor="scholarship" className="cursor-pointer">
              Scholarships Available
            </Label>
          </div>

          {/* English Waiver */}
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <Checkbox
              id="englishWaiver"
              checked={form.englishWaiver}
              onCheckedChange={(checked) => updateField('englishWaiver', checked)}
            />
            <Label htmlFor="englishWaiver" className="cursor-pointer">
              English Waiver
            </Label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-11"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="flex-1 h-11 bg-edvios-green hover:opacity-90"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isEdit ? 'Saving Changes...' : 'Creating Program...'}
            </>
          ) : (
            isEdit ? 'Save Changes' : 'Create Program'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CreateProgramForm;