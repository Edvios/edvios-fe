export interface StudentAssignment {
  id: string;
  studentId: string;
  agentId: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  agent?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentFilters {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface AssignmentResponse {
  assignments: StudentAssignment[];
  total: number;
  page: number;
  size: number;
}

export interface UpdateAssignmentRequest {
  agentId: string;
}
