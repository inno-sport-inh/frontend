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
        user_id: '1',
        user_statuses: ['student'],
        student_info: {
          id: 1,
          name: 'Mock Student',
          email: 'student@innopolis.university',
          medical_group: 'General',
          student_status: {
            id: 0,
            name: 'Normal',
            description: 'Everything is ok'
          },
          hours: 12,
          debt: 0,
          self_sport_hours: 0,
          required_hours: 30
        },
        // Обратная совместимость
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
   * Get student info from profile (handles both new and old API format)
   */
  getStudentInfo: (profile: StudentProfile) => {
    // Новый формат API
    if (profile.student_info) {
      return {
        id: profile.student_info.id.toString(),
        name: profile.student_info.name,
        email: profile.student_info.email,
        medical_group: profile.student_info.medical_group,
        hours: profile.student_info.hours,
        required_hours: profile.student_info.required_hours,
        self_sport_hours: profile.student_info.self_sport_hours,
        debt: profile.student_info.debt,
        student_status: profile.student_info.student_status
      };
    }
    
    // Старый формат API (обратная совместимость)
    return {
      id: profile.id || profile.user_id,
      name: profile.name || 'Unknown',
      email: profile.email || 'unknown@example.com',
      medical_group: profile.medical_group || 'General',
      hours: profile.hours || 0,
      required_hours: profile.required_hours || 30,
      self_sport_hours: profile.self_sport_hours || 0,
      debt: profile.debt || 0,
      student_status: {
        id: 0,
        name: 'Normal',
        description: 'Everything is ok'
      }
    };
  },

  /**
   * Check if user has specific status
   */
  hasUserStatus: (profile: StudentProfile, status: string): boolean => {
    return profile.user_statuses?.includes(status) || false;
  },

  /**
   * Check if user is superuser
   */
  isSuperuser: (profile: StudentProfile): boolean => {
    return studentService.hasUserStatus(profile, 'superuser');
  },

  /**
   * Check if user is staff
   */
  isStaff: (profile: StudentProfile): boolean => {
    return studentService.hasUserStatus(profile, 'staff');
  },

  /**
   * Check if user is trainer
   */
  isTrainer: (profile: StudentProfile): boolean => {
    return studentService.hasUserStatus(profile, 'trainer');
  },

  /**
   * Check if user is student
   */
  isStudent: (profile: StudentProfile): boolean => {
    return studentService.hasUserStatus(profile, 'student');
  },

  /**
   * Calculate progress information from student profile
   */
  calculateProgressFromProfile: (profile: StudentProfile) => {
    const studentInfo = studentService.getStudentInfo(profile);
    const completedHours = studentInfo.hours;
    const totalHours = studentInfo.required_hours;
    const progressPercentage = totalHours > 0 ? (completedHours / totalHours) * 100 : 0;
    
    return {
      completedHours,
      totalHours,
      progressPercentage,
      debt: studentInfo.debt,
      selfSportHours: studentInfo.self_sport_hours,
      isComplete: progressPercentage >= 100
    };
  },

  /**
   * Get student's hours information (legacy method for backwards compatibility)
   */
  getStudentHours: async (): Promise<StudentHours> => {
    try {
      const profile = await studentService.getProfile();
      const studentInfo = studentService.getStudentInfo(profile);
      const studentHours = await studentAPI.getStudentHours(studentInfo.id);
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
      const studentInfo = studentService.getStudentInfo(profile);
      const result = await studentAPI.getStudentPercentile(studentInfo.id);
      // API возвращает уже готовый процент (например 25.9)
      return result;
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
