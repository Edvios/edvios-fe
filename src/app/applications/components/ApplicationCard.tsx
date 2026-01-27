'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  User,
  GraduationCap,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Globe,
} from 'lucide-react';
import { Application } from '@/app/applications/types/application.types';
import { ApplicationStatus } from '@/app/applications/enums/application.enum';

interface ApplicationCardProps {
  application: Application;
  onStatusUpdate: (id: string, status: ApplicationStatus) => Promise<void>;
}

const statusVariants: Record<ApplicationStatus, { className: string; label: string }> = {
  [ApplicationStatus.DRAFT]: {
    className: 'bg-gray-50 text-gray-700 border-gray-200',
    label: 'Draft',
  },
  [ApplicationStatus.SUBMITTED]: {
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    label: 'Submitted',
  },
  [ApplicationStatus.UNDER_REVIEW]: {
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Under Review',
  },
  [ApplicationStatus.ACCEPTED]: {
    className: 'bg-green-50 text-green-700 border-green-200',
    label: 'Accepted',
  },
  [ApplicationStatus.REJECTED]: {
    className: 'bg-red-50 text-red-700 border-red-200',
    label: 'Rejected',
  },
  [ApplicationStatus.WITHDRAWN]: {
    className: 'bg-gray-50 text-gray-700 border-gray-200',
    label: 'Withdrawn',
  },
};

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onStatusUpdate,
}) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (status: ApplicationStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(application.id, status);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const variant = statusVariants[status];
    return <Badge className={`${variant.className} border font-medium`}>{variant.label}</Badge>;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not available';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return 'Not available';
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const submittedAt = application.appliedDate ?? application.createdAt ?? application.updatedAt ?? null;
  const programRanking = application.program.ranking ?? application.program.popularityRank ?? 'N/A';
  const locationText = [application.program.location, application.program.country]
    .filter(Boolean)
    .join(', ');
  const intakeText =
    application.program.intake ?? application.program.intakeId ?? application.preferredIntakeId ?? 'N/A';

  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {application.program.title}
            </CardTitle>
            <CardDescription className="text-sm flex items-center gap-2 text-gray-600">
              <GraduationCap className="w-4 h-4" />
              <span className="font-medium">
                {application.program.institution ?? 'Institution to be confirmed'}
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getStatusBadge(application.status)}
            <Badge variant="outline" className="text-xs border-gray-200">
              #{programRanking} Ranked
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{locationText || 'Location to be confirmed'}</span>
          </div>
          {application.program.scholarship && (
            <Badge className="bg-purple-50 text-purple-700 border-purple-200 border">
              <Award className="w-3 h-3 mr-1" />
              Scholarship Available
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-600 rounded-md">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-base text-gray-900">Applicant Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <span className="text-xs text-gray-500 font-medium">Full Name</span>
              <p className="font-medium text-sm text-gray-900">
                {application.student.firstName} {application.student.lastName}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-gray-500 font-medium">Email</span>
              <p className="text-sm text-gray-900">{application.student.email}</p>
            </div>
            {application.student.phone && (
              <div className="space-y-0.5">
                <span className="text-xs text-gray-500 font-medium">Phone</span>
                <p className="text-sm text-gray-900">{application.student.phone}</p>
              </div>
            )}
            {application.student.nationality && (
              <div className="space-y-0.5">
                <span className="text-xs text-gray-500 font-medium">Nationality</span>
                <p className="text-sm text-gray-900 flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {application.student.nationality}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-600 mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Level</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">{application.program.level ?? 'N/A'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-600 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Intake</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">{intakeText}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-600 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Duration</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">{application.program.duration ?? 'N/A'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-600 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Tuition</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">{application.program.tuitionFee ?? 'N/A'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-600 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">App. Fee</span>
            </div>
            <p className="font-semibold text-sm text-gray-900">{application.program.applicationFee ?? 'N/A'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-600 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Deadline</span>
            </div>
            <p className="font-semibold text-xs text-gray-900">
              {application.program.applicationDeadline
                ? formatDate(application.program.applicationDeadline)
                : 'Not available'}
            </p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
          <p className="text-xs text-gray-600 font-medium mb-1">English Requirements</p>
          <p className="font-semibold text-sm text-gray-900">{application.program.englishTestScore ?? 'Not specified'}</p>
          {application.program.englishWaiver && (
            <Badge variant="outline" className="mt-2 text-xs border-gray-200">Waiver Available</Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-3">
          <span className="text-gray-600">Application submitted:</span>
          <span className="font-medium text-gray-900">{formatDate(submittedAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          onClick={() => handleStatusUpdate(ApplicationStatus.ACCEPTED)}
          disabled={application.status !== ApplicationStatus.SUBMITTED || updating}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          <Check className="w-4 h-4 mr-2" />
          Accept Application
        </Button>
        <Button
          onClick={() => handleStatusUpdate(ApplicationStatus.REJECTED)}
          disabled={application.status !== ApplicationStatus.SUBMITTED || updating}
          variant="destructive"
          className="flex-1 font-medium"
        >
          <X className="w-4 h-4 mr-2" />
          Reject Application
        </Button>
      </CardFooter>
    </Card>
  );
};