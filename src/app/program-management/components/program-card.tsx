"use client";

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import {
  Building,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';

import type { Program } from '../types';
import {
  Card,
  CardContent,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '../../../components/ui/alert-dialog';

type Props = {
  program: Program;
  onEdit?: (p: Program) => void;
  onDelete?: (id: string) => Promise<void> | void;
};

export default function ProgramCard({ program, onEdit, onDelete }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const p = program;
  const badges = p.badges || [];
  const tags = p.tags || [];

  // Helper to safely extract string from potential objects
  const toString = (val: unknown): string => {
    if (!val) return '—';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object' && val !== null) {
      return val.name || val.label || val.title || JSON.stringify(val);
    }
    return String(val);
  };

  // Extract values from nested objects
  const institutionName = p.institution?.name || p.university || p.institutionName || '—';
  const institutionCity = p.institution?.city || p.institutionCity || p.location || '—';
  const intakeName = p.intake?.name || p.intakeName || '—';
  const subjectName = p.subject?.name || p.subjectName || '—';
  const ranking = p.institution?.ranking ? String(p.institution.ranking) : (p.ranking || '—');

  const formatDate = (val?: string | null) => {
    if (!val) return '—';
    try {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toLocaleDateString();
    } catch {
      return val;
    }
    return val;
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setDeleting(true);
    try {
      await onDelete(p.id);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card
      className={cn(
        // base program card sizing
        'relative w-full md:max-w-[900px] transition-shadow overflow-hidden border-gray-200 min-w-0',
        // default is a bit shorter; institution style wants full height and stronger shadow
        showDetails ? 'hover:shadow-lg h-full flex flex-col' : 'hover:shadow-md h-auto flex flex-col'
      )}
    >
      {/* full-height left color stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-3 md:w-4 bg-gradient rounded-l-md" />

      <div className="flex flex-row min-w-0">
        <CardContent
          className={cn(
            // default compact padding for program list
            'flex-1 min-w-0 overflow-visible',
            showDetails ? 'p-4 md:p-5 lg:p-6 flex flex-col flex-1' : 'p-2 pl-6 md:pl-8'
          )}
        >
          <div className="flex flex-col">
            <h3 
              onClick={() => setShowDetails(s => !s)} 
              className="cursor-pointer font-bold text-lg md:text-xl text-gray-900 mb-1 line-clamp-2"
            >
              {p.title}
            </h3>

            {/* University & location under title */}
            <div className="mt-1">
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                <Building size={16} className="text-gray-500" />
                <div className="font-medium truncate max-w-full text-sm">
                  {institutionName}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  <div className="text-sm break-words">
                    {institutionCity}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <div className="text-sm break-words">
                    {intakeName}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3 max-w-full">
                {subjectName !== '—' && (
                  <Badge variant="secondary" className="border-0 bg-blue-100 text-blue-700 text-[9px] px-2 py-0.5">
                    Subject: {subjectName}
                  </Badge>
                )}
                {badges.slice(0, 4).map((badge, idx) => (
                  <Badge key={idx} variant="secondary" className="border-0 bg-green-100 text-green-700 text-[9px] px-2 py-0.5">
                    {toString(badge)}
                  </Badge>
                ))}
                {tags.slice(0, 4).map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="border-0 bg-orange-100 text-orange-800 text-[9px] px-2 py-0.5">
                    {toString(tag)}
                  </Badge>
                ))}
              </div>

              <div className="border-t border-gray-200 my-3" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <div className="text-gray-500">Ranking</div>
                  <div className="font-semibold text-sm text-gray-900">
                    {ranking}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">Tuition (1st year)</div>
                  <div className="font-medium text-sm break-words">
                    {toString(p.tuitionFee) || toString(p.tuition) || '—'}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">Application Deadline</div>
                  <div className="font-medium text-sm break-words">
                    {formatDate(p.applicationDeadline)}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">Application Fee</div>
                  <div className="font-medium text-sm break-words">
                    {toString(p.applicationFee)}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">Duration</div>
                  <div className="font-medium text-sm break-words">
                    {toString(p.duration)}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">Status</div>
                  <div className="mt-1">
                    <Badge variant="secondary" className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border-0 text-[11px]">
                      {toString(p.status) || toString(p.availability) || '—'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">English Test</div>
                  <div className="font-medium text-sm break-words">
                    {toString(p.englishTestScore)}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">Level</div>
                  <div className="font-medium text-sm break-words">
                    {toString(p.level) || toString(p.degree) || toString(p.category) || '—'}
                  </div>
                </div>

                <div>
                  <div className="text-gray-500">UCAS Code</div>
                  <div className="font-medium text-sm break-words">
                    {toString(p.ucasCode)}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </CardContent>
      </div>

      <div className="mt-auto border-t border-gray-200 pt-2 md:pt-3 px-3 md:px-4">
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              className="bg-gradient hover:opacity-90 text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
              onClick={() => onEdit?.(p)}
            >
              <div className="flex items-center gap-2">
                <Edit size={14} />
                <span>Edit</span>
              </div>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="h-7 md:h-8 px-2 md:px-3 flex items-center gap-2">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete program</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this program? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-gradient text-white"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <div className="flex items-center gap-2">
                      {deleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                      {deleting ? 'Deleting...' : 'Delete'}
                    </div>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {showDetails && p.raw && (
        <div className="px-6 pb-6 pt-2 text-sm text-gray-700 border-t">
          <div className="font-medium mb-2">Additional fields</div>
          <div className="grid gap-2">
            {Object.entries(p.raw)
              .filter(([k]) => !['id', 'title', 'university', 'location', 'ranking'].includes(k))
              .map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <div className="text-gray-500 w-40">{k}</div>
                  <div className="break-words">
                    {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Card>
  );
}
