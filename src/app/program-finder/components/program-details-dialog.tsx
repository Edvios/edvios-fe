"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Calendar,
  Clock,
  Banknote,
  GraduationCap,
  CheckCircle2,
  Building2,
  BookOpen,
  LucideIcon,
} from "lucide-react";
import { Program } from "@/app/program-finder/types/program";

interface ProgramDetailsDialogProps {
  program: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyClick: (program: Program) => void;
}

export const ProgramDetailsDialog: React.FC<ProgramDetailsDialogProps> = ({
  program,
  open,
  onOpenChange,
  onApplyClick,
}) => {
  if (!program) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[99vw] max-w-450 h-[94vh] p-0 overflow-hidden flex flex-col rounded-2xl">
        
        <div className="px-5 sm:px-7 lg:px-8 pt-2 pb-2 bg-white">
          <DialogHeader className="space-y-1.5">

            {/* Title */}
            <DialogTitle className="text-base sm:text-lg lg:text-xl font-bold leading-snug wrap-break-word text-edvios-green!">
              {program.title}
            </DialogTitle>

            {/* Institution */}
            <DialogDescription className="text-sm text-gray-600 wrap-break-word">
              {program.institution}
            </DialogDescription>

            {program.scholarship && (
              <Badge className="w-fit bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 text-xs">
                Scholarship Available
              </Badge>
            )}

            {/* Location */}
            <div className="flex items-start gap-1.5 text-xs sm:text-sm text-gray-500">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="wrap-break-word">
                {program.location}, {program.country}
              </span>
            </div>

          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-5 sm:px-7 lg:px-8 py-3 bg-gray-50/70">
          <div className="space-y-6">

            {/* Key Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4 p-5 rounded-xl bg-white shadow-sm">
            <InfoItem icon={GraduationCap} label="Level" value={program.level} />
            <InfoItem icon={Calendar} label="Intake" value={program.intake || "TBA"} />
            <InfoItem icon={Clock} label="Duration" value={program.duration} />
            <InfoItem icon={Banknote} label="Tuition Fee" value={program.tuitionFee} />
            </div>


            {/* Overview */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold flex items-center gap-2 text-edvios-green">
                <BookOpen className="h-5 w-5 text-primary" />
                Program Overview
              </h3>

              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm space-y-2">
                <Detail label="Subject Area" value={program.subject || "N/A"} />
                <Detail label="Application Fee" value={program.applicationFee} />
                <Detail label="English Requirement" value={program.englishTestScore} />
                <Detail
                    label="Application Deadline"
                    value={new Date(program.applicationDeadline).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                    highlight
                    />
                <Detail
                  label="Campus Ranking"
                  value={program.ranking ? `#${program.ranking}` : "N/A"}
                />
                <Detail
                  label="English Waiver"
                  value={
                    program.englishWaiver ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Available
                      </span>
                    ) : (
                      "Not Available"
                    )
                  }
                />
              </div>
            </div>

            {/* About Institution */}
            <div className="bg-blue-50/80 p-5 rounded-xl flex gap-4 text-blue-900">
              <Building2 className="h-6 w-6 shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-semibold text-base sm:text-lg wrap-break-word text-edvios-green">
                  About {program.institution}
                </h4>
                <p className="leading-relaxed opacity-90 wrap-break-word">
                  One of the leading institutions in {program.country}, known for
                  excellence in {program.subject || "various disciplines"}. Located in{" "}
                  {program.location}.
                </p>
              </div>
            </div>

          </div>
        </ScrollArea>

        <div className="px-5 sm:px-7 lg:px-8 py-2.5 bg-white flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <Button
            className="px-10 bg-edvios-green text-white shadow-md hover:shadow-lg transition"
            onClick={() => onApplyClick(program)}
          >
            Apply Now
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};


const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="space-y-1 rounded-lg bg-gray-50 px-4 py-3 min-h-20">
    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
      {label}
    </p>
    <div className="flex items-start gap-2 min-w-0 font-medium text-sm sm:text-base leading-snug">
      <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <span className="min-w-0 wrap-break-word text-sm leading-snug">{value}</span>
    </div>
  </div>
);

const Detail = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) => (
  <div className="flex justify-between gap-4 py-2.5 rounded-md px-2">
    <span className="text-gray-500">{label}</span>
    <span className={`font-medium text-right ${highlight ? "text-red-600" : ""}`}>
      {value}
    </span>
  </div>
);
