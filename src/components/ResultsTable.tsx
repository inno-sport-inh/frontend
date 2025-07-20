import React from 'react';

interface ResultsTableProps {
  selectedSession: any;
  editing: { studentId: string; exerciseId: number } | null;
  editValue: string;
  setEditValue: (v: string) => void;
  editStatus: 'idle' | 'loading' | 'success' | 'error';
  handleEdit: (studentId: string, exerciseId: number, currentValue: string) => void;
  handleEditSave: (studentId: string, exerciseId: number) => void;
  editInputRef: React.RefObject<HTMLInputElement>;
  selectedStudent: any;
  studentResults: Record<string, Record<number, string | number>>;
  handleResultChange: (studentId: string, exerciseId: number, value: string) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  selectedSession,
  editing,
  editValue,
  setEditValue,
  editStatus,
  handleEdit,
  handleEditSave,
  editInputRef,
  selectedStudent,
  studentResults,
  handleResultChange,
}) => (
  <div className="innohassle-card p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/30 rounded-2xl mb-2 overflow-x-auto">
    <h3 className="font-semibold mb-4 text-contrast">Results</h3>
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-inactive font-semibold">Student</th>
          {selectedSession.exercises.map((ex: any) => (
            <th key={ex.id} className="px-4 py-2 text-left text-inactive font-semibold">
              {ex.name}
              {ex.unit ? <span className="text-xs text-inactive"> ({ex.unit})</span> : ''}
              {ex.name.toLowerCase().includes('tilt') && (
                <span className="ml-2 text-xs text-brand-violet">(no touch → palms)</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Существующие результаты */}
        {/* Собираем список всех студентов из результатов и из списка упражнений (если потребуется) */}
        {(() => {
          // Собрать всех студентов из результатов
          const students: any[] = [];
          let selectedStudentId = selectedStudent ? selectedStudent.value.split('_')[0] : null;
          Object.entries(selectedSession.results || {}).forEach(([studentId, resultObj]: any) => {
            let student = resultObj.student || (Array.isArray(resultObj) && resultObj[0]?.student);
            if (student) students.push({ studentId, student, resultObj });
          });
          // Если выбранный студент не найден среди существующих — добавить строку для него
          const hasSelected = selectedStudentId && students.some(s => String(s.student.student_id || s.student.user_id) === selectedStudentId);
          return <>
            {students.map(({ studentId, student, resultObj }, idx) => {
              // Универсально получить массив результатов
              let exerciseResults: any[] = [];
              if (Array.isArray(resultObj)) {
                exerciseResults = resultObj;
              } else if (Array.isArray(resultObj.exercise_results)) {
                exerciseResults = resultObj.exercise_results;
              }
              return (
                <tr key={student.user_id + '-' + idx} className="border-b border-secondary/20 hover:bg-brand-violet/5 transition-all">
                  <td className="px-4 py-2 font-medium text-contrast">{
                    student?.student_info?.name || student?.name || studentId
                  }</td>
                  {selectedSession.exercises.map((ex: any) => {
                    const isEditing = editing && editing.studentId === student.user_id && editing.exerciseId === ex.id;
                    // Показывать локальные значения, если они есть
                    let value;
                    if (studentResults && studentResults[studentId] && studentResults[studentId][ex.id] !== undefined) {
                      value = studentResults[studentId][ex.id];
                    } else {
                      const found = exerciseResults.find(er => er.exercise_id === ex.id);
                      value = found ? found.value : '';
                    }
                    // For tilt, use ex.select from backend for mapping
                    let displayValue = value;
                    if (ex.name.toLowerCase().includes('tilt') && Array.isArray(ex.select)) {
                      if (typeof value === 'string' && isNaN(Number(value))) {
                        displayValue = value;
                      } else if (value !== undefined && value !== null && value !== '') {
                        const idx = Number(value);
                        displayValue = ex.select[idx] !== undefined ? ex.select[idx] : value;
                      }
                    }
                    return (
                      <td key={ex.id} className="px-4 py-2">
                        {isEditing ? (
                          ex.name.toLowerCase().includes('tilt') && Array.isArray(ex.select) ? (
                            <select
                              ref={editInputRef as any}
                              className="border-2 border-brand-violet rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                            >
                              <option value="">Choose...</option>
                              {ex.select.map((label: string, idx: number) => (
                                <option key={idx} value={idx}>{label}</option>
                              ))}
                            </select>
                          ) : ex.select ? (
                            <select
                              ref={editInputRef as any}
                              className="border-2 border-brand-violet rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                            >
                              <option value="">Choose...</option>
                              {ex.select.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
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
                            <span className="font-mono bg-secondary/30 rounded px-2 py-0.5">{ex.name.toLowerCase().includes('tilt') && Array.isArray(ex.select) ? displayValue : (value !== undefined && value !== null && value !== '' ? value : <span className="text-inactive">—</span>)}</span>
                            <button
                              className="innohassle-button-secondary px-2 py-1 rounded text-xs"
                            onClick={() => handleEdit(student.user_id, ex.id, String(value))}
                            >Edit</button>
                          </div>
                        )}
                        {isEditing && (
                          <button
                            className="innohassle-button-primary ml-2 px-3 py-1 rounded text-xs"
                            onClick={() => handleEditSave(student.user_id, ex.id)}
                            disabled={editStatus === 'loading'}
                          >Save</button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* Строка для добавления нового студента, если его нет среди существующих */}
            {!hasSelected && selectedStudent && (
              <tr className="bg-brand-violet/10">
                <td className="px-4 py-2 font-medium text-brand-violet">{selectedStudent.label}</td>
                {selectedSession.exercises.map((ex: any) => (
                  <td key={ex.id} className="px-4 py-2">
                    {ex.name.toLowerCase().includes('tilt') && Array.isArray(ex.select) ? (
                      <select
                        className="border-2 border-brand-violet rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                        value={String((studentResults[selectedStudentId]?.[ex.id]) ?? '')}
                        onChange={e => handleResultChange(selectedStudentId, ex.id, e.target.value)}
                      >
                        <option value="">Choose...</option>
                        {ex.select.map((label: string, idx: number) => (
                          <option key={idx} value={idx}>{label}</option>
                        ))}
                      </select>
                    ) : ex.select ? (
                      <select
                        className="border-2 border-brand-violet rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                        value={String((studentResults[selectedStudentId]?.[ex.id]) ?? '')}
                        onChange={e => handleResultChange(selectedStudentId, ex.id, e.target.value)}
                      >
                        <option value="">Choose...</option>
                        {ex.select.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="border-2 border-brand-violet rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-brand-violet transition-all"
                        value={String((studentResults[selectedStudentId]?.[ex.id]) ?? '')}
                        onChange={e => handleResultChange(selectedStudentId, ex.id, e.target.value)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            )}
          </>;
        })()}
      </tbody>
    </table>
  </div>
);

export default ResultsTable;
