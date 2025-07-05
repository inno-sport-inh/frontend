/**
 * Utility functions for managing training sessions and IDs
 */

/**
 * Generates a consistent session ID for both ClubPage and SchedulePage
 * @param activity - The activity name
 * @param day - The day of the week
 * @param time - The time slot
 * @param date - The date of the session
 * @returns A unique session ID
 */
export const generateSessionId = (
  activity: string,
  day: string,
  time: string,
  date: Date
): string => {
  // Create a consistent format that can be used by both pages
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format
  return `${activity.toLowerCase().replace(/\s+/g, '-')}-${day.toLowerCase()}-${time.replace(/[:\s-]/g, '')}-${dateStr}`;
};

/**
 * Parses a session ID back to its components
 * @param sessionId - The session ID to parse
 * @returns The parsed components or null if invalid
 */
export const parseSessionId = (sessionId: string): {
  activity: string;
  day: string;
  time: string;
  date: string;
} | null => {
  const parts = sessionId.split('-');
  if (parts.length < 4) return null;
  
  const date = parts[parts.length - 1];
  const time = parts[parts.length - 2];
  const day = parts[parts.length - 3];
  const activity = parts.slice(0, parts.length - 3).join('-');
  
  return {
    activity: activity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    day: day.charAt(0).toUpperCase() + day.slice(1),
    time: time.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1:$2 - $3:$4'),
    date
  };
};

/**
 * Checks if a session date is in the past
 * @param sessionDate - The session date
 * @param sessionTime - The session time (e.g., "09:00 - 10:30")
 * @returns True if the session is in the past
 */
export const isSessionInPast = (sessionDate: Date, sessionTime: string): boolean => {
  const [, endTimeStr] = sessionTime.split(' - ');
  const [endHour, endMinute] = endTimeStr.split(':').map(Number);
  
  const sessionEndTime = new Date(sessionDate);
  sessionEndTime.setHours(endHour, endMinute, 0, 0);
  
  return sessionEndTime < new Date();
};

/**
 * Checks if registration is open for a session
 * @param sessionDate - The session date
 * @param sessionTime - The session time (e.g., "09:00 - 10:30")
 * @returns True if registration is open
 */
export const isRegistrationOpen = (sessionDate: Date, sessionTime: string): boolean => {
  const [startTimeStr] = sessionTime.split(' - ');
  const [startHour, startMinute] = startTimeStr.split(':').map(Number);
  
  const sessionStartTime = new Date(sessionDate);
  sessionStartTime.setHours(startHour, startMinute, 0, 0);
  
  // Registration opens exactly 1 week before session starts
  const registrationOpenTime = new Date(sessionStartTime);
  registrationOpenTime.setDate(registrationOpenTime.getDate() - 7);
  
  return new Date() >= registrationOpenTime;
};

/**
 * Gets the day of week number (0 = Sunday, 1 = Monday, etc.)
 * @param day - The day name (e.g., "Monday")
 * @returns The day number
 */
export const getDayOfWeek = (day: string): number => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.indexOf(day);
};

/**
 * Formats a session date for display
 * @param date - The session date
 * @returns Formatted date string
 */
export const formatSessionDate = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  
  if (isToday) return 'Today';
  if (isTomorrow) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};
