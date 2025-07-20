export interface FitnessTestSession {
  id: number;
  semester: { name: string } | string;
  date: string;
  teacher: string;
  retake: boolean;
}

export interface FitnessTestSessionDetails {
  session: FitnessTestSession & { semester: { name: string }; id: number; retake: boolean };
  exercises: Array<{
    id: number;
    name: string;
    unit?: string;
    select?: string[];
    tiltId?: number;
    designation_id?: number;
    unitId?: number;
  }>;
  results: Record<string, FitnessTestResult[]>;
}

export interface FitnessTestStudentSuggestion {
  value: string;
  label: string;
}

export interface FitnessTestResult {
  student: {
    user_id: string;
    name?: string;
    student_info?: { name?: string } | string;
  };
  value: string | number;
}
