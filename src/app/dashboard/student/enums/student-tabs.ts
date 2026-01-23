export const StudentTab = {
  Overview: "overview",
  Applications: "applications",
  Interviews: "interviews",
  Documents: "documents",
  Programs: "programs",
} as const;

export type StudentTab = (typeof StudentTab)[keyof typeof StudentTab];

export const studentTabLabels: Record<StudentTab, string> = {
  [StudentTab.Overview]: "Overview",
  [StudentTab.Applications]: "Applications",
  [StudentTab.Interviews]: "Interviews",
  [StudentTab.Documents]: "Documents",
  [StudentTab.Programs]: "Programs",
};
