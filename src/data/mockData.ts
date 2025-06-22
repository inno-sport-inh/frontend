import { Activity, Club, FAQ, UserStats } from '../types';

// Mock data with weekly schedule and participant limits
export const mockWeeklyActivities: Activity[] = [
  // Monday
  { id: 1, time: "9:00 - 10:30", activity: "Table Tennis", status: "booked" as const, dayOfWeek: "Monday", currentParticipants: 8, maxParticipants: 8 },
  { id: 2, time: "14:00 - 15:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Monday", currentParticipants: 3, maxParticipants: 8 },
  { id: 3, time: "19:00 - 20:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Monday", currentParticipants: 6, maxParticipants: 8 },
  
  // Tuesday
  { id: 4, time: "9:00 - 10:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Tuesday", currentParticipants: 2, maxParticipants: 8 },
  { id: 5, time: "16:00 - 17:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Tuesday", currentParticipants: 8, maxParticipants: 8 },
  { id: 6, time: "21:00 - 22:30", activity: "Table Tennis", status: "booked" as const, dayOfWeek: "Tuesday", currentParticipants: 5, maxParticipants: 8 },
  
  // Wednesday  
  { id: 7, time: "10:00 - 11:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Wednesday", currentParticipants: 1, maxParticipants: 8 },
  { id: 8, time: "15:00 - 16:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Wednesday", currentParticipants: 4, maxParticipants: 8 },
  { id: 9, time: "20:00 - 21:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Wednesday", currentParticipants: 7, maxParticipants: 8 },
  
  // Thursday
  { id: 10, time: "9:00 - 10:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Thursday", currentParticipants: 0, maxParticipants: 8 },
  { id: 11, time: "17:00 - 18:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Thursday", currentParticipants: 3, maxParticipants: 8 },
  { id: 12, time: "21:00 - 22:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Thursday", currentParticipants: 6, maxParticipants: 8 },
  
  // Friday
  { id: 13, time: "11:00 - 12:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Friday", currentParticipants: 2, maxParticipants: 8 },
  { id: 14, time: "16:00 - 17:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Friday", currentParticipants: 5, maxParticipants: 8 },
  { id: 15, time: "19:00 - 20:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Friday", currentParticipants: 8, maxParticipants: 8 },
  
  // Saturday
  { id: 16, time: "10:00 - 11:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Saturday", currentParticipants: 1, maxParticipants: 6 },
  { id: 17, time: "14:00 - 15:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Saturday", currentParticipants: 4, maxParticipants: 6 },
  { id: 18, time: "18:00 - 19:30", activity: "Table Tennis", status: "booked" as const, dayOfWeek: "Saturday", currentParticipants: 3, maxParticipants: 6 },
  
  // Sunday
  { id: 19, time: "11:00 - 12:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Sunday", currentParticipants: 0, maxParticipants: 6 },
  { id: 20, time: "15:00 - 16:30", activity: "Table Tennis", status: "free" as const, dayOfWeek: "Sunday", currentParticipants: 2, maxParticipants: 6 },
];

export const mockWeeklyActivities2: Activity[] = [
  // Monday
  {
    id: 15,
    activity: 'CrossFit',
    time: '08:00 - 09:00',
    dayOfWeek: 'Monday',
    status: 'free',
    maxParticipants: 10,
    currentParticipants: 4,
  },
  {
    id: 16,
    activity: 'Swimming',
    time: '13:00 - 14:00',
    dayOfWeek: 'Monday',
    status: 'free',
    maxParticipants: 12,
    currentParticipants: 9,
  },
  {
    id: 17,
    activity: 'Basketball',
    time: '19:00 - 20:30',
    dayOfWeek: 'Monday',
    status: 'free',
    maxParticipants: 8,
    currentParticipants: 6,
  },

  // Tuesday
  {
    id: 18,
    activity: 'Badminton',
    time: '10:00 - 11:30',
    dayOfWeek: 'Tuesday',
    status: 'free',
    maxParticipants: 6,
    currentParticipants: 3,
  },
  {
    id: 19,
    activity: 'Strength Training',
    time: '16:30 - 18:00',
    dayOfWeek: 'Tuesday',
    status: 'free',
    maxParticipants: 8,
    currentParticipants: 5,
  },

  // Wednesday
  {
    id: 20,
    activity: 'Table Tennis',
    time: '14:00 - 15:30',
    dayOfWeek: 'Wednesday',
    status: 'free',
    maxParticipants: 8,
    currentParticipants: 8,
  },
  {
    id: 21,
    activity: 'Rock Climbing',
    time: '17:00 - 19:00',
    dayOfWeek: 'Wednesday',
    status: 'free',
    maxParticipants: 6,
    currentParticipants: 2,
  },

  // Thursday
  {
    id: 22,
    activity: 'Football',
    time: '15:30 - 17:00',
    dayOfWeek: 'Thursday',
    status: 'free',
    maxParticipants: 22,
    currentParticipants: 16,
  },
  {
    id: 23,
    activity: 'Martial Arts',
    time: '18:30 - 20:00',
    dayOfWeek: 'Thursday',
    status: 'free',
    maxParticipants: 12,
    currentParticipants: 7,
  },

  // Friday
  {
    id: 24,
    activity: 'Aqua Aerobics',
    time: '11:00 - 12:00',
    dayOfWeek: 'Friday',
    status: 'free',
    maxParticipants: 15,
    currentParticipants: 11,
  },
  {
    id: 25,
    activity: 'Cycling',
    time: '16:00 - 17:30',
    dayOfWeek: 'Friday',
    status: 'free',
    maxParticipants: 12,
    currentParticipants: 8,
  },

  // Saturday
  {
    id: 26,
    activity: 'Tennis Tournament',
    time: '09:00 - 12:00',
    dayOfWeek: 'Saturday',
    status: 'free',
    maxParticipants: 16,
    currentParticipants: 12,
  },
  {
    id: 27,
    activity: 'Beach Volleyball',
    time: '15:00 - 16:30',
    dayOfWeek: 'Saturday',
    status: 'free',
    maxParticipants: 8,
    currentParticipants: 4,
  },

  // Sunday
  {
    id: 28,
    activity: 'Running Club',
    time: '08:00 - 09:30',
    dayOfWeek: 'Sunday',
    status: 'free',
    maxParticipants: 20,
    currentParticipants: 13,
  },
  {
    id: 29,
    activity: 'Stretching & Recovery',
    time: '18:00 - 19:00',
    dayOfWeek: 'Sunday',
    status: 'free',
    maxParticipants: 10,
    currentParticipants: 6,
  },
];

export const mockClubs: Club[] = [
  { 
    id: 1, 
    name: "Table Tennis", 
    description: "Join our table tennis club for exciting matches and skill development. All levels welcome!", 
    image: "/placeholder-table-tennis.jpg" 
  },
  { 
    id: 2, 
    name: "Football", 
    description: "Experience the thrill of football with our dedicated team. Regular training sessions and matches.", 
    image: "/placeholder-football.jpg" 
  },
  { 
    id: 3, 
    name: "Basketball", 
    description: "Shoot hoops and improve your game with our basketball club. Team practice twice a week.", 
    image: "/placeholder-basketball.jpg" 
  },
  { 
    id: 4, 
    name: "Volleyball", 
    description: "Spike, set, and serve with our volleyball team. Indoor and beach volleyball available.", 
    image: "/placeholder-volleyball.jpg" 
  },
];

export const mockFAQ: FAQ[] = [
  { 
    id: 1, 
    question: "How can I change the chosen sport?", 
    answer: "Please contact the admin through the support section or visit the sports office during working hours." 
  },
  { 
    id: 2, 
    question: "How to get sport hours?", 
    answer: "Attend training sessions regularly. Each session counts towards your sport hours requirement." 
  },
  { 
    id: 3, 
    question: "Can I cancel my booking?", 
    answer: "Yes, you can cancel your booking up to 2 hours before the scheduled time." 
  },
  { 
    id: 4, 
    question: "What should I bring to training?", 
    answer: "Bring comfortable sportswear, appropriate footwear, and a water bottle. Equipment is provided by the club." 
  },
  { 
    id: 5, 
    question: "Are there any membership fees?", 
    answer: "No, all sports activities are free for students. Just bring your student ID." 
  },
];

export const mockUserStats: UserStats = {
  fitnessTest: "Passed",
  pushUps: "50/50",
  crunches: "35/35",
  tiltFingers: "10/30",
  hours: "30/30"
};

export const mockActivities: Activity[] = [
  {
    id: 1,
    activity: 'Basketball',
    time: '10:00 - 11:30',
    dayOfWeek: 'Monday',
    status: 'free',
    maxParticipants: 8,
    currentParticipants: 3,
  },
  {
    id: 2,
    activity: 'Swimming',
    time: '14:00 - 15:00',
    dayOfWeek: 'Monday',
    status: 'booked',
    maxParticipants: 12,
    currentParticipants: 8,
  },
  {
    id: 3,
    activity: 'Yoga',
    time: '18:00 - 19:00',
    dayOfWeek: 'Monday',
    status: 'free',
    maxParticipants: 15,
    currentParticipants: 12,
  },

  // Tuesday
  {
    id: 4,
    activity: 'Tennis',
    time: '09:00 - 10:30',
    dayOfWeek: 'Tuesday',
    status: 'free',
    maxParticipants: 4,
    currentParticipants: 2,
  },
  {
    id: 5,
    activity: 'Gym Training',
    time: '17:00 - 18:30',
    dayOfWeek: 'Tuesday',
    status: 'free',
    maxParticipants: 10,
    currentParticipants: 6,
  },

  // Wednesday
  {
    id: 6,
    activity: 'Football',
    time: '16:00 - 17:30',
    dayOfWeek: 'Wednesday',
    status: 'booked',
    maxParticipants: 22,
    currentParticipants: 18,
  },
  {
    id: 7,
    activity: 'Pilates',
    time: '19:00 - 20:00',
    dayOfWeek: 'Wednesday',
    status: 'free',
    maxParticipants: 12,
    currentParticipants: 8,
  },

  // Thursday
  {
    id: 8,
    activity: 'Volleyball',
    time: '15:00 - 16:30',
    dayOfWeek: 'Thursday',
    status: 'free',
    maxParticipants: 12,
    currentParticipants: 12,
  },
  {
    id: 9,
    activity: 'Boxing',
    time: '18:00 - 19:30',
    dayOfWeek: 'Thursday',
    status: 'free',
    maxParticipants: 8,
    currentParticipants: 4,
  },

  // Friday
  {
    id: 10,
    activity: 'Swimming',
    time: '12:00 - 13:00',
    dayOfWeek: 'Friday',
    status: 'free',
    maxParticipants: 12,
    currentParticipants: 7,
  },
  {
    id: 11,
    activity: 'Dance',
    time: '17:30 - 18:30',
    dayOfWeek: 'Friday',
    status: 'free',
    maxParticipants: 20,
    currentParticipants: 15,
  },

  // Saturday
  {
    id: 12,
    activity: 'Basketball',
    time: '10:00 - 11:30',
    dayOfWeek: 'Saturday',
    status: 'free',
    maxParticipants: 8,
    currentParticipants: 5,
  },
  {
    id: 13,
    activity: 'Hiking',
    time: '14:00 - 17:00',
    dayOfWeek: 'Saturday',
    status: 'free',
    maxParticipants: 25,
    currentParticipants: 12,
  },

  // Sunday
  {
    id: 14,
    activity: 'Yoga',
    time: '11:00 - 12:00',
    dayOfWeek: 'Sunday',
    status: 'free',
    maxParticipants: 15,
    currentParticipants: 8,
  },
];