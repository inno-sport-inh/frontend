import React, { useEffect, useState, useRef } from 'react';
import { Dumbbell, Loader2,CheckCircle, XCircle } from 'lucide-react';
import { fitnessTestAPI, FitnessTestSession, FitnessTestSessionDetails, FitnessTestStudentSuggestion } from '../services/fitnessTestAPI';

const FitnessTestPage: React.FC = () => {
  const [sessions, setSessions] = useState<FitnessTestSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<FitnessTestSessionDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [studentQuery, setStudentQuery] = useState('');
  const [studentOptions, setStudentOptions] = useState<FitnessTestStudentSuggestion[]>([]);
  const [studentSearchLoading, setStudentSearchLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<FitnessTestStudentSuggestion | null>(null);
  const [studentResults, setStudentResults] = useState<Record<number, string | number>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [editing, setEditing] = useState<{studentId: string, exerciseId: number} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const editInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLoading(true);
    fitnessTestAPI.getSessions()
      .then(setSessions)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const openSession = (id: number) => {
    setDetailsLoading(true);
    fitnessTestAPI.getSessionDetails(id)
      .then(setSelectedSession)
      .catch(e => setError(e.message))
      .finally(() => setDetailsLoading(false));
  };

  const closeSession = () => setSelectedSession(null);

  // Динамический поиск студентов
  useEffect(() => {
    if (!studentQuery || !selectedSession) {
      setStudentOptions([]);
      return;
    }
    setStudentSearchLoading(true);
    const timeout = setTimeout(() => {
      fitnessTestAPI.searchStudents(studentQuery)
        .then(setStudentOptions)
        .catch(() => setStudentOptions([]))
        .finally(() => setStudentSearchLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [studentQuery, selectedSession]);

  // Сброс при закрытии модалки
  useEffect(() => {
    if (!selectedSession) {
      setStudentQuery('');
      setStudentOptions([]);
      setSelectedStudent(null);
      setStudentResults({});
    }
  }, [selectedSession]);

  // Обработка ввода результата
  const handleResultChange = (exerciseId: number, value: string) => {
    setStudentResults(prev => ({ ...prev, [exerciseId]: value }));
  };

  // Отправка результатов
  const handleSubmitResults = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !selectedStudent) return;
    setSubmitStatus('loading');
    setSubmitMessage('');
    try {
      // Получаем id студента из value (до первого _)
      const getStudentIdFromValue = (value: string) => value.split('_')[0];
      const studentId = getStudentIdFromValue(selectedStudent.value);
      // Проверяем наличие semester_id и session.id
      const sessionId = selectedSession.session?.id;

      // Формируем payload для API, добавляя designation_id (например, tilt id) если есть
      const results = Object.entries(studentResults).map(([exercise_id, value]) => {
        const exercise = selectedSession.exercises.find(ex => ex.id === Number(exercise_id));
        let resultValue: string = String(value);
        // Если это select, то value — текст, а бек ждет индекс (начиная с 1), но как строку
        if (exercise && Array.isArray(exercise.select)) {
          const idx = exercise.select.findIndex(opt => opt === value);
          if (idx !== -1) {
            resultValue = String(idx + 1); // индексация с 1, строкой
          }
        }
        const base = {
          student_id: studentId,
          exercise_id: Number(exercise_id),
          value: resultValue
        };
        if (exercise && ('tiltId' in exercise) && exercise.tiltId) {
          return { ...base, tilt_id: exercise.tiltId };
        }
        if (exercise && ('designation_id' in exercise) && exercise.designation_id) {
          return { ...base, designation_id: exercise.designation_id };
        }
        if (exercise && ('unitId' in exercise) && exercise.unitId) {
          return { ...base, unit_id: exercise.unitId };
        }
        return base;
      });
      const payload = {
        semester_id: sessionId,
        retake: selectedSession.session.retake,
        results
      };
      console.log('fitnessTestAPI.uploadResults payload:', payload);
      await fitnessTestAPI.uploadResults(sessionId, payload);
      setSubmitStatus('success');
      setSubmitMessage('Results submitted!');
      setStudentResults({});
      setSelectedStudent(null);
      setStudentQuery('');
      // Обновить детали сессии после отправки
      fitnessTestAPI.getSessionDetails(sessionId).then(setSelectedSession);
    } catch (e) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit results');
    } finally {
      setTimeout(() => setSubmitStatus('idle'), 2000);
    }
  };

  // Inline редактирование результата
  const handleEdit = (studentId: string, exerciseId: number, currentValue: string) => {
    setEditing({studentId, exerciseId});
    setEditValue(currentValue);
    setTimeout(() => editInputRef.current?.focus(), 100);
  };


  // Always extract numeric id if studentId is composite (e.g., "8425_Alex Alex_...")
  const getStudentIdFromValue = (value: string) => value.split('_')[0];
  const handleEditSave = async (studentId: string, exerciseId: number) => {
    if (!selectedSession) return;
    setEditStatus('loading');
    try {
      // If studentId is composite, extract id part
      const parsedStudentId = getStudentIdFromValue(studentId);
      await fitnessTestAPI.uploadResults(selectedSession.session.id, {
        semester_id: selectedSession.session.semester.id,
        retake: selectedSession.session.retake,
        results: [{
          student_id: parsedStudentId,
          exercise_id: exerciseId,
          value: String(editValue)
        }]
      });
      setEditStatus('success');
      setEditing(null);
      setEditValue('');
      // Обновить детали сессии после отправки
      fitnessTestAPI.getSessionDetails(selectedSession.session.id).then(setSelectedSession);
    } catch (e) {
      setEditStatus('error');
    } finally {
      setTimeout(() => setEditStatus('idle'), 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 mobile-content-bottom-padding">
      <div className="flex items-center gap-3 mb-8">
        <Dumbbell size={32} className="text-blue-500" />
        <h1 className="text-2xl sm:text-3xl font-bold text-contrast">Fitness Test Sessions</h1>
      </div>
      {error && <div className="innohassle-card p-4 bg-gradient-to-r from-error-500/10 to-error-500/5 border-2 border-error-500/30 animate-in slide-in-from-top duration-300 text-error-500">{error}</div>}
      {loading ? (
        <div className="flex items-center gap-2 text-inactive"><Loader2 className="animate-spin" /> Loading sessions...</div>
      ) : selectedSession ? (
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
            <div className="mb-6">
              <label className="block font-medium mb-1 text-contrast">Enter student name or email</label>
              <input
                type="text"
                className="w-full border-2 border-secondary/50 rounded-lg px-4 py-2 mb-1 focus:border-brand-violet outline-none transition-all"
                placeholder="Start typing..."
                value={studentQuery}
                onChange={e => {
                  setStudentQuery(e.target.value);
                  setSelectedStudent(null);
                }}
                autoComplete="off"
              />
              {studentSearchLoading && <div className="text-xs text-inactive">Searching...</div>}
              {studentOptions.length > 0 && !selectedStudent && (
                <ul className="border-2 border-secondary/50 rounded-lg bg-white shadow max-h-40 overflow-y-auto z-10 relative">
                  {studentOptions.map(option => (
                    <li
                      key={option.value}
                      className="px-4 py-2 hover:bg-brand-violet/10 cursor-pointer text-contrast"
                      onClick={() => {
                        setSelectedStudent(option);
                        setStudentQuery(option.label);
                      }}
                    >
                      {option.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ввод результатов */}
            {selectedStudent && (
              <div className="mb-6">
                <div className="font-semibold mb-2 text-contrast">Enter results for: <span className="text-brand-violet">{selectedStudent.label}</span></div>
                <form className="space-y-4" onSubmit={handleSubmitResults}>
                  {selectedSession.exercises.map(ex => (
                    <div key={ex.id} className="flex items-center gap-3">
                      <label className="w-32 font-medium text-inactive">{ex.name} <span className="text-xs text-contrast">({ex.unit})</span></label>
                      <input
                        type="text"
                        className="border-2 border-secondary/50 rounded-lg px-3 py-2 w-32 focus:border-brand-violet outline-none transition-all"
                        value={studentResults[ex.id] ?? ''}
                        onChange={e => handleResultChange(ex.id, e.target.value)}
                        placeholder="Result"
                        required
                      />
                    </div>
                  ))}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      type="submit"
                      className={`innohassle-button-primary px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 hover:scale-105 ${submitStatus === 'loading' ? 'opacity-60 cursor-not-allowed' : ''}`}
                      disabled={submitStatus === 'loading'}
                    >
                      {submitStatus === 'loading' ? 'Submitting...' : 'Submit Results'}
                    </button>
                    {submitStatus === 'success' && <span className="flex items-center text-success-500"><CheckCircle size={20} className="mr-1"/> {submitMessage}</span>}
                    {submitStatus === 'error' && <span className="flex items-center text-error-500"><XCircle size={20} className="mr-1"/> {submitMessage}</span>}
                  </div>
                </form>
              </div>
            )}

            {/* Таблица результатов */}
            <div className="innohassle-card p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/30 rounded-2xl mb-2 overflow-x-auto">
              <h3 className="font-semibold mb-4 text-contrast">Results</h3>
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-inactive font-semibold">Student</th>
                    {selectedSession.exercises.map(ex => (
                      <th key={ex.id} className="px-4 py-2 text-left text-inactive font-semibold">{ex.name}{ex.unit ? <span className="text-xs text-inactive"> ({ex.unit})</span> : ''}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Существующие результаты */}
                  {Object.values(selectedSession.results).flatMap(results => results).map((r, idx) => (
                    <tr key={r.student.user_id + '-' + idx} className="border-b border-secondary/20 hover:bg-brand-violet/5 transition-all">
                      <td className="px-4 py-2 font-medium text-contrast">{
                        r.student.student_info && typeof r.student.student_info === 'object' && 'name' in r.student.student_info
                          ? r.student.student_info.name
                          : r.student.student_info || r.student.name || r.student.user_id
                      }</td>
                      {selectedSession.exercises.map(ex => {
                        const value = (selectedSession.results[ex.name]?.find(res => res.student.user_id === r.student.user_id)?.value ?? '');
                        const isEditing = editing && editing.studentId === r.student.user_id && editing.exerciseId === ex.id;
                        return (
                          <td key={ex.id} className="px-4 py-2">
                            {isEditing ? (
                              ex.select ? (
                                <select
                                  ref={editInputRef as any}
                                  className="border-2 border-brand-violet rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                >
                                  <option value="">Choose...</option>
                                  {ex.select.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                              ) : (
                                <input
                                  ref={editInputRef}
                                  type="text"
                                  className="border-2 border-brand-violet rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                />
                              )
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="font-mono bg-secondary/30 rounded px-2 py-0.5">{value || <span className="text-inactive">—</span>}</span>
                                <button
                                  className="innohassle-button-secondary px-2 py-1 rounded text-xs"
                                  onClick={() => handleEdit(r.student.user_id, ex.id, String(value))}
                                >Edit</button>
                              </div>
                            )}
                            {isEditing && (
                              <button
                                className="innohassle-button-primary ml-2 px-3 py-1 rounded text-xs"
                                onClick={() => handleEditSave(r.student.user_id, ex.id)}
                                disabled={editStatus === 'loading'}
                              >Save</button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Строка для добавления нового студента */}
                  {selectedStudent && (
                    <tr className="bg-brand-violet/10">
                      <td className="px-4 py-2 font-medium text-brand-violet">{selectedStudent.label}</td>
                      {selectedSession.exercises.map(ex => (
                        <td key={ex.id} className="px-4 py-2">
                          {ex.select ? (
                            <select
                              className="border-2 border-brand-violet rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                              value={String(studentResults[ex.id] ?? '')}
                              onChange={e => handleResultChange(ex.id, e.target.value)}
                            >
                              <option value="">Choose...</option>
                              {ex.select.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="border-2 border-brand-violet rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                              value={String(studentResults[ex.id] ?? '')}
                              onChange={e => handleResultChange(ex.id, e.target.value)}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="innohassle-card p-6 bg-gradient-to-br from-brand-violet/5 via-transparent to-brand-violet/10 border-2 border-brand-violet/20 hover:border-brand-violet/30 transition-all duration-300 shadow-lg shadow-brand-violet/5">
          <h2 className="text-lg font-semibold mb-4 text-contrast">All Fitness Test Sessions</h2>
          {sessions.length === 0 && <div className="text-inactive">No sessions found.</div>}
          <ul className="divide-y">
            {sessions.map(session => (
              <li key={session.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-contrast">
                    {typeof session.semester === 'object' && session.semester !== null && 'name' in session.semester
                      ? `${session.semester.name} — ${new Date(session.date).toLocaleDateString()}`
                      : `${session.semester || 'Unknown Semester'} — ${new Date(session.date).toLocaleDateString()}`}
                  </div>
                  <div className="text-xs text-inactive">Teacher: {session.teacher} | Retake: {session.retake ? 'Yes' : 'No'}</div>
                </div>
                <button onClick={() => openSession(session.id)} className="innohassle-button-secondary px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105">View</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FitnessTestPage; 