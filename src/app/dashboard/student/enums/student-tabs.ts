export const StudentTab = {
  OVERVIEW: "overview",
  APPLICATIONS: "applications",
  INTERVIEWS: "interviews",
  DOCUMENTS: "documents",
  PROGRAMS: "programs",
} as const;

export type StudentTab = (typeof StudentTab)[keyof typeof StudentTab];

export const studentTabLabels: Record<StudentTab, string> = {
  [StudentTab.OVERVIEW]: "Overview",
  [StudentTab.APPLICATIONS]: "Applications",
  [StudentTab.INTERVIEWS]: "Interviews",
  [StudentTab.DOCUMENTS]: "Documents",
  [StudentTab.PROGRAMS]: "Programs",
};
