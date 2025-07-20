// New Student Weekly Schedule API Types
export interface StudentStatus {
  id: number;
  name: string;
  description: string;
}

export interface StudentInfo {
  id: number;
  name: string;
  email: string;
  medical_group: string;
  student_status: StudentStatus;
  hours: number;
  debt: number;
  self_sport_hours: number;
  required_hours: number;
}

export interface TrainerInfo {
  id: number;
  name: string;
  email: string;
  groups: any[]; // Тип групп тренера будет уточнен позже
}

export interface StudentProfile {
  user_id: string;
  user_statuses: string[];
  student_info?: StudentInfo;
  trainer_info?: TrainerInfo;
  
  // Совместимость со старым API - для обратной совместимости
  id?: string;
  name?: string;
  email?: string;
  medical_group?: string;
  hours?: number;
  required_hours?: number;
  self_sport_hours?: number;
  debt?: number;
  user_status?: string;
}

export interface WeeklyScheduleTraining {
  id: number;
  start: string;
  end: string;
  group_id: number;
  group_name: string;
  training_class: string;
  group_accredited: boolean;
  can_grade: boolean;
  can_check_in: boolean;
  checked_in: boolean;
  capacity: number;
  available_spots: number;
  participants: {
    total_checked_in: number;
    students: Array<{
      id: number;
      name: string;
      email: string;
      medical_group: string;
      hours: number;
      attended: boolean;
    }>;
  };
}

export type WeeklyScheduleResponse = WeeklyScheduleTraining[];

// Legacy types (kept for backwards compatibility)
export interface CalendarTraining {
  title: string;
  start: string;
  end: string;
  extendedProps: {
    id: number;
    group_id: number;
    training_class: string;
    current_load: number;
    capacity: number;
  };
}

export interface StudentHours {
  last_semesters_hours: Array<{
    id_sem: number;
    hours_not_self: number;
    hours_self_not_debt: number;
    hours_self_debt: number;
    hours_sem_max: number;
    debt: number;
  }>;
  ongoing_semester: {
    id_sem: number;
    hours_not_self: number;
    hours_self_not_debt: number;
    hours_self_debt: number;
    hours_sem_max: number;
    debt: number;
  };
}

export interface BetterThanResponse {
  better_than: number;
}

export interface NegativeHoursResponse {
  final_hours: number;
}

export interface AnalyticsAttendanceResponse {
  [date: string]: number;
}

export interface AttendanceReportResponse {
  last_attended_dates: Array<{
    student_id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    last_attended: string;
  }>;
}

export interface TrainingGradesResponse {
  group_name: string;
  start: string;
  grades: Array<{
    student_id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    hours: number;
  }>;
  academic_duration: number;
}

export interface StudentSuggestion {
  value: string;
  label: string;
}

export interface StudentSearchResponse {
  students: Array<{
    student_id: number;
    first_name: string;
    last_name: string;
    email: string;
  }>;
}

export interface EnrollmentRequest {
  group_id: number;
}

export interface UnenrollByTrainerRequest {
  group_id: number;
  student_id: number;
}

export interface MarkAttendanceRequest {
  training_id: number;
  students_hours: Array<{
    student_id: number;
    hours: number;
  }>;
}

export interface MarkAttendanceResponse {
  email: string;
  hours: number;
}

export interface MarkAttendanceErrorResponse {
  code: number;
  description: string;
  negative_marks: Array<{
    email: string;
    hours: number;
  }>;
  overflow_marks: Array<{
    email: string;
    hours: number;
  }>;
}

export interface EnrollmentErrorResponse {
  code: number;
  detail: string;
}

export interface APIErrorResponse {
  detail: string;
}

// Medical Reference Types
export interface MedicalReference {
  id: number;
  image_url: string;
  start: string;
  end: string;
  student_comment?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface MedicalReferenceUpload {
  image: File;
  start: string;
  end: string;
  student_comment?: string;
}

export interface MedicalReferenceUploadResponse {
  message: string;
  reference_id: number;
  hours: number;
  start: string;
  end: string;
  uploaded: string;
}

export interface MedicalReferenceErrorResponse {
  code: number;
  detail: string;
}

// Self-Sport Types
export interface SelfSportUploadRequest {
  link: string;
  hours: number;
  training_type: number;
  student_comment?: string;
  parsed_data?: any;
}

export interface SelfSportUploadResponse {
  message?: string;
  // API возвращает пустое тело при успехе (200)
}

export interface SelfSportErrorResponse {
  code: number;
  detail: string;
}

export interface TrainingType {
  id: number;
  name: string;
  is_active: boolean;
  max_hours?: number;
}

// Fitness Test Types
export interface FitnessTestResult {
  semester: string;
  retake: boolean;
  grade: boolean;
  total_score: number;
  details: Array<{
    exercise: string;
    unit: string;
    value: number;
    score: number;
    max_score: number;
  }>;
}

// Semester Types
export interface Semester {
  id: number;
  name: string;
  start: string;
  end: string;
  hours: number;
}

// Student History Types
export interface StudentHistoryTraining {
  training_id: number;
  date: string;
  time: string;
  hours: number;
  group_name: string | null;
  sport_name: string;
  training_class: string;
  custom_name: string;
}

export interface StudentSemesterHistory {
  semester_id: number;
  semester_name: string;
  semester_start: string;
  semester_end: string;
  required_hours: number;
  total_hours: number;
  trainings: StudentHistoryTraining[];
}

export interface StudentHistoryResponse {
  trainings: StudentHistoryTraining[];
}

// Student Measurements Types
export interface MeasurementResult {
  id: number;
  measurement_name: string;
  value: number;
  unit: string;
  date: string;
  approved: boolean;
  notes?: string;
}

export interface StudentMeasurementResponse {
  student_id: number;
  student_name: string;
  result: MeasurementResult[];
}

export interface MeasurementUploadRequest {
  student_id: number;
  measurement_id: number;
  value: number;
  notes?: string;
}

export interface MeasurementUploadResponse {
  id: number;
  measurement_id: number;
  value: number;
  date: string;
  approved: boolean;
  notes?: string;
}
