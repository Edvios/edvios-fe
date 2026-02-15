'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  GraduationCap,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Mail,
} from 'lucide-react';
import { Application } from '@/app/applications/types/application.types';
import { ApplicationStatus } from '@/app/applications/enums/application.enum';

interface ApplicationCardProps {
  application: Application;
  onStatusUpdate: (id: string, status: ApplicationStatus) => Promise<void>;
}

const statusVariants: Record<ApplicationStatus, { className: string; label: string }> = {
  [ApplicationStatus.DRAFT]: {
    className: 'bg-gray-100 text-gray-500 border-gray-200',
    label: 'Draft',
  },
  [ApplicationStatus.SUBMITTED]: {
    className: 'bg-blue-50 text-blue-600 border-blue-100',
    label: 'Submitted',
  },
  [ApplicationStatus.UNDER_REVIEW]: {
    className: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    label: 'Under Review',
  },
  [ApplicationStatus.ACCEPTED]: {
    className: 'bg-edvios-green/10 text-edvios-green border-edvios-green/20',
    label: 'Accepted',
  },
  [ApplicationStatus.REJECTED]: {
    className: 'bg-red-50 text-red-600 border-red-100',
    label: 'Rejected',
  },
  [ApplicationStatus.WITHDRAWN]: {
    className: 'bg-gray-100 text-gray-400 border-gray-200',
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

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const parsed = new Date(dateString);
    if (Number.isNaN(parsed.getTime())) return 'N/A';
    return parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const submittedAt = application.appliedDate ?? application.createdAt ?? application.updatedAt ?? null;
  const programRanking = application.program.ranking ?? application.program.popularityRank ?? 'N/A';
  const locationText = [application.program.location, application.program.country]
    .filter(Boolean)
    .join(', ');
  const variant = statusVariants[application.status];

  return (
    <Card className="border border-gray-100 rounded-lg bg-white hover:border-gray-200 transition-colors duration-150 overflow-hidden">
      {/* Header: Program + Status */}
      <CardHeader className="p-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-900 leading-snug truncate">
              {application.program.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-edvios-green shrink-0" />
              <span className="truncate">{application.program.institution ?? 'Institution TBD'}</span>
            </p>
          </div>
          <Badge
            variant="outline"
            className={`${variant.className} font-semibold px-2.5 py-0.5 text-[10px] uppercase tracking-wider rounded-full shrink-0`}
          >
            {variant.label}
          </Badge>
        </div>
      </CardHeader>

      {/* Content: Flat list of details — no nested boxes */}
      <CardContent className="p-5 pt-4">
        {/* Applicant row */}
        <div className="flex items-center gap-4 text-xs text-gray-600 pb-3 border-b border-gray-50">
          <span className="font-semibold text-gray-900">
            {application.student.firstName} {application.student.lastName}
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <Mail className="w-3 h-3" />
            <span className="truncate max-w-[180px]">{application.student.email}</span>
          </span>
        </div>

        {/* Key metrics — flat inline grid, no cards-in-cards */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-3 pt-3 text-xs">
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Level</p>
            <p className="text-gray-900 font-semibold flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-edvios-green" />
              {application.program.level ?? 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Intake</p>
            <p className="text-gray-900 font-semibold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-edvios-green" />
              {application.preferredIntake?.name ?? 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Duration</p>
            <p className="text-gray-900 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-edvios-green" />
              {application.program.duration ?? 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Tuition</p>
            <p className="text-gray-900 font-semibold flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-edvios-green" />
              {application.program.tuitionFee ?? 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Location</p>
            <p className="text-gray-900 font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-edvios-green" />
              <span className="truncate">{locationText || 'N/A'}</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Ranking</p>
            <p className="text-gray-900 font-semibold flex items-center gap-1">
              <Award className="w-3 h-3 text-edvios-blue" />
              #{programRanking}
            </p>
          </div>
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-50 text-[10px] font-medium uppercase tracking-wider">
          <span className="text-gray-400">Submitted {formatDate(submittedAt)}</span>
          {application.program.scholarship && (
            <span className="text-edvios-green flex items-center gap-1">
              <Check className="w-3 h-3" />
              Scholarship
            </span>
          )}
        </div>
      </CardContent>

      {/* Actions */}
      {application.status === ApplicationStatus.SUBMITTED && (
        <CardFooter className="px-5 pb-4 pt-0 flex justify-end gap-2">
          <Button
            onClick={() => handleStatusUpdate(ApplicationStatus.ACCEPTED)}
            disabled={updating}
            size="sm"
            className="bg-edvios-green hover:bg-edvios-green/90 text-white font-semibold text-xs h-8 px-3 rounded-md"
          >
            <Check className="w-3.5 h-3.5 mr-1" />
            Accept
          </Button>
          <Button
            onClick={() => handleStatusUpdate(ApplicationStatus.REJECTED)}
            disabled={updating}
            size="sm"
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs h-8 px-3 rounded-md"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};