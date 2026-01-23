import { useCallback, useMemo, useState } from "react";
import {
  applicationsData,
  documentsData,
  enrolledProgramsData,
  interviewsData,
  statCardsData,
} from "../data/dashboard.data";

export function useStudentDashboard() {
  const [statCards, setStatCards] = useState(() => statCardsData);
  const [applications, setApplications] = useState(() => applicationsData);
  const [interviews, setInterviews] = useState(() => interviewsData);
  const [documents, setDocuments] = useState(() => documentsData);
  const [programs, setPrograms] = useState(() => enrolledProgramsData);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    // In a real app this would re-fetch from the API. For now re-assigns the data modules.
    setStatCards(statCardsData);
    setApplications(applicationsData);
    setInterviews(interviewsData);
    setDocuments(documentsData);
    setPrograms(enrolledProgramsData);
    setRefreshKey((k) => k + 1);
  }, []);

  return useMemo(
    () => ({ statCards, applications, interviews, documents, programs, refresh, refreshKey }),
    [statCards, applications, interviews, documents, programs, refresh, refreshKey],
  );
}
