import React from 'react';
import { Trophy } from 'lucide-react';
import { FitnessTestResult } from '../../services/types';

interface FitnessTestsHistoryProps {
  fitnessTests: FitnessTestResult[];
}

const FitnessTestsHistory: React.FC<FitnessTestsHistoryProps> = ({ fitnessTests }) => {
  if (fitnessTests.length === 0) return null;

  return (
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
  );
};

export default FitnessTestsHistory;
