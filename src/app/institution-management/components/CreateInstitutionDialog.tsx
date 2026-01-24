// app/institutions/components/CreateInstitutionDialog.tsx

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { X, Building2, Users, DollarSign, Mail, Globe } from 'lucide-react'
import { institutionApi } from '@/app/institution-management/api/institution-managemet.api'
import type { CreateInstitutionDTO, UpdateInstitutionDTO } from '@/app/institution-management/dtos/institution-managemet.dto'
import type { Institution } from '@/app/institution-management/types/institute-managemet.types'

interface CreateInstitutionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: () => void
  editInstitution?: Institution | null
  onUpdated?: () => void
}

const INSTITUTION_TYPES = ['UNIVERSITY', 'COLLEGE', 'SCHOOL', 'INSTITUTE']
const STATUS_OPTIONS = ['ACTIVE', 'PENDING', 'INACTIVE']
const PARTNERSHIP_TYPES = ['PREMIUM', 'STANDARD', 'BASIC']

export function CreateInstitutionDialog({
  open,
  onOpenChange,
  onCreated,
  editInstitution,
  onUpdated
}: CreateInstitutionDialogProps) {
  const isEditMode = !!editInstitution
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [specialties, setSpecialties] = useState<string[]>([])
  const [accreditations, setAccreditations] = useState<string[]>([])
  const [specialtyInput, setSpecialtyInput] = useState('')
  const [accreditationInput, setAccreditationInput] = useState('')
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    type: 'UNIVERSITY',
    country: '',
    city: '',
    ranking: 0,
    establishedYear: new Date().getFullYear(),
    totalStudents: 0,
    internationalStudents: 0,
    programsCount: 0,
    tuitionRange: '',
    status: 'ACTIVE',
    partnership: 'STANDARD',
    contactEmail: '',
    website: '',
    logo: '',
    description: '',
  })

  // Populate form when editing
  React.useEffect(() => {
    if (editInstitution && open) {
      setFormData({
        name: editInstitution.name,
        type: editInstitution.type.toUpperCase(),
        country: editInstitution.country,
        city: editInstitution.city,
        ranking: editInstitution.ranking,
        establishedYear: editInstitution.establishedYear,
        totalStudents: editInstitution.totalStudents,
        internationalStudents: editInstitution.internationalStudents,
        programsCount: editInstitution.programsCount || 0,
        tuitionRange: editInstitution.tuitionRange,
        status: editInstitution.status.toUpperCase(),
        partnership: editInstitution.partnership.toUpperCase(),
        contactEmail: editInstitution.contactEmail,
        website: editInstitution.website,
        logo: '',
        description: editInstitution.description,
      })
      setSpecialties(editInstitution.specialties || [])
      setAccreditations(editInstitution.accreditations || [])
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        name: '',
        type: 'UNIVERSITY',
        country: '',
        city: '',
        ranking: 0,
        establishedYear: new Date().getFullYear(),
        totalStudents: 0,
        internationalStudents: 0,
        programsCount: 0,
        tuitionRange: '',
        status: 'ACTIVE',
        partnership: 'STANDARD',
        contactEmail: '',
        website: '',
        logo: '',
        description: '',
      })
      setSpecialties([])
      setAccreditations([])
      setError(null)
    }
  }, [editInstitution, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseInt(value)) : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()])
      setSpecialtyInput('')
    }
  }

  const addAccreditation = () => {
    if (accreditationInput.trim() && !accreditations.includes(accreditationInput.trim())) {
      setAccreditations([...accreditations, accreditationInput.trim()])
      setAccreditationInput('')
    }
  }

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty))
  }

  const removeAccreditation = (accreditation: string) => {
    setAccreditations(accreditations.filter(a => a !== accreditation))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name.trim()) {
      setError('Institution name is required')
      return
    }
    if (!formData.country.trim()) {
      setError('Country is required')
      return
    }
    if (!formData.city.trim()) {
      setError('City is required')
      return
    }
    if (!formData.contactEmail.trim()) {
      setError('Contact email is required')
      return
    }
    if (!formData.website.trim()) {
      setError('Website URL is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }

    // For edit mode, show confirmation dialog
    if (isEditMode) {
      setConfirmDialogOpen(true)
      return
    }

    // For create mode, submit directly
    await submitForm()
  }

  const submitForm = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (isEditMode && editInstitution) {
        // Update existing institution
        const updateData: UpdateInstitutionDTO = {
          id: editInstitution.id,
          name: formData.name,
          type: formData.type as UpdateInstitutionDTO['type'],
          country: formData.country,
          city: formData.city,
          ranking: formData.ranking,
          establishedYear: formData.establishedYear,
          totalStudents: formData.totalStudents,
          internationalStudents: formData.internationalStudents,
          programsCount: formData.programsCount,
          tuitionRange: formData.tuitionRange,
          status: formData.status as UpdateInstitutionDTO['status'],
          partnership: formData.partnership as UpdateInstitutionDTO['partnership'],
          contactEmail: formData.contactEmail,
          website: formData.website,
          description: formData.description,
          specialties,
          accreditations,
        }

        await institutionApi.update(updateData)
        setConfirmDialogOpen(false)
        onOpenChange(false)
        onUpdated?.()
      } else {
        // Create new institution
        const createData: CreateInstitutionDTO = {
          ...formData,
          type: formData.type as CreateInstitutionDTO['type'],
          status: formData.status as CreateInstitutionDTO['status'],
          partnership: formData.partnership as CreateInstitutionDTO['partnership'],
          specialties,
          accreditations,
        }

        await institutionApi.create(createData)

        onOpenChange(false)
        onCreated?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} institution`)
      setConfirmDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-orange-500" />
            {isEditMode ? 'Edit Institution' : 'Add New Institution'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {isEditMode ? 'Update the institution details below' : 'Fill in the details to register a new educational institution'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Institution Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Global Tech University"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">Institution Type *</Label>
                <Select value={formData.type} onValueChange={(val) => handleSelectChange('type', val)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTITUTION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., United States"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., New York"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ranking" className="text-sm font-medium">Global Ranking</Label>
                <Input
                  id="ranking"
                  name="ranking"
                  type="number"
                  min="0"
                  value={formData.ranking}
                  onChange={handleInputChange}
                  placeholder="e.g., 150"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="establishedYear" className="text-sm font-medium">Established Year</Label>
                <Input
                  id="establishedYear"
                  name="establishedYear"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Institution Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a comprehensive description of the institution, its mission, values, and key offerings..."
                rows={4}
                disabled={isLoading}
                className="resize-none"
              />
            </div>
          </div>

          {/* Student Demographics Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <Users className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Student Demographics</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="totalStudents" className="text-sm font-medium">Total Students</Label>
                <Input
                  id="totalStudents"
                  name="totalStudents"
                  type="number"
                  min="0"
                  value={formData.totalStudents}
                  onChange={handleInputChange}
                  placeholder="e.g., 15000"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="internationalStudents" className="text-sm font-medium">International Students</Label>
                <Input
                  id="internationalStudents"
                  name="internationalStudents"
                  type="number"
                  min="0"
                  value={formData.internationalStudents}
                  onChange={handleInputChange}
                  placeholder="e.g., 3000"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="programsCount" className="text-sm font-medium">Available Programs</Label>
                <Input
                  id="programsCount"
                  name="programsCount"
                  type="number"
                  min="0"
                  value={formData.programsCount}
                  onChange={handleInputChange}
                  placeholder="e.g., 125"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Financial & Partnership Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <DollarSign className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Financial & Partnership Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tuitionRange" className="text-sm font-medium">Annual Tuition Range</Label>
                <Input
                  id="tuitionRange"
                  name="tuitionRange"
                  value={formData.tuitionRange}
                  onChange={handleInputChange}
                  placeholder="e.g., $20,000 - $40,000"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
                <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnership" className="text-sm font-medium">Partnership Level *</Label>
                <Select value={formData.partnership} onValueChange={(val) => handleSelectChange('partnership', val)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTNERSHIP_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <Mail className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Email *
                </Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="admissions@institution.edu"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Official Website *
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.institution.edu"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="logo" className="text-sm font-medium">Logo URL (Optional)</Label>
                <Input
                  id="logo"
                  name="logo"
                  type="url"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="https://www.institution.edu/images/logo.png"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Specialties & Accreditations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Specialties */}
            <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-base font-semibold text-gray-900">Academic Specialties</h3>

              <div className="flex gap-2">
                <Input
                  value={specialtyInput}
                  onChange={(e) => setSpecialtyInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSpecialty()
                    }
                  }}
                  placeholder="e.g., Computer Science"
                  disabled={isLoading}
                  className="h-10 bg-white"
                />
                <Button
                  type="button"
                  onClick={addSpecialty}
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                >
                  Add
                </Button>
              </div>

              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {specialties.map(specialty => (
                    <Badge
                      key={specialty}
                      className="bg-orange-100 text-orange-800 border border-orange-300 pr-1 text-xs"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="ml-1.5 hover:bg-orange-200 rounded-full p-0.5"
                        disabled={isLoading}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {specialties.length === 0 && (
                <p className="text-xs text-gray-500 italic">No specialties added yet</p>
              )}
            </div>

            {/* Accreditations */}
            <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-base font-semibold text-gray-900">Accreditations</h3>

              <div className="flex gap-2">
                <Input
                  value={accreditationInput}
                  onChange={(e) => setAccreditationInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addAccreditation()
                    }
                  }}
                  placeholder="e.g., ABET Accredited"
                  disabled={isLoading}
                  className="h-10 bg-white"
                />
                <Button
                  type="button"
                  onClick={addAccreditation}
                  disabled={isLoading}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6"
                >
                  Add
                </Button>
              </div>

              {accreditations.length > 0 && (
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {accreditations.map(accreditation => (
                    <Badge
                      key={accreditation}
                      className="bg-purple-100 text-purple-800 border border-purple-300 pr-1 text-xs"
                    >
                      {accreditation}
                      <button
                        type="button"
                        onClick={() => removeAccreditation(accreditation)}
                        className="ml-1.5 hover:bg-purple-200 rounded-full p-0.5"
                        disabled={isLoading}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {accreditations.length === 0 && (
                <p className="text-xs text-gray-500 italic">No accreditations added yet</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 bg-orange-gradient hover:opacity-90 text-base font-medium"
            >
              {isLoading 
                ? (isEditMode ? 'Saving Changes...' : 'Creating Institution...') 
                : (isEditMode ? 'Save Changes' : 'Create Institution')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    {/* Confirmation Dialog for Edit Mode */}
    <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Confirm Changes</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Are you sure you want to save these changes to <strong className="text-gray-900">{formData.name}</strong>?
            <br />
            This will update the institution details in the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={submitForm}
            disabled={isLoading}
            className="bg-orange-gradient hover:opacity-90"
          >
            {isLoading ? 'Saving...' : 'Confirm & Save'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  )
}