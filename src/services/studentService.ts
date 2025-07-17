import { studentAPI } from './studentAPI';
import { StudentHours, StudentProfile } from './types';

// Student service for managing student-related data
export const studentService = {
  // Cache student profile to avoid multiple API calls
  _cachedProfile: null as StudentProfile | null,

  /**
   * Get current student profile
   */
  getProfile: async (): Promise<StudentProfile> => {
    if (studentService._cachedProfile) {
      return studentService._cachedProfile;
    }
    
    try {
      const profile = await studentAPI.getProfile();
      studentService._cachedProfile = profile;
      console.log('📊 Student profile received:', profile);
      return profile;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      // Return mock profile if API fails
      return {
        id: '1',
        name: 'Mock Student',
        email: 'student@innopolis.university',
        medical_group: 'General',
        hours: 12,
        required_hours: 30,
        self_sport_hours: 0,
        debt: 0,
        user_status: 'student'
      };
    }
  },

  /**
   * Calculate progress information from student profile
   */
  calculateProgressFromProfile: (profile: StudentProfile) => {
    const completedHours = profile.hours;
    const totalHours = profile.required_hours;
    const progressPercentage = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;
    
    return {
      completedHours,
      totalHours,
      progressPercentage,
      debt: profile.debt,
      selfSportHours: profile.self_sport_hours,
      isComplete: progressPercentage >= 100
    };
  },

  /**
   * Get student's hours information (legacy method for backwards compatibility)
   */
  getStudentHours: async (): Promise<StudentHours> => {
    try {
      const profile = await studentService.getProfile();
      const studentHours = await studentAPI.getStudentHours(profile.id);
      return studentHours;
    } catch (error) {
      console.error('Error fetching student hours:', error);
      // Return mock data if API fails
      return {
        last_semesters_hours: [],
        ongoing_semester: {
          id_sem: 1,
          hours_not_self: 12,
          hours_self_not_debt: 0,
          hours_self_debt: 0,
          hours_sem_max: 30,
          debt: 0
        }
      };
    }
  },

  /**
   * Get student's performance percentile
   */
  getStudentPercentile: async (): Promise<number> => {
    try {
      const profile = await studentService.getProfile();
      const result = await studentAPI.getStudentPercentile(profile.id);
      return 100 - result.percentile; // Convert "better than X%" to percentile
    } catch (error) {
      console.error('Error fetching student percentile:', error);
      return 85; // Mock percentile
    }
  },

  /**
   * Calculate progress information from student hours (legacy method)
   */
  calculateProgress: (studentHours: StudentHours) => {
    const ongoingSemester = studentHours.ongoing_semester;
    const completedHours = ongoingSemester.hours_not_self + ongoingSemester.hours_self_not_debt;
    const totalHours = ongoingSemester.hours_sem_max;
    const progressPercentage = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;
    
    return {
      completedHours,
      totalHours,
      progressPercentage,
      debt: ongoingSemester.debt,
      isComplete: progressPercentage >= 100
    };
  }
};
