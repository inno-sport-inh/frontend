import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Calendar, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { studentAPI } from '../services/studentAPI';
import { FitnessTestResult, StudentHistoryTraining, StudentSemesterHistory } from '../services/types';
import SemesterDetailsModal from '../components/SemesterDetailsModal';

const HistoryPage: React.FC = () => {
  const [fitnessTests, setFitnessTests] = useState<FitnessTestResult[]>([]);
  const [semesterHistory, setSemesterHistory] = useState<StudentSemesterHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [selectedSemester, setSelectedSemester] = useState<StudentSemesterHistory | null>(null);
  const [modalTrainings, setModalTrainings] = useState<StudentHistoryTraining[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [fitnessData, semesterHistoryData] = await Promise.all([
        studentAPI.getFitnessTestResults(),
        studentAPI.getSemesterHistory()
      ]);
      
      setFitnessTests(fitnessData);
      setSemesterHistory(semesterHistoryData);
    } catch (err) {
      console.error('Error loading history data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSemesterClick = async (semester: StudentSemesterHistory) => {
    try {
      setSelectedSemester(semester);
      setModalLoading(true);
      
      // Use trainings from semester history data directly
      setModalTrainings(semester.trainings);
    } catch (err) {
      console.error('Error loading semester details:', err);
      setModalTrainings([]);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedSemester(null);
    setModalTrainings([]);
  };

  const getPassedFitnessTests = () => fitnessTests.filter(test => test.grade).length;
  const getTotalHours = () => semesterHistory.reduce((sum: number, semester: StudentSemesterHistory) => sum + semester.total_hours, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="innohassle-card p-6 bg-gradient-to-br from-floating to-primary/20 border-2 border-secondary/30">
          <div className="text-center">
            <div className="p-4 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-2xl w-fit mx-auto mb-4">
              <Loader2 className="animate-spin text-brand-violet" size={32} />
            </div>
            <p className="text-inactive">Loading your training history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="innohassle-card p-6 text-center bg-gradient-to-br from-floating to-primary/20 border-2 border-red-500/30">
          <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-2xl w-fit mx-auto mb-4">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <p className="text-red-500 mb-4">Error loading data: {error}</p>
          <button 
            onClick={loadData}
            className="px-6 py-3 bg-gradient-to-r from-brand-violet to-brand-violet/80 text-white rounded-xl hover:from-brand-violet/80 hover:to-brand-violet/60 transition-all duration-300 font-medium shadow-lg hover:shadow-brand-violet/25"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden innohassle-card p-4 sm:p-6 bg-gradient-to-br from-brand-violet/5 via-transparent to-brand-violet/10 border-2 border-brand-violet/20 hover:border-brand-violet/30 transition-all duration-300 shadow-lg shadow-brand-violet/5">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-contrast">Training History</h1>
          <p className="text-inactive mt-2">Your training progress and achievements</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-brand-violet/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-violet/10 to-transparent rounded-full blur-xl"></div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Hours */}
        <div className="group innohassle-card p-4 bg-gradient-to-br from-floating to-primary/30 border-2 border-secondary/30 hover:border-brand-violet/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-violet/10 hover:-translate-y-1 transform">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-xl border border-brand-violet/20">
              <Clock className="text-brand-violet" size={24} />
            </div>
            <div>
              <div className="text-sm text-inactive">Total Hours</div>
              <div className="text-2xl font-bold text-brand-violet">{getTotalHours()}</div>
            </div>
          </div>
        </div>

        {/* Fitness Tests Passed */}
        <div className="group innohassle-card p-4 bg-gradient-to-br from-floating to-primary/30 border-2 border-secondary/30 hover:border-success-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-success-500/10 hover:-translate-y-1 transform">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-success-500/20 to-success-500/10 rounded-xl border border-success-500/20">
              <Trophy className="text-success-500" size={24} />
            </div>
            <div>
              <div className="text-sm text-inactive">Fitness Tests Passed</div>
              <div className="text-2xl font-bold text-success-500">{getPassedFitnessTests()}</div>
            </div>
          </div>
        </div>

        {/* Semesters */}
        <div className="group innohassle-card p-6 bg-gradient-to-br from-floating to-primary/30 border-2 border-secondary/30 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transform">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl border border-blue-500/20">
              <Calendar className="text-blue-500" size={24} />
            </div>
            <div>
              <div className="text-sm text-inactive">Active Semesters</div>
              <div className="text-2xl font-bold text-blue-500">{semesterHistory.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Tests History */}
      {fitnessTests.length > 0 && (
        <div className="group innohassle-card p-4 bg-gradient-to-br from-floating to-primary/20 border-2 border-secondary/30 hover:border-success-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-success-500/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-success-500/20 to-success-500/10 rounded-xl border border-success-500/20">
              <Trophy className="text-success-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-contrast">Fitness Tests</h2>
              <p className="text-inactive">Your fitness test results and exercise progress</p>
            </div>
          </div>
          <div className="space-y-4">
            {fitnessTests.map((test, index) => (
              <div key={index} className="bg-gradient-to-r from-primary/50 to-secondary/30 border-2 border-secondary/50 rounded-2xl p-4 hover:border-success-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-contrast">{test.semester}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        test.grade 
                          ? 'bg-gradient-to-r from-success-500/20 to-success-500/10 text-success-500 border-success-500/30' 
                          : 'bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-500 border-red-500/30'
                      }`}>
                        {test.grade ? 'Passed' : 'Failed'}
                      </span>
                      {test.retake && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-500 border border-orange-500/30">
                          Retake
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-contrast">{test.total_score}</div>
                    <div className="text-sm text-inactive">Total Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {test.details.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="bg-gradient-to-br from-primary/30 to-secondary/20 border border-secondary/50 rounded-xl p-4 hover:border-brand-violet/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-contrast font-medium">{exercise.exercise}</div>
                        <div className="text-sm text-brand-violet font-medium bg-brand-violet/10 px-2 py-1 rounded-lg">
                          {exercise.score}/{exercise.max_score}
                        </div>
                      </div>
                      <div className="text-sm text-inactive mb-3">
                        {exercise.value} {exercise.unit}
                      </div>
                      <div className="w-full bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-2xl h-3 shadow-inner border border-secondary/50 relative overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-brand-violet to-brand-violet/80 h-full rounded-2xl transition-all duration-500 shadow-lg"
                          style={{ width: `${(exercise.score / exercise.max_score) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Semesters */}
      <div className="group innohassle-card p-4 bg-gradient-to-br from-floating to-primary/20 border-2 border-secondary/30 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl border border-blue-500/20">
            <Calendar className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-contrast">Academic History</h2>
            <p className="text-inactive">View detailed history by semester</p>
          </div>
        </div>
        <div className="space-y-4">
          {semesterHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gradient-to-br from-inactive/10 to-inactive/5 rounded-2xl w-fit mx-auto mb-4">
                <Calendar className="text-inactive" size={48} />
              </div>
              <h3 className="text-lg font-semibold text-contrast mb-2">No Training History</h3>
              <p className="text-inactive">
                You haven't attended any training sessions yet. 
                Check the Schedule page to find and enroll in available trainings.
              </p>
            </div>
          ) : (
            semesterHistory.map((semester) => (
              <button
                key={semester.semester_id}
                onClick={() => handleSemesterClick(semester)}
                className="w-full bg-gradient-to-r from-primary/50 to-secondary/30 border-2 border-secondary/50 rounded-2xl p-4 hover:border-blue-500/50 hover:from-blue-500/5 hover:to-blue-500/10 transition-all duration-300 text-left group hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl border border-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300">
                      <Calendar className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <div className="text-contrast font-semibold">{semester.semester_name}</div>
                      <div className="text-inactive text-sm">
                        {new Date(semester.semester_start).toLocaleDateString()} - {new Date(semester.semester_end).toLocaleDateString()}
                      </div>
                      <div className="text-inactive text-xs mt-1">
                        {semester.trainings.length} training{semester.trainings.length !== 1 ? 's' : ''} attended
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-contrast font-semibold">{semester.total_hours} hours</div>
                      <div className="text-inactive text-sm">
                        of {semester.required_hours} required
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-lg border ${
                        semester.total_hours >= semester.required_hours 
                          ? 'bg-gradient-to-r from-success-500/20 to-success-500/10 text-success-500 border-success-500/30' 
                          : semester.total_hours > 0 
                            ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/10 text-orange-500 border-orange-500/30' 
                            : 'bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-500 border-red-500/30'
                      }`}>
                        {semester.total_hours >= semester.required_hours 
                          ? 'Completed' 
                          : `${semester.required_hours - semester.total_hours} hours left`}
                      </div>
                    </div>
                    <ChevronRight 
                      className="text-inactive group-hover:text-blue-500 transition-colors" 
                      size={20} 
                    />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <SemesterDetailsModal
        isOpen={selectedSemester !== null}
        onClose={closeModal}
        semesterName={selectedSemester?.semester_name || ''}
        trainings={modalTrainings}
        fitnessTest={fitnessTests.find(test => test.semester === selectedSemester?.semester_name)}
        loading={modalLoading}
      />
    </div>
  );
};

export default HistoryPage;