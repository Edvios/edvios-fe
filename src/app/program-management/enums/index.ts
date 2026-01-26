export enum Availability {
  Available = 'Available',
  Closed = 'Closed',
  Waitlist = 'Waitlist',
}

export enum ProgramStatus {
  AVAILABLE = 'AVAILABLE',
  DEADLINE_PASSED = 'DEADLINE_PASSED',
  FULL = 'FULL',
}

// ProgramStatus is kept as an enum to match the DB enum type when present.
// Use these enum values when the database expects an enum; the frontend
// can present these as choices and send one of these values to the backend.

export enum StudyLevel {
  BACHELORS = 'BACHELORS',
  MASTERS = 'MASTERS',
  PHD = 'PHD',
  DIPLOMA = 'DIPLOMA',
}
