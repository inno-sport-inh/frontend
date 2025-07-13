import apiRequest from './api';
import { WeeklyScheduleResponse, StudentProfile, StudentHours, FitnessTestResult, Semester, StudentHistoryTraining, StudentSemesterHistory, MeasurementUploadRequest, MeasurementUploadResponse, StudentMeasurementResponse } from './types';

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
   * Get student performance percentile
   */
  getStudentPercentile: async (studentId: string): Promise<{ percentile: number }> => {
    console.log('📈 Getting student percentile for ID:', studentId);
    const result = await apiRequest<{ percentile: number }>(`/attendance/${studentId}/better_than`);
    console.log('✅ Student percentile received:', result);
    return result;
  },

  /**
   * Get weekly schedule with participants information for each training
   * @param start - Start date
   * @param end - End date
   */
  getWeeklySchedule: async (start: Date, end: Date): Promise<WeeklyScheduleResponse> => {
    const params = new URLSearchParams({
      start: start.toISOString(),
      end: end.toISOString(),
    });
    
    const endpoint = `/student/weekly-schedule?${params.toString()}`;
    console.log('🔗 Making API call to:', endpoint);
    console.log('📅 Date parameters:', {
      start: start.toISOString(),
      end: end.toISOString()
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
  ): Promise<void> => {
    console.log('📋 Uploading medical reference...');
    
    const formData = new FormData();
    formData.append('image', image);
    formData.append('start', startDate);
    formData.append('end', endDate);
    if (studentComment) {
      formData.append('student_comment', studentComment);
    }
    
    await apiRequest<void>('/references/upload', {
      method: 'POST',
      body: formData,
      headers: {
        // Не добавляем Content-Type, браузер сам установит для multipart/form-data
      },
    });
    
    console.log('✅ Medical reference uploaded successfully');
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
    
    return semestersWithTrainings;
  }
};
