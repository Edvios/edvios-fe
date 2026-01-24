// app/institutions/components/InstitutionDetailsDialog.tsx

import { useState, useEffect } from 'react'
import { MapPin, Calendar, Users, Globe, Mail, Award, Building, BookOpen, Trash2, Edit } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { institutionApi } from '@/app/institution-management/api/institution-managemet.api'
import type { Institution } from '@/app/institution-management/types/institute-managemet.types'
import { CreateInstitutionDialog } from './CreateInstitutionDialog'

interface InstitutionDetailsDialogProps {
  institutionId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
  onUpdated?: () => void
}

export function InstitutionDetailsDialog({
  institutionId,
  open,
  onOpenChange,
  onDeleted,
  onUpdated
}: InstitutionDetailsDialogProps) {
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    if (open && institutionId) {
      fetchInstitution()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, institutionId])

  const fetchInstitution = async () => {
    if (!institutionId) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await institutionApi.getById(institutionId)
      setInstitution(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch institution details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!institutionId) return

    try {
      setIsDeleting(true)
      await institutionApi.delete(institutionId)
      setDeleteConfirmOpen(false)
      onOpenChange(false)
      onDeleted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete institution')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = () => {
    setEditDialogOpen(true)
    onOpenChange(false) // Close details dialog when opening edit dialog
  }

  const handleEditComplete = () => {
    fetchInstitution() // Refresh the data
    onUpdated?.()
  }

  const getStatusBadgeClass = (status: string) => {
    const value = status.toLowerCase()
    if (value === 'active') return 'bg-green-100 text-green-700'
    if (value === 'pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getPartnershipBadgeClass = (level: string) => {
    const value = level.toLowerCase()
    if (value === 'premium') return 'bg-purple-100 text-purple-700'
    if (value === 'standard') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Institution Details</DialogTitle>
          </DialogHeader>

          {isLoading && (
            <div className="py-8 text-center text-gray-600">
              Loading institution details...
            </div>
          )}

          {error && (
            <div className="py-4 px-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {institution && !isLoading && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between pb-4 ">
                <div className="flex-1">
                  <p className="text-2xl font-bold text-gray-900">{institution.name}</p>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{institution.city}, {institution.country}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={`border-0 ${getStatusBadgeClass(institution.status)}`}>
                    {institution.status}
                  </Badge>
                  <Badge className={`border-0 ${getPartnershipBadgeClass(institution.partnership)}`}>
                    {institution.partnership}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{institution.description}</p>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-orange-gradient rounded-lg flex items-center justify-center text-white">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ranking</p>
                    <p className="text-lg font-bold text-gray-900">#{institution.ranking}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Programs</p>
                    <p className="text-lg font-bold text-gray-900">{institution.programsCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Students</p>
                    <p className="text-lg font-bold text-gray-900">{institution.totalStudents.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">International</p>
                    <p className="text-lg font-bold text-gray-900">{institution.internationalStudents.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Established</p>
                    <p className="text-lg font-bold text-gray-900">{institution.establishedYear}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                    <Building size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">{institution.type}</p>
                  </div>
                </div>
              </div>

              {/* Tuition Range */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Tuition Range</h4>
                <p className="text-lg font-medium text-orange-600">{institution.tuitionRange}</p>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <a href={`mailto:${institution.contactEmail}`} className="hover:text-orange-600">
                      {institution.contactEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe size={16} />
                    <a 
                      href={institution.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-orange-600"
                    >
                      {institution.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              {institution.specialties.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {institution.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="bg-orange-100 text-orange-700 border-0">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Accreditations */}
              {institution.accreditations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Accreditations</h4>
                  <div className="flex flex-wrap gap-2">
                    {institution.accreditations.map((accreditation) => (
                      <Badge key={accreditation} variant="secondary" className="bg-purple-100 text-purple-700 border-0">
                        {accreditation}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}


              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleEdit}
                  className="flex-1 bg-orange-gradient hover:bg-orange-500"
                >
                  <Edit size={18} className="mr-2" />
                  Edit Institution
                </Button>
                <Button
                  onClick={() => setDeleteConfirmOpen(true)}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 size={18} className="mr-2" />
                  Delete Institution
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{institution?.name}</strong> and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <CreateInstitutionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editInstitution={institution}
        onUpdated={handleEditComplete}
      />
    </>
  )
}
