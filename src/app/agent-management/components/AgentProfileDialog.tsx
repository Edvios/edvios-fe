'use client';

import React from 'react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Agent } from '../types/agent.types';
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Shield,
  Globe,
  Briefcase,
  LucideIcon,
} from 'lucide-react';

interface AgentProfileDialogProps {
  agent: Agent | null;
  open: boolean;
  onClose: () => void;
  onApprove?: (agentId: string) => void;
}

export const AgentProfileDialog: React.FC<AgentProfileDialogProps> = ({
  agent,
  open,
  onClose,
  onApprove,
}) => {
  if (!agent) return null;

  const fullName = `${agent.firstName} ${agent.lastName}`.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
          w-[95vw]
          max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          p-0
          border-none
          rounded-2xl
        "
      >
        <VisuallyHidden>
    <DialogTitle>Agent profile</DialogTitle>
    <DialogDescription>
      View detailed agent information and account status.
    </DialogDescription>
  </VisuallyHidden>
        {/* HEADER */}
        <div className="bg-gradient py-10 md:h-40 relative">
          <div
            className="
              relative
              md:absolute md:-bottom-14
              left-0 md:left-8
              w-full
              flex flex-col md:flex-row
              items-center md:items-end
              gap-4 md:gap-6
              px-4 md:px-0
              text-center md:text-left
            "
          >
            {/* Avatar */}
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white shadow-xl flex items-center justify-center text-primary font-bold text-2xl md:text-4xl border-4 border-white">
              {(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}
            </div>

            {/* Name */}
            <div className="md:mb-4">
              <p className="text-xl md:text-3xl font-bold text-black bg-white md:bg-transparent px-4 py-1 rounded-xl md:p-0 text-gray-900 md:text-white">
                {fullName}
              </p>

              <div className="flex flex-col md:flex-row items-center gap-2 mt-1">
                <Badge
                  className={
                    agent.role === 'AGENT'
                      ? 'bg-gradient text-white border-sm text-[10px]'
                      : 'bg-yellow-100 text-yellow-700 border-none text-[10px]'
                  }
                >
                  {agent.role === 'AGENT'
                    ? 'Approved Agent'
                    : 'Pending Approval'}
                </Badge>

                <span className="text-[10px] md:text-xs text-blue uppercase tracking-widest">
                  ID: {agent.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-4 md:p-10 pt-6 md:pt-24 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="space-y-8">
              <Section title="Basic Information" icon={User}>
                <InfoRow icon={Mail} label="Email" value={agent.email} />
                <InfoRow icon={Phone} label="Phone" value={agent.phone || 'Not provided'} />
                <InfoRow icon={Building2} label="Organization" value={agent.organization || 'Independent'} />
              </Section>

              <Section title="Location" icon={MapPin}>
                <InfoRow icon={Globe} label="Country" value={agent.country || 'Not specified'} />
                <InfoRow
                  icon={MapPin}
                  label="Address"
                  value={`${agent.city ? agent.city + ', ' : ''}${agent.address || 'Not specified'}`}
                />
              </Section>
            </div>

            {/* RIGHT */}
            <div className="space-y-8">
              <Section title="Account Details" icon={Shield}>
                <div className="bg-green-50/40 p-5 rounded-2xl border border-green-100 space-y-3 text-xs">
                  <Row label="Member Since" value={new Date(agent.createdAt).toLocaleDateString()} />
                  <Row label="Status" value={agent.role === 'AGENT' ? 'Verified' : 'In Review'} />
                  <Row label="Last Update" value={new Date(agent.updatedAt).toLocaleDateString()} />
                </div>
              </Section>

              <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-gray-300">
                    {agent.role === 'AGENT'
                      ? 'Full portal access enabled.'
                      : 'Access will be granted after approval.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="p-4 md:p-8 border-t bg-gray-50 flex flex-col-reverse sm:flex-row gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-11 rounded-xl">
            Close
          </Button>

          {agent.role === 'PENDING_AGENT' && onApprove && (
            <Button
              onClick={() => {
                onApprove(agent.id);
                onClose();
              }}
              className="w-full sm:w-auto h-11 rounded-xl bg-orange-600 hover:bg-orange-700 text-white"
            >
              Approve Agent
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ------------------ helpers ------------------ */

const Section = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) => (
  <div>
    <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-gray-500">
      <Icon className="w-3 h-3" />
      {title}
    </h4>
    <div className="space-y-4">{children}</div>
  </div>
);

const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center text-gray-400">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-700 break-words">
        {value}
      </p>
    </div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold text-gray-700">{value}</span>
  </div>
);
