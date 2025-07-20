
import { Activity, FileText, Dumbbell, CheckCircle } from 'lucide-react';

interface StudentProgressProps {
  studentProfile: any;
  studentProgress: {
    completedHours: number;
    totalHours: number;
    progressPercentage: number;
    debt: number;
    selfSportHours: number;
    isComplete: boolean;
  };
  studentPercentile: number;
  studentService: any;
}

const StudentProgress: React.FC<StudentProgressProps> = ({ studentProfile, studentProgress, studentPercentile, studentService }) => (
  <div className="relative overflow-hidden innohassle-card p-4 sm:p-6 bg-gradient-to-br from-brand-violet/5 via-transparent to-brand-violet/10 border-2 border-brand-violet/20 hover:border-brand-violet/30 transition-all duration-300 shadow-lg shadow-brand-violet/5">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-violet/10 to-transparent rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-violet/10 to-transparent rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
    <div className="relative text-center">
      <div className="mb-4">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-2xl">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-violet to-brand-violet/80 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏃</span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-contrast mb-2 bg-gradient-to-r from-brand-violet to-brand-violet/80 bg-clip-text text-transparent">
          {studentProfile ? `${studentProfile.student_info?.name || studentProfile.name || 'User'}'s Sport Progress` : 'Your Sport Progress'}
        </h2>
        {/* Trainer Information */}
        {studentProfile && studentService.isTrainer(studentProfile) && (
          <div className="mb-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
              <span className="text-lg">👨‍🏫</span>
              <span className="text-white text-sm font-semibold">Teacher</span>
            </div>
            {studentProfile.trainer_info && studentProfile.trainer_info.groups && studentProfile.trainer_info.groups.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-inactive mb-2">Teaching groups:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {studentProfile.trainer_info.groups.map((group: { id: number; name: string }) => (
                    <div key={group.id} className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-secondary/50 to-secondary/30 border border-secondary/50">
                      <span className="text-xs">🏃</span>
                      <span className="text-xs font-medium text-contrast">{group.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Титул пользователя */}
        {studentProfile && (studentProfile.student_info?.medical_group || studentProfile.medical_group) && (
          <div className="mb-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-violet to-brand-violet/80">
              <span className="text-sm">🏥</span>
              <span className="text-white text-sm font-medium">
                {studentProfile.student_info?.medical_group || studentProfile.medical_group}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Progress bar and stats */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#E5E7EB" strokeWidth="12" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="12"
                strokeDasharray={339.292}
                strokeDashoffset={339.292 - (339.292 * studentProgress.progressPercentage) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-brand-violet">{studentProgress.progressPercentage}%</span>
              <span className="text-xs text-inactive">completed</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-contrast">
            {studentProgress.completedHours} / {studentProgress.totalHours} hours
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-brand-violet" />
            <span className="text-lg font-semibold text-contrast">{studentProgress.completedHours}</span>
            <span className="text-sm text-inactive">hours completed</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-brand-violet" />
            <span className="text-lg font-semibold text-contrast">{studentProgress.debt}</span>
            <span className="text-sm text-inactive">debt</span>
          </div>
          <div className="flex items-center gap-2">
            <Dumbbell size={18} className="text-brand-violet" />
            <span className="text-lg font-semibold text-contrast">{studentProgress.selfSportHours}</span>
            <span className="text-sm text-inactive">self sport</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-brand-violet" />
            <span className="text-lg font-semibold text-contrast">{studentPercentile}th</span>
            <span className="text-sm text-inactive">percentile</span>
          </div>
        </div>
      </div>
      {/* Completion badge */}
      {studentProgress.isComplete && (
        <div className="mt-4 flex items-center justify-center">
          <span className="innohassle-badge-success px-4 py-2 text-lg font-semibold">Completed!</span>
        </div>
      )}
    </div>
  </div>
);

export default StudentProgress;
