import apiRequest from './api';
import {
  CalendarTraining,
  StudentHours,
  NegativeHoursResponse,
  AnalyticsAttendanceResponse,
  AttendanceReportResponse,
  TrainingGradesResponse,
  StudentSuggestion,
  UnenrollByTrainerRequest,
  MarkAttendanceRequest,
  MarkAttendanceResponse,
} from './types';

// Analytics API
export const analyticsAPI = {
  /**
   * Get attendance analytics data
   * @param medicalGroupId - Optional medical group ID filter
   * @param sportId - Optional sport ID filter
   */
  getAttendanceAnalytics: async (
    medicalGroupId?: number,
    sportId?: number
  ): Promise<AnalyticsAttendanceResponse> => {
    const params = new URLSearchParams();
    if (medicalGroupId) params.append('medical_group_id', medicalGroupId.toString());
    if (sportId) params.append('sport_id', sportId.toString());
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<AnalyticsAttendanceResponse>(`/analytics/attendance${query}`);
  },
};

// Attendance API
export const attendanceAPI = {
  /**
   * Get attendance report for a specific group
   * @param groupId - Group ID
   */
  getGroupAttendanceReport: async (groupId: number): Promise<AttendanceReportResponse> => {
    return apiRequest<AttendanceReportResponse>(`/attendance/${groupId}/report`);
  },

  /**
   * Get student's hours information
   * @param studentId - Student ID
   */
  getStudentHours: async (studentId: number): Promise<StudentHours> => {
    return apiRequest<StudentHours>(`/attendance/${studentId}/hours`);
  },

  /**
   * Get student's negative hours
   * @param studentId - Student ID
   */
  getStudentNegativeHours: async (studentId: number): Promise<NegativeHoursResponse> => {
    return apiRequest<NegativeHoursResponse>(`/attendance/${studentId}/negative_hours`);
  },

  /**
   * Get training grades
   * @param trainingId - Training ID
   */
  getTrainingGrades: async (trainingId: number): Promise<TrainingGradesResponse> => {
    return apiRequest<TrainingGradesResponse>(`/attendance/${trainingId}/grades`);
  },

  /**
   * Get training grades as CSV
   * @param trainingId - Training ID
   */
  getTrainingGradesCSV: async (trainingId: number): Promise<string> => {
    return apiRequest<string>(`/attendance/${trainingId}/grades.csv`, {
      headers: {
        'Accept': 'text/csv',
      },
    });
  },

  /**
   * Mark attendance for students
   * @param data - Attendance data
   */
  markAttendance: async (data: MarkAttendanceRequest): Promise<MarkAttendanceResponse[]> => {
    return apiRequest<MarkAttendanceResponse[]>('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Search for students in a group
   * @param groupId - Group ID
   * @param term - Search term
   */
  suggestStudents: async (groupId: number, term: string): Promise<StudentSuggestion[]> => {
    const params = new URLSearchParams({
      group_id: groupId.toString(),
      term,
    });
    return apiRequest<StudentSuggestion[]>(`/attendance/suggest_student?${params.toString()}`);
  },
};

// Calendar API
export const calendarAPI = {
  /**
   * Get training schedule for a specific sport
   * @param sportId - Sport ID
   * @param start - Start date
   * @param end - End date
   */
  getSportSchedule: async (
    sportId: string,
    start: Date,
    end: Date
  ): Promise<CalendarTraining> => {
    const params = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
    });
    return apiRequest<CalendarTraining>(`/calendar/${sportId}/schedule?${params.toString()}`);
  },

  /**
   * Get all training sessions
   * @param start - Start date
   * @param end - End date
   */
  getAllTrainings: async (start: Date, end: Date): Promise<CalendarTraining[]> => {
    const params = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
    });
    return apiRequest<CalendarTraining[]>(`/calendar/trainings?${params.toString()}`);
  },
};

// Enrollment API
export const enrollmentAPI = {
  /**
   * Enroll student in a group
   * @param groupId - Group ID
   */
  enrollInGroup: async (groupId: number): Promise<void> => {
    return apiRequest<void>('/enrollment/enroll', {
      method: 'POST',
      body: JSON.stringify({ group_id: groupId }),
    });
  },

  /**
   * Unenroll student from a group
   * @param groupId - Group ID
   */
  unenrollFromGroup: async (groupId: number): Promise<void> => {
    return apiRequest<void>('/enrollment/unenroll', {
      method: 'POST',
      body: JSON.stringify({ group_id: groupId }),
    });
  },

  /**
   * Unenroll student from a group (by trainer)
   * @param data - Unenrollment data
   */
  unenrollByTrainer: async (data: UnenrollByTrainerRequest): Promise<void> => {
    return apiRequest<void>('/enrollment/unenroll_by_trainer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
