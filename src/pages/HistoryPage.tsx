import React from 'react';
import { Trophy, Clock, Target, CheckCircle } from 'lucide-react';
import { mockUserStats } from '../data/mockData';

const HistoryPage: React.FC = () => {
  const stats = mockUserStats;

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    type?: 'success' | 'progress' | 'hours';
  }> = ({ icon, label, value, type = 'progress' }) => {
    const getStatusColor = () => {
      if (type === 'success') return 'text-success-500';
      if (type === 'hours') return 'text-brand-violet';
      return 'text-blue-500';
    };

    const getBackgroundColor = () => {
      if (type === 'success') return 'bg-success-500/10 border-success-500/30';
      if (type === 'hours') return 'bg-brand-violet/10 border-brand-violet/30';
      return 'bg-blue-500/10 border-blue-500/30';
    };

    return (
      <div className={`p-4 rounded-xl border ${getBackgroundColor()}`}>
        <div className="flex items-center space-x-3">
          <div className={`${getStatusColor()}`}>
            {icon}
          </div>
          <div>
            <div className="text-sm text-inactive">{label}</div>
            <div className={`text-lg font-semibold ${getStatusColor()}`}>
              {value}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-contrast">Training History</h1>
        <p className="text-inactive mt-2">Your training progress and achievements</p>
      </div>

      {/* Fitness Test Status */}
      <div className="innohassle-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-success-500/10 rounded-lg">
            <Trophy className="text-success-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-contrast">Fitness Test</h2>
            <p className="text-inactive">Current test status</p>
          </div>
        </div>
        <StatCard
          icon={<Trophy size={24} />}
          label="Status"
          value={stats.fitnessTest}
          type="success"
        />
      </div>

      {/* Exercise Progress */}
      <div className="innohassle-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Target className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-contrast">Exercise Progress</h2>
            <p className="text-inactive">Track your individual requirements</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<Target size={24} />}
            label="Push-ups"
            value={stats.pushUps}
          />
          <StatCard
            icon={<Target size={24} />}
            label="Crunches"
            value={stats.crunches}
          />
          <StatCard
            icon={<Target size={24} />}
            label="Tilt Fingers"
            value={stats.tiltFingers}
          />
        </div>
      </div>

      {/* Hours Tracking */}
      <div className="innohassle-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-brand-violet/10 rounded-lg">
            <Clock className="text-brand-violet" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-contrast">Training Hours</h2>
            <p className="text-inactive">Your completed training time</p>
          </div>
        </div>
        <StatCard
          icon={<Clock size={24} />}
          label="Completed Hours"
          value={stats.hours}
          type="hours"
        />
      </div>

      {/* Recent Activities */}
      <div className="innohassle-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-contrast">Recent Activities</h2>
            <p className="text-inactive">Your latest training sessions</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { date: 'Today', activity: 'Table Tennis', duration: '1.5 hours', status: 'completed' },
            { date: 'Yesterday', activity: 'Table Tennis', duration: '1.5 hours', status: 'completed' },
            { date: '2 days ago', activity: 'Table Tennis', duration: '1.5 hours', status: 'completed' },
            { date: '3 days ago', activity: 'Table Tennis', duration: '1.5 hours', status: 'completed' },
          ].map((item, index) => (
            <div key={index} className="bg-primary/50 border border-secondary rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-success-500" />
                    <span className="text-contrast font-medium">{item.activity}</span>
                  </div>
                  <span className="text-inactive text-sm">{item.duration}</span>
                </div>
                <div className="text-right">
                  <div className="text-inactive text-sm">{item.date}</div>
                  <div className="text-success-500 text-xs font-medium">Completed</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;