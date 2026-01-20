import {
  applicationSchema,
  documentSchema,
  enrolledProgramSchema,
  interviewSchema,
  statCardSchema,
} from "../dtos/dashboard.dto";
import { Application, DocumentItem, EnrolledProgram, Interview, StatCard } from "../types/dashboard.types";

export const statCardsData: StatCard[] = statCardSchema.array().parse([
  {
    key: "applications",
    label: "Applications",
    value: "18",
    change: "+12.5%",
    changeLabel: "vs last month",
    direction: "up",
    accent: "blue",
  },
  {
    key: "accepted",
    label: "Accepted",
    value: "6",
    change: "+8.3%",
    changeLabel: "from total",
    direction: "up",
    accent: "emerald",
  },
  {
    key: "interviews",
    label: "Interviews",
    value: "4",
    change: "+2 scheduled",
    changeLabel: "this week",
    direction: "up",
    accent: "purple",
  },
  {
    key: "documents",
    label: "Documents",
    value: "26",
    change: "-2 awaiting",
    changeLabel: "verification",
    direction: "down",
    accent: "amber",
  },
  {
    key: "programs",
    label: "Enrolled Programs",
    value: "2",
    change: "+1 confirmed",
    changeLabel: "for Fall 2026",
    direction: "up",
    accent: "indigo",
  },
]);

export const applicationsData: Application[] = applicationSchema.array().parse([
  {
    id: "APP-1021",
    school: "Harvard University",
    program: "MBA",
    status: "Under Review",
    stage: "Documents verified",
    date: "Jan 12, 2026",
    nextStep: "Await interview invite",
  },
  {
    id: "APP-0944",
    school: "Stanford University",
    program: "MS Computer Science",
    status: "Accepted",
    stage: "Offer sent",
    date: "Jan 08, 2026",
    nextStep: "Review enrollment kit",
  },
  {
    id: "APP-0881",
    school: "MIT",
    program: "MEng Robotics",
    status: "Interview Scheduled",
    stage: "Faculty panel",
    date: "Jan 04, 2026",
    nextStep: "Confirm availability",
  },
  {
    id: "APP-0790",
    school: "Yale University",
    program: "BA Economics",
    status: "Documents Pending",
    stage: "Financial docs",
    date: "Dec 28, 2025",
    nextStep: "Upload bank statement",
  },
]);

export const interviewsData: Interview[] = interviewSchema.array().parse([
  {
    id: "INT-301",
    school: "MIT",
    date: "Jan 24, 2026",
    timezone: "10:00 AM EST",
    contact: "Julia Smith",
    status: "Confirmed",
  },
  {
    id: "INT-287",
    school: "Harvard University",
    date: "Jan 26, 2026",
    timezone: "02:30 PM EST",
    contact: "Admissions Team",
    status: "Pending Prep",
  },
  {
    id: "INT-275",
    school: "Stanford University",
    date: "Jan 29, 2026",
    timezone: "09:00 AM PST",
    contact: "Alex Turner",
    status: "Confirmed",
  },
]);

export const documentsData: DocumentItem[] = documentSchema.array().parse([
  {
    id: "DOC-16",
    title: "Passport Scan",
    status: "Approved",
    updatedAt: "Jan 12, 2026",
  },
  {
    id: "DOC-15",
    title: "Transcripts",
    status: "Under Review",
    updatedAt: "Jan 10, 2026",
  },
  {
    id: "DOC-14",
    title: "Financial Statement",
    status: "Awaiting Upload",
    updatedAt: "Jan 08, 2026",
  },
  {
    id: "DOC-13",
    title: "Recommendation Letters",
    status: "Approved",
    updatedAt: "Jan 05, 2026",
  },
]);

export const enrolledProgramsData: EnrolledProgram[] = enrolledProgramSchema.array().parse([
  {
    id: "PRG-02",
    school: "Stanford University",
    program: "MS Computer Science",
    term: "Fall 2026",
    startDate: "Sep 05, 2026",
  },
  {
    id: "PRG-01",
    school: "Harvard University",
    program: "MBA",
    term: "Fall 2026",
    startDate: "Aug 28, 2026",
  },
]);
