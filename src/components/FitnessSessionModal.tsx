
import React from 'react';
import { FitnessTestSessionDetails, FitnessTestStudentSuggestion } from '../types/fitnessTest';
import { Dumbbell } from 'lucide-react';
import StudentSearch from './StudentSearch';
import StudentResultsForm from './StudentResultsForm';
import ResultsTable from './ResultsTable';
const FitnessSessionModal: React.FC<{
  selectedSession: FitnessTestSessionDetails;
  closeSession: () => void;
  studentQuery: string;
  setStudentQuery: (q: string) => void;
  studentOptions: FitnessTestStudentSuggestion[];
  studentSearchLoading: boolean;
  selectedStudent: FitnessTestStudentSuggestion | null;
  setSelectedStudent: (s: FitnessTestStudentSuggestion | null) => void;
  studentResults: Record<string, Record<number, string | number>>;
  handleResultChange: (studentId: string, exerciseId: number, value: string) => void;
  handleSubmitResults: (e: React.FormEvent) => void;
  submitStatus: 'idle' | 'success' | 'error' | 'loading';
  submitMessage: string;
  editing: { studentId: string; exerciseId: number } | null;
  editValue: string;
  setEditValue: (v: string) => void;
  editStatus: 'idle' | 'loading' | 'success' | 'error';
  handleEdit: (studentId: string, exerciseId: number, currentValue: string) => void;
  handleEditSave: (studentId: string, exerciseId: number) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
}> = ({
  selectedSession,
  closeSession,
  studentQuery,
  setStudentQuery,
  studentOptions,
  studentSearchLoading,
  selectedStudent,
  setSelectedStudent,
  studentResults,
  handleResultChange,
  handleSubmitResults,
  submitStatus,
  submitMessage,
  editing,
  editValue,
  setEditValue,
  editStatus,
  handleEdit,
  handleEditSave,
  editInputRef,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Модальный фон */}
      <div className="hidden sm:block fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSession} />
      <div className="block sm:hidden fixed inset-0 bg-pagebg" onClick={closeSession} />
      <div className="bg-pagebg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative z-10 rounded-3xl shadow-2xl border-2 border-secondary/30 transition-all duration-300 scale-100 innohassle-card p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center">
              <Dumbbell size={28} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-contrast bg-gradient-to-r from-brand-violet to-brand-violet/80 bg-clip-text text-transparent">{selectedSession.session.semester.name}</h2>
              <div className="text-xs text-inactive">{new Date(selectedSession.session.date).toLocaleString()} | Teacher: {selectedSession.session.teacher}</div>
            </div>
          </div>
          <button onClick={closeSession} className="w-10 h-10 flex items-center justify-center bg-secondary/50 hover:bg-secondary/80 rounded-xl transition-all duration-200 text-inactive hover:text-contrast">
            <span className="text-xl">×</span>
          </button>
        </div>
        {/* Поиск студента */}
        <StudentSearch
          studentQuery={studentQuery}
          setStudentQuery={setStudentQuery}
          studentOptions={studentOptions}
          studentSearchLoading={studentSearchLoading}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
        />

        {/* Ввод результатов */}
        {selectedStudent && (
          <StudentResultsForm
            selectedStudent={selectedStudent}
            selectedSession={selectedSession}
            studentResults={studentResults[selectedStudent.value.split('_')[0]] || {}}
            handleResultChange={(exerciseId, value) => handleResultChange(selectedStudent.value.split('_')[0], exerciseId, value)}
            handleSubmitResults={handleSubmitResults}
            submitStatus={submitStatus}
            submitMessage={submitMessage}
          />
        )}

        {/* Таблица результатов */}
        <ResultsTable
          selectedSession={selectedSession}
          editing={editing}
          editValue={editValue}
          setEditValue={setEditValue}
          editStatus={editStatus}
          handleEdit={handleEdit}
          handleEditSave={handleEditSave}
          editInputRef={editInputRef}
          selectedStudent={selectedStudent}
          studentResults={studentResults}
          handleResultChange={handleResultChange}
        />
      </div>
    </div>
  );
};

export default FitnessSessionModal;
