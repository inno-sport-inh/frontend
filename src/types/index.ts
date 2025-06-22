export interface Activity {
  id: number;
  time: string;
  activity: string;
  status: 'free' | 'booked';
  date?: string;
  currentParticipants?: number;
  maxParticipants?: number;
  dayOfWeek?: string;
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

export interface UserStats {
  fitnessTest: string;
  pushUps: string;
  crunches: string;
  tiltFingers: string;
  hours: string;
}