'use client';

import React from 'react';
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

interface ConfirmAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  currentAgentName?: string;
  newAgentName: string;
  onConfirm: () => void;
  loading?: boolean;
}

export const ConfirmAssignmentDialog: React.FC<ConfirmAssignmentDialogProps> = ({
  open,
  onOpenChange,
  studentName,
  currentAgentName,
  newAgentName,
  onConfirm,
  loading = false,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Agent Assignment</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to assign <strong>{newAgentName}</strong> to{' '}
              <strong>{studentName}</strong>?
            </p>
            {currentAgentName && (
              <p className="text-sm text-muted-foreground">
                Current agent: <strong>{currentAgentName}</strong> will be replaced.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className="bg-edvios-green text-white hover:opacity-90"
          >
            {loading ? 'Assigning...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
