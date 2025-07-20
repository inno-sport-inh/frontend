import apiRequest from './api';
import { WeeklyScheduleResponse, StudentProfile, StudentHours, FitnessTestResult, Semester, StudentHistoryTraining, StudentSemesterHistory, MeasurementUploadRequest, MeasurementUploadResponse, StudentMeasurementResponse, MedicalReferenceUploadResponse, SelfSportUploadResponse } from './types';

// Student API for new endpoints
export const studentAPI = {
  /**
   * Get current student profile information
   */
  getProfile: async (): Promise<StudentProfile> => {
    console.log('👤 Getting student profile...');
    const result = await apiRequest<StudentProfile>('/student/profile');
    console.log('✅ Student profile received:', result);
    return result;
  },

  /**
   * Get student hours information
   */
  getStudentHours: async (studentId: string): Promise<StudentHours> => {
    console.log('📊 Getting student hours for ID:', studentId);
    const result = await apiRequest<StudentHours>(`/attendance/${studentId}/hours`);
    console.log('✅ Student hours received:', result);
    return result;
  },

  /**
   * Get weekly schedule with participants information for each training
   * @param start - Start date
   * @param end - End date
   */
  getWeeklySchedule: async (start: Date, end: Date): Promise<WeeklyScheduleResponse> => {
    // Форматировать дату как YYYY-MM-DDTHH:mm:ss (локальное время)
    function toLocalISOString(date: Date, endOfDay = false) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      if (endOfDay) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T23:59:59`;
      }
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
    const params = new URLSearchParams({
      start: toLocalISOString(start),
      end: toLocalISOString(end, true),
    });
    const endpoint = `/student/weekly-schedule?${params.toString()}`;
    console.log('🔗 Making API call to:', endpoint);
    console.log('📅 Date parameters:', {
      start: toLocalISOString(start),
      end: toLocalISOString(end, true)
    });
    const result = await apiRequest<WeeklyScheduleResponse>(endpoint);
    console.log('✅ API call successful, received:', result.length, 'trainings');
    return result;
  },

  /**
   * Check in to a training
   * @param trainingId - Training ID
   */
  checkIn: async (trainingId: number): Promise<void> => {
    console.log('✅ Checking in to training:', trainingId);
    await apiRequest<void>(`/trainings/${trainingId}/check-in`, {
      method: 'POST',
    });
    console.log('✅ Successfully checked in to training:', trainingId);
  },

  /**
   * Cancel check-in from a training
   * @param trainingId - Training ID
   */
  cancelCheckIn: async (trainingId: number): Promise<void> => {
    console.log('❌ Canceling check-in from training:', trainingId);
    await apiRequest<void>(`/trainings/${trainingId}/cancel-check-in`, {
      method: 'POST',
    });
    console.log('✅ Successfully canceled check-in from training:', trainingId);
  },

  /**
   * Upload medical reference
   * @param image - The medical reference image file
   * @param startDate - Start date of illness period
   * @param endDate - End date of illness period
   * @param studentComment - Optional comment from student
   */
  uploadMedicalReference: async (
    image: File,
    startDate: string,
    endDate: string,
    studentComment?: string
  ): Promise<MedicalReferenceUploadResponse> => {
    console.log('📋 Uploading medical reference...');
    
    const formData = new FormData();
    formData.append('image', image);
    formData.append('start', startDate);
    formData.append('end', endDate);
    if (studentComment) {
      formData.append('student_comment', studentComment);
    }
    
    const result = await apiRequest<MedicalReferenceUploadResponse>('/references/upload', {
      method: 'POST',
      body: formData,
      // Не устанавливаем headers для FormData - браузер сам добавит multipart/form-data
    });
    
    console.log('✅ Medical reference uploaded successfully');
    return result;
  },

  /**
   * Get student measurements
   * @param studentId - Student ID
   */
  getStudentMeasurements: async (studentId: number): Promise<StudentMeasurementResponse> => {
    console.log('📏 Getting student measurements for ID:', studentId);
    const result = await apiRequest<StudentMeasurementResponse>(`/measurements/student/${studentId}`);
    console.log('✅ Student measurements received:', result);
    return result;
  },

  /**
   * Upload student measurement
   * @param studentId - Student ID
   * @param measurementId - Measurement ID
   * @param value - Measurement value
   */
  uploadMeasurement: async (
    studentId: number,
    measurementId: number,
    value: number
  ): Promise<MeasurementUploadResponse> => {
    console.log('📏 Uploading measurement...');
    
    const requestBody: MeasurementUploadRequest = {
      student_id: studentId,
      measurement_id: measurementId,
      value: value
    };
    
    const result = await apiRequest<MeasurementUploadResponse>('/measurements/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('✅ Measurement uploaded successfully:', result);
    return result;
  },

  /**
   * Get fitness test results
   */
  getFitnessTestResults: async (): Promise<FitnessTestResult[]> => {
    console.log('🏃 Getting fitness test results...');
    const result = await apiRequest<FitnessTestResult[]>('/fitness-test/result');
    console.log('✅ Fitness test results received:', result);
    return result;
  },

  /**
   * Get semester information
   * @param current - If true, get only current semester
   */
  getSemesters: async (current: boolean = false): Promise<Semester[]> => {
    const params = current ? '?current=true' : '';
    console.log('📅 Getting semesters...', current ? '(current only)' : '(all)');
    const result = await apiRequest<Semester[]>(`/semester${params}`);
    console.log('✅ Semesters received:', result);
    return result;
  },

  /**
   * Get student training history for a specific semester
   * @param semesterId - Semester ID
   */
  getStudentHistory: async (semesterId: number): Promise<StudentHistoryTraining[]> => {
    console.log('📚 Getting student history for semester:', semesterId);
    const result = await apiRequest<StudentHistoryTraining[]>(`/student/history/${semesterId}`);
    console.log('✅ Student history received:', result);
    return result;
  },

  /**
   * Get student semester history with trainings
   * Returns only semesters where student has attended trainings
   */
  getSemesterHistory: async (): Promise<StudentSemesterHistory[]> => {
    console.log('📚 Getting student semester history...');
    const result = await apiRequest<StudentSemesterHistory[]>('/student/semester-history');
    console.log('✅ Student semester history received:', result);
    
    // Filter out semesters with no trainings
    const semestersWithTrainings = result.filter(semester => semester.trainings && semester.trainings.length > 0);
    console.log('🔍 Filtered to semesters with trainings:', semestersWithTrainings.length, 'out of', result.length);
    
    return result;
  },

  /**
   * Get student performance percentile
   */
  getStudentPercentile: async (studentId: string): Promise<number> => {
    console.log('📈 Getting student percentile for ID:', studentId);
    const result = await apiRequest<number>(`/students/${studentId}/better-than`);
    console.log('✅ Student percentile received:', result);
    return result;
  },

  /**
   * Upload self-sport activity
   * @param link - Link to Strava, TrainingPeaks, or similar platform
   * @param hours - Number of hours
   * @param trainingType - Training type ID
   * @param studentComment - Optional comment from student
   * @param parsedData - Optional parsed data
   */
  uploadSelfSportActivity: async (
    link: string,
    hours: number,
    trainingType: number,
    studentComment?: string,
    parsedData?: any
  ): Promise<SelfSportUploadResponse> => {
    console.log('🏃 Uploading self-sport activity...');
    
    const formData = new FormData();
    formData.append('link', link);
    formData.append('hours', hours.toString());
    formData.append('training_type', trainingType.toString());
    if (studentComment) {
      formData.append('student_comment', studentComment);
    }
    if (parsedData) {
      formData.append('parsed_data', JSON.stringify(parsedData));
    }
    
    const result = await apiRequest<SelfSportUploadResponse>('/selfsport/upload', {
      method: 'POST',
      body: formData,
    });
    
    console.log('✅ Self-sport activity uploaded successfully');
    return result;
  }
};
