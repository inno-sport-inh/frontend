import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { studentAPI } from '../services/studentAPI';
import { FitnessTestResult, StudentHistoryTraining, StudentSemesterHistory } from '../services/types';
import HistorySemesterModal from '../components/history/HistorySemesterModal';
import FitnessTestsHistory from '../components/history/FitnessTestsHistory';
import SemestersHistory from '../components/history/SemestersHistory';

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

      {/* Fitness Tests History */}
      <FitnessTestsHistory fitnessTests={fitnessTests} />

      {/* Semesters */}
      <SemestersHistory semesterHistory={semesterHistory} onSemesterClick={handleSemesterClick} />

      {/* Modal */}
      <HistorySemesterModal
        isOpen={selectedSemester !== null}
        onClose={closeModal}
        semester={selectedSemester}
        trainings={modalTrainings}
        fitnessTest={fitnessTests.find(test => test.semester === selectedSemester?.semester_name)}
        loading={modalLoading}
      />
    </div>
  );
};

export default HistoryPage;