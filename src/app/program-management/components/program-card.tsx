"use client";

import React, { useState } from 'react';
import {
  MoreHorizontal,
  Trash2,
  Edit,
} from 'lucide-react';

import type { Program } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type Props = {
  program: Program;
  onEdit?: (p: Program) => void;
  onDelete?: (id: string) => Promise<void> | void;
};

export default function ProgramCard({ program, onEdit, onDelete }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const p = program;

  const institutionName = p.institution?.name || p.university || '—';
  const location = p.institution?.country || p.institution?.city || p.location || '—';
  const intake = p.intake?.name || p.intakeName || '—';
  const tuition = p.tuitionFee || p.tuition || '—';
  const duration = p.duration || '—';
  const level = p.level || '—';
  const subject = p.subject?.name || p.subjectName || '—';
  const ranking = p.institution?.ranking ? String(p.institution.ranking) : (p.ranking || '—');
  const appFee = p.applicationFee || '—';
  const status = p.status || 'AVAILABLE'; // Default to AVAILABLE if undefined as per request example style
  const englishTest = p.englishTestScore || '—';
  const ucas = p.ucasCode || '—';

  const formatDate = (dateUnparsed: string | undefined) => {
    if (!dateUnparsed) return '—';
    try {
      const d = new Date(dateUnparsed);
      if (isNaN(d.getTime())) return dateUnparsed;
      return d.toLocaleDateString();
    } catch {
      return dateUnparsed;
    }
  };

  const deadline = formatDate(p.applicationDeadline);


  return (
    <>
      <div className="group relative flex flex-col sm:flex-row gap-4 p-5 border border-transparent border-b-gray-100 hover:border-gray-200 hover:bg-gray-50/50 hover:shadow-sm transition-all rounded-lg bg-white">
        {/* Left: Image / Icon Placeholder */}
        <div className="shrink-0">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-900 rounded-md flex items-center justify-center text-white shadow-sm ring-1 ring-gray-900/5">
            <span className="font-bold text-xl uppercase tracking-widest">{institutionName.substring(0, 2)}</span>
          </div>
        </div>

        {/* Middle: Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header Row */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-edvios-green transition-colors">
                {p.title}
              </h3>
            </div>
            <div className="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-gray-700">{institutionName}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{location}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              {/* Subject */}
              <span className="text-gray-600">Subject: <span className="font-medium text-gray-800">{subject}</span></span>
              {p.scholarshipAvailable && (
                <Badge variant="outline" className="ml-2 border-edvios-green/20 text-edvios-green bg-edvios-green/5 text-[10px] uppercase font-bold tracking-wider h-5 px-1.5">
                  Scholarship
                </Badge>
              )}
            </div>
          </div>

          {/* Details Grid - Responsive 2 to 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-4 pt-1">

            {/* Tuple 1 */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Ranking</span>
              <span className="text-xs font-semibold text-gray-700">{ranking}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Tuition (1st year)</span>
              <span className="text-xs font-semibold text-gray-700">{tuition}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Duration</span>
              <span className="text-xs font-semibold text-gray-700">{duration}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">App Deadline</span>
              <span className="text-xs font-semibold text-gray-700">{deadline}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">App Fee</span>
              <span className="text-xs font-semibold text-gray-700">{appFee}</span>
            </div>

            {/* Row 2 on large screens */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Level</span>
              <span className="text-xs font-semibold text-gray-700">{level}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">English Test</span>
              <span className="text-xs font-semibold text-gray-700">{englishTest}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Intake</span>
              <span className="text-xs font-semibold text-gray-700">{intake}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">UCAS Code</span>
              <span className="text-xs font-semibold text-gray-700">{ucas}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Status</span>
              <span className="text-xs font-bold text-edvios-green">{status}</span>
            </div>

          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-start sm:justify-start gap-3 ml-0 sm:ml-4 pl-0 sm:pl-4 sm:border-l border-gray-100 min-w-[50px]">
          <div className="sm:hidden absolute top-4 right-4 z-10">
            <ProgramActions onEdit={() => onEdit?.(program)} onDelete={() => setShowDeleteDialog(true)} />
          </div>
          <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
            <ProgramActions onEdit={() => onEdit?.(program)} onDelete={() => setShowDeleteDialog(true)} />
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <span className="font-semibold text-gray-900"> {p.title} </span>
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete?.(p.id)}>
              Delete Program
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProgramActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Edit className="w-3.5 h-3.5 mr-2 text-gray-500" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
          <Trash2 className="w-3.5 h-3.5 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
