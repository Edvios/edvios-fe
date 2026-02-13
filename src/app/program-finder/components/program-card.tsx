"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Clock,
  Banknote,
  GraduationCap,
} from "lucide-react";
import { Program } from "@/app/program-finder/types/program";

interface ProgramCardProps {
  program: Program;
  onDetailClick: (program: Program) => void;
  onApplyClick: (program: Program) => void;
}

const InfoItem = ({
  icon: Icon,
  label,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  highlight?: boolean;
}) => (
  <div className="flex items-center gap-2 min-w-0">
    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
    <span
      className={`truncate ${
        highlight ? "font-semibold text-foreground" : "text-muted-foreground"
      }`}
    >
      {label}
    </span>
  </div>
);

const MetaItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="min-w-0">
    <span className="block text-xs font-medium text-muted-foreground mb-1">
      {label}
    </span>
    <span className="block truncate text-sm text-foreground">
      {value}
    </span>
  </div>
);

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onDetailClick,
  onApplyClick,
}) => {
  // ── Date formatting ────────────────────────────────────────────────
  const formattedDeadline = program.applicationDeadline
    ? new Date(program.applicationDeadline).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "TBA";
  // ──────────────────────────────────────────────────────────────────

  return (
    <Card className="h-full flex flex-col rounded-2xl bg-background hover:shadow-xl transition-all duration-300 shadow-neutral-600">
      <CardHeader className="space-y-3 pb-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug line-clamp-3 break-words">
            {program.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {program.institution}
          </p>
        </div>

        {program.scholarship && (
          <div>
            <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
              Scholarship
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">
            {program.location}, {program.country}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <InfoItem icon={GraduationCap} label={program.level} />
          <InfoItem icon={Calendar} label={program.intake} />
          <InfoItem icon={Clock} label={program.duration} />
          <InfoItem
            icon={Banknote}
            label={program.tuitionFee}
            highlight
          />
        </div>

        <div className="mt-5 pt-4 border-t grid grid-cols-2 gap-4">
          <MetaItem label="English Score" value={program.englishTestScore} />
          <MetaItem
            label="Deadline"
            value={formattedDeadline}
          />
        </div>
      </CardContent>

      <CardFooter className="gap-3 flex flex-col sm:flex-row">
        <Button
          variant="outline"
          className="w-full sm:w-1/2"
          onClick={() => onDetailClick(program)}
        >
          View Details
        </Button>
        <Button
          className="w-full sm:w-1/2 bg-edvios-green text-white shadow-sm hover:shadow-md transition"
          onClick={() => onApplyClick(program)}
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};