import React from 'react';
// ...existing code...
import { studentService } from '../services/studentService';

interface ScheduleProgressHeaderProps {
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
}

const ScheduleProgressHeader: React.FC<ScheduleProgressHeaderProps> = ({
  studentProfile,
  studentProgress,
  studentPercentile
}) => {
  return (
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
          <p className="text-sm sm:text-base text-inactive">
            You've completed <span className="font-semibold text-brand-violet">{studentProgress.completedHours}</span> out of <span className="font-semibold text-contrast">{studentProgress.totalHours}</span> required hours this semester
            {studentProgress.completedHours > studentProgress.totalHours && (
              <span className="block mt-1 text-success-500 font-medium">
                🎉 Exceeded requirement by {studentProgress.completedHours - studentProgress.totalHours} hours!
              </span>
            )}
          </p>
        </div>
        {/* Прогресс-бар, легенда, статистика и мотивация */}
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between text-xs sm:text-sm text-inactive mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-brand-violet rounded-full animate-pulse"></div>
              <span className="font-semibold">
                {studentProgress.completedHours} of {studentProgress.totalHours} hours
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="font-medium">
                {studentProgress.completedHours >= studentProgress.totalHours 
                  ? `+${studentProgress.completedHours - studentProgress.totalHours} extra`
                  : `${studentProgress.totalHours - studentProgress.completedHours} remaining`
                }
              </span>
            </div>
          </div>
          <div className="relative w-full py-1">
            <div className="w-full bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-2xl h-8 shadow-inner border border-secondary/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl"></div>
              {/* Основные часы */}
              {(() => {
                const regularHours = Math.max(0, studentProgress.completedHours - studentProgress.selfSportHours);
                const regularPercentage = Math.min((regularHours / studentProgress.totalHours) * 100, 100);
                return regularPercentage > 0 && (
                  <div 
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-l-2xl transition-all duration-1000 ease-out"
                    style={{ width: `${regularPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite]"></div>
                  </div>
                );
              })()}
              {/* Self-sport часы */}
              {(() => {
                const regularHours = Math.max(0, studentProgress.completedHours - studentProgress.selfSportHours);
                const regularPercentage = Math.min((regularHours / studentProgress.totalHours) * 100, 100);
                const selfSportPercentage = Math.min((studentProgress.selfSportHours / studentProgress.totalHours) * 100, 100 - regularPercentage);
                return selfSportPercentage > 0 && (
                  <div 
                    className="absolute top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-out"
                    style={{ 
                      left: `${regularPercentage}%`,
                      width: `${selfSportPercentage}%`,
                      borderRadius: regularPercentage === 0 ? '1rem 0 0 1rem' : '0'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite]"></div>
                  </div>
                );
              })()}
              {/* Превышение требования */}
              {(() => {
                const excessPercentage = studentProgress.completedHours > studentProgress.totalHours 
                  ? Math.min(((studentProgress.completedHours - studentProgress.totalHours) / studentProgress.totalHours) * 100, 50)
                  : 0;
                return excessPercentage > 0 && (
                  <div 
                    className="absolute top-0 h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-r-2xl transition-all duration-1000 ease-out animate-pulse"
                    style={{ 
                      left: '100%',
                      width: `${excessPercentage}%`,
                      transform: 'translateX(-100%)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-[shimmer_2s_ease-in-out_infinite]"></div>
                  </div>
                );
              })()}
              {/* Долг (если есть) */}
              {studentProgress.debt > 0 && (
                <div 
                  className="absolute right-0 top-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-r-2xl border-2 border-red-400 transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((studentProgress.debt / studentProgress.totalHours) * 100, 30)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-[shimmer_1.5s_ease-in-out_infinite]"></div>
                </div>
              )}
              {/* Milestone markers */}
              <div className="absolute inset-0 flex items-center overflow-hidden rounded-2xl">
                {[25, 50, 75, 100].map((milestone) => (
                  <div
                    key={milestone}
                    className="absolute top-0 bottom-0 w-0.5 bg-white/40"
                    style={{ left: `${milestone}%` }}
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full"></div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-inactive font-medium">
                      {milestone}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Легенда */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <span className="text-contrast font-medium">
                Training hours: {Math.max(0, studentProgress.completedHours - studentProgress.selfSportHours)}
              </span>
            </div>
            {studentProgress.selfSportHours > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                <span className="text-contrast font-medium">
                  Self-sport: {studentProgress.selfSportHours}
                </span>
              </div>
            )}
            {studentProgress.completedHours > studentProgress.totalHours && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                <span className="text-contrast font-medium">
                  Excess: {studentProgress.completedHours - studentProgress.totalHours}
                </span>
              </div>
            )}
            {studentProgress.debt > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                <span className="text-contrast font-medium">
                  Debt: {studentProgress.debt}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Progress Stats */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 px-4 py-2 rounded-xl border border-brand-violet/20">
            <div className="w-2 h-2 bg-brand-violet rounded-full"></div>
            <span className="text-sm font-bold text-contrast">
              {studentProgress.progressPercentage.toFixed(1)}% Complete
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gradient-to-r from-success-500/10 to-success-500/5 px-4 py-2 rounded-xl border border-success-500/20">
            <span className="text-lg">🎯</span>
            <span className="text-sm font-bold text-success-500">
              Top {studentPercentile}% Performer
            </span>
          </div>
          {studentProgress.progressPercentage >= 100 && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-brand-violet/20 to-brand-violet/10 px-4 py-2 rounded-xl border border-brand-violet/30 animate-bounce">
              <span className="text-lg">🏆</span>
              <span className="text-sm font-bold text-brand-violet">
                Goal Achieved!
              </span>
            </div>
          )}
        </div>
        {/* Motivational Message */}
        <div className="mt-4 text-center">
          <p className="text-sm text-inactive">
            {studentProgress.progressPercentage >= 100 
              ? "Congratulations! You've completed all required hours!" 
              : studentProgress.progressPercentage >= 75 
              ? "You're almost there! Keep it up!" 
              : studentProgress.progressPercentage >= 50 
              ? "Great progress! You're halfway there!" 
              : studentProgress.progressPercentage >= 25 
              ? "Good start! Keep building momentum!" 
              : "Let's get started on your fitness journey!"
            }
          </p>
          {studentProgress.progressPercentage < 100 && (
            <p className="text-xs text-inactive mt-1">
              Estimated time to completion: {Math.ceil(Math.max((studentProgress.totalHours - studentProgress.completedHours), 0) / 2)} weeks
            </p>
          )}
          {studentProgress.progressPercentage >= 100 && studentProgress.completedHours > studentProgress.totalHours && (
            <p className="text-xs text-success-500 mt-1 font-medium">
              You've exceeded the requirement by {studentProgress.completedHours - studentProgress.totalHours} hours! 🌟
            </p>
          )}
        </div>
      </div>
    </div>
      )};

export default ScheduleProgressHeader;
