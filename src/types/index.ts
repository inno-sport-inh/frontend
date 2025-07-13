export interface Activity {
  id: string;
  activity: string;
  time: string;
  dayOfWeek: string;
  date: Date;
  status: 'free' | 'booked' | 'past';
  maxParticipants: number;
  currentParticipants: number;
  isPast: boolean;
  isRegistrationOpen: boolean;
  groupId: number;
  trainingId: number;
}

export interface Club {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface MedicalReference {
  id: number;
  image_url: string;
  start: string;
  end: string;
  student_comment?: string;
  uploaded_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface UploadMedicalReferenceRequest {
  image: File;
  start: string;
  end: string;
  student_comment?: string;
}

export interface MeasurementUpload {
  student_id: number;
  measurement_id: number;
  value: number;
}

export interface UserStats {
  fitnessTest: string;
  pushUps: string;
  crunches: string;
  tiltFingers: string;
  hours: string;
}