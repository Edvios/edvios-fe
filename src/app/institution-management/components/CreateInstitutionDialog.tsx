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
import { X } from 'lucide-react'
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEditMode ? 'Edit Institution' : 'Add New Institution'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the institution details' : 'Fill in the details to create a new institution'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Institution Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Global Tech University"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(val) => handleSelectChange('type', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTITUTION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="e.g., United States"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., New York"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="ranking">Ranking</Label>
                <Input
                  id="ranking"
                  name="ranking"
                  type="number"
                  min="0"
                  value={formData.ranking}
                  onChange={handleInputChange}
                  placeholder="0"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  name="establishedYear"
                  type="number"
                  min="1800"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed description of the institution..."
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Student Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="totalStudents">Total Students</Label>
                <Input
                  id="totalStudents"
                  name="totalStudents"
                  type="number"
                  min="0"
                  value={formData.totalStudents}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="internationalStudents">International Students</Label>
                <Input
                  id="internationalStudents"
                  name="internationalStudents"
                  type="number"
                  min="0"
                  value={formData.internationalStudents}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="programsCount">Programs Count</Label>
                <Input
                  id="programsCount"
                  name="programsCount"
                  type="number"
                  min="0"
                  value={formData.programsCount}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Financial & Partnership */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Financial & Partnership</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tuitionRange">Tuition Range</Label>
                <Input
                  id="tuitionRange"
                  name="tuitionRange"
                  value={formData.tuitionRange}
                  onChange={handleInputChange}
                  placeholder="e.g., $20,000 - $40,000"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(val) => handleSelectChange('status', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="partnership">Partnership Type *</Label>
                <Select value={formData.partnership} onValueChange={(val) => handleSelectChange('partnership', val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTNERSHIP_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="info@institution.edu"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="website">Website *</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.institution.edu"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  type="url"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="https://www.institution.edu/logo.png"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Specialties</h3>

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
                placeholder="Add a specialty and press Enter"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addSpecialty}
                disabled={isLoading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                Add
              </Button>
            </div>

            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {specialties.map(specialty => (
                  <Badge
                    key={specialty}
                    variant="secondary"
                    className="bg-orange-100 text-orange-700 border-0 cursor-pointer"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(specialty)}
                      className="ml-1"
                      disabled={isLoading}
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Accreditations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Accreditations</h3>

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
                placeholder="Add an accreditation and press Enter"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addAccreditation}
                disabled={isLoading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900"
              >
                Add
              </Button>
            </div>

            {accreditations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {accreditations.map(accreditation => (
                  <Badge
                    key={accreditation}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 border-0 cursor-pointer"
                  >
                    {accreditation}
                    <button
                      type="button"
                      onClick={() => removeAccreditation(accreditation)}
                      className="ml-1"
                      disabled={isLoading}
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-gradient hover:opacity-90"
            >
              {isLoading 
                ? (isEditMode ? 'Saving...' : 'Creating...') 
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
          <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to save these changes to <strong>{formData.name}</strong>?
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
