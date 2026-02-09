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
      <DialogContent className="w-[95vw] max-w-[1400px] h-[90vh] p-0 overflow-hidden flex flex-col">
        
        <div className="px-6 sm:px-8 lg:px-10 pt-6 pb-4 border-b bg-white">
          <DialogHeader className="space-y-3">

            {/* Title */}
            <DialogTitle className="text-lg sm:text-2xl lg:text-3xl font-bold leading-snug break-words">
              {program.title}
            </DialogTitle>

            {/* Institution */}
            <DialogDescription className="text-sm sm:text-base lg:text-lg text-gray-600 break-words">
              {program.institution}
            </DialogDescription>

            {program.scholarship && (
              <Badge className="w-fit bg-yellow-100 text-yellow-800 border border-yellow-200 px-4 py-1.5 text-sm">
                Scholarship Available
              </Badge>
            )}

            {/* Location */}
            <div className="flex items-start gap-2 text-sm sm:text-base text-gray-500">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-words">
                {program.location}, {program.country}
              </span>
            </div>

          </DialogHeader>
        </div>

        <ScrollArea className="flex-1 px-6 sm:px-8 lg:px-10 py-6 bg-gray-50">
          <div className="space-y-8">

            {/* Key Info */}
            <div className="flex flex-col gap-4 p-5 rounded-xl border bg-white shadow-sm">
            <InfoItem icon={GraduationCap} label="Level" value={program.level} />
            <InfoItem icon={Calendar} label="Intake" value={program.intake || "TBA"} />
            <InfoItem icon={Clock} label="Duration" value={program.duration} />
            <InfoItem icon={Banknote} label="Tuition Fee" value={program.tuitionFee} />
            </div>


            {/* Overview */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Program Overview
              </h3>

              <div className="bg-white rounded-xl border px-5">
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
            <div className="bg-blue-50 p-5 rounded-xl flex gap-4 text-blue-900">
              <Building2 className="h-6 w-6 shrink-0 mt-1" />
              <div className="space-y-1">
                <h4 className="font-semibold text-base sm:text-lg break-words">
                  About {program.institution}
                </h4>
                <p className="leading-relaxed opacity-90 break-words">
                  One of the leading institutions in {program.country}, known for
                  excellence in {program.subject || "various disciplines"}. Located in{" "}
                  {program.location}.
                </p>
              </div>
            </div>

          </div>
        </ScrollArea>

        <div className="px-6 sm:px-8 lg:px-10 py-4 border-t bg-white flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          <Button
            className="px-10 bg-gradient text-white shadow-md hover:shadow-lg transition"
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
  <div className="space-y-1">
    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
      {label}
    </p>
    <div className="flex items-start gap-2 font-medium text-sm sm:text-base">
      <Icon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <span className="break-words">{value}</span>
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
  <div className="flex justify-between gap-4 py-3 border-b last:border-b-0">
    <span className="text-gray-500">{label}</span>
    <span className={`font-medium text-right ${highlight ? "text-red-600" : ""}`}>
      {value}
    </span>
  </div>
);
