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
  name,
  label,
  highlight = false,
}: {
  icon: React.ElementType;
  name: string;
  label: string;
  highlight?: boolean;
}) => (
  <div className="flex items-start gap-2 min-w-0">
    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
    <div className="min-w-0">
      <span className="block text-xs font-medium text-muted-foreground mb-0.5">
        {name}
      </span>
      <span
        className={`block truncate ${
          highlight ? "font-semibold text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
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
    <Card className="relative overflow-hidden w-full rounded-2xl bg-background hover:shadow-md transition-all duration-300 shadow-neutral-500">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-edvios-green" />

      <CardHeader className="pb-2 pt-4">
        <div className="space-y-2">
          <div className="min-w-0">
            <h3 className="text-base font-semibold !text-edvios-green truncate">
              {program.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate min-w-0">
              {program.institution}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              {program.scholarship && (
                <span className="inline-block rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800">
                  Scholarship
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground truncate min-w-0">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {program.location}, {program.country}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <InfoItem icon={GraduationCap} name="Level" label={program.level} />
          <InfoItem icon={Calendar} name="Intake" label={program.intake} />
          <InfoItem icon={Clock} name="Duration" label={program.duration} />
          <InfoItem
            icon={Banknote}
            name="Tuition Fee"
            label={program.tuitionFee}
            highlight
          />
        </div>

        <div className="mt-2 pt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
          <MetaItem label="English Score" value={program.englishTestScore} />
          <MetaItem
            label="Deadline"
            value={formattedDeadline}
          />
          <MetaItem label="Country" value={program.country} />
          <MetaItem label="Location" value={program.location} />
        </div>
      </CardContent>

      <CardFooter className="gap-2 flex flex-row pt-0 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="w-1/2"
          onClick={() => onDetailClick(program)}
        >
          View Details
        </Button>
        <Button
          size="sm"
          className="w-1/2 bg-edvios-green text-white shadow-sm hover:shadow-md transition"
          onClick={() => onApplyClick(program)}
        >
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};