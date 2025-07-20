import apiRequest from './api';
import { TrainingGradesResponse, MarkAttendanceRequest, MarkAttendanceResponse, StudentSearchResponse } from './types';

// Attendance API для работы с посещаемостью и оценками
export const attendanceAPI = {
  /**
   * Скачать CSV с оценками тренировки
   */
  downloadGradesCsv: async (trainingId: number): Promise<Blob> => {
    const response = await fetch(`/trainings/${trainingId}/grades.csv`, {
      method: 'GET'
    });
    return await response.blob();
  },
  /**
   * Получить оценки для тренировки
   * @param trainingId - ID тренировки
   */
  getTrainingGrades: async (trainingId: number): Promise<TrainingGradesResponse> => {
    console.log('📊 Getting training grades for training:', trainingId);
    const result = await apiRequest<TrainingGradesResponse>(`/trainings/${trainingId}/grades`);
    console.log('✅ Training grades received:', result);
    return result;
  },

  /**
   * Поиск студентов в группе
   * @param groupId - ID группы
   * @param term - Поисковый запрос
   */
  searchStudents: async (groupId: number, term: string): Promise<StudentSearchResponse> => {
    console.log('🔍 Searching students in group:', groupId, 'with term:', term);
    const params = new URLSearchParams({
      group_id: groupId.toString(),
      term,
    });
    const result = await apiRequest<StudentSearchResponse>(`/attendance/students/search?${params.toString()}`);
    console.log('✅ Students search result:', result);


    return result;
  },

  /**
   * Отметить посещаемость студентов
   * @param data - Данные о посещаемости
   */
  markAttendance: async (data: MarkAttendanceRequest): Promise<MarkAttendanceResponse[]> => {
    console.log('✅ Marking attendance:', data);
    const result = await apiRequest<MarkAttendanceResponse[]>('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('✅ Attendance marked successfully:', result);
    return result;
  },

  /**
   * Получить отчет о посещаемости группы
   * @param groupId - ID группы
   */
  getGroupAttendanceReport: async (groupId: number) => {
    console.log('📊 Getting attendance report for group:', groupId);
    const result = await apiRequest(`/attendance/${groupId}/report`);
    console.log('✅ Attendance report received:', result);
    return result;
  }
}; 