import React from "react";
import { Trophy, Clock, Target, CheckCircle } from "lucide-react";
import { mockUserStats } from "../data/mockData";

const HistoryPage: React.FC = () => {
  /**
   * A reusable component to display a single statistic.
   */
  const stats = mockUserStats;

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    type?: "success" | "progress" | "hours";
  }> = ({ icon, label, value, type = "progress" }) => {
    // Determine text color based on type
    const getStatusColor = () => {
      if (type === "success") return "text-success-500";
      if (type === "hours") return "text-brand-violet";
      return "text-blue-500";
    };

    // Determine background and border color based on type
    const getBackgroundColor = () => {
      if (type === "success") return "bg-success-500/10 border-success-500/30";
      if (type === "hours") return "bg-brand-violet/10 border-brand-violet/30";
      return "bg-blue-500/10 border-blue-500/30";
    };
    return (
      <article role="region" aria-label={label} className={`p-4 rounded-xl border ${getBackgroundColor()}`}>
        <div className="flex items-center space-x-3">
          {/* Icon indicating the statistic category */}
          <div className={`${getStatusColor()}`}>{icon}</div>
          <div>
            {/* Label describing what this statistic represents */}
            <div className="text-sm text-inactive">{label}</div>
            {/* The statistic value itself */}
            <div className={`text-lg font-semibold ${getStatusColor()}`}>{value}</div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <main className="space-y-12 max-w-7xl mx-auto px-4">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-contrast">Training History</h1>
        <p className="text-inactive">A concise overview of your workouts, time spent, and achievements.</p>
      </header>

      {/* Fitness Test Section */}
      <section aria-labelledby="fitness-test-heading" className="innohassle-card p-6">
        <header id="fitness-test-heading" className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-success-500/10 rounded-lg">
            <Trophy className="text-success-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-contrast">Fitness Test</h2>
            <p className="text-inactive">Your latest assessment result</p>
          </div>
        </header>
        {/* Show current fitness test status */}
        <StatCard icon={<Trophy size={24} />} label="Test Status" value={stats.fitnessTest} type="success" />
      </section>

      {/* Exercise Progress Section */}
      <section aria-labelledby="exercise-progress-heading" className="innohassle-card p-6">
        <header id="exercise-progress-heading" className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Target className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-contrast">Exercise Progress</h2>
            <p className="text-inactive">Monitor how you’re improving in each exercise category.</p>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Individual exercise stats */}
          <StatCard icon={<Target size={24} />} label="Push-Ups Completed" value={stats.pushUps} />
          <StatCard icon={<Target size={24} />} label="Crunches Done" value={stats.crunches} />
          <StatCard icon={<Target size={24} />} label="Finger Tilts" value={stats.tiltFingers} />
        </div>
      </section>

      {/* Training Hours Section */}
      <section aria-labelledby="training-hours-heading" className="innohassle-card p-6">
        <header id="training-hours-heading" className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-brand-violet/10 rounded-lg">
            <Clock className="text-brand-violet" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-contrast">Training Hours</h2>
            <p className="text-inactive">Total hours you’ve dedicated so far</p>
          </div>
        </header>
        {/* Display total completed hours */}
        <StatCard icon={<Clock size={24} />} label="Completed Hours" value={stats.hours} type="hours" />
      </section>

      {/* Recent Activities Section */}
      <section aria-labelledby="recent-activities-heading" className="innohassle-card p-6">
        <header id="recent-activities-heading" className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <CheckCircle className="text-green-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-contrast">Recent Activities</h2>
            <p className="text-inactive">A log of your most recent sessions</p>
          </div>
        </header>
        <div className="space-y-3">
          {[
            { date: "Today", activity: "Table Tennis", duration: "1.5 hours" },
            { date: "Yesterday", activity: "Table Tennis", duration: "1.5 hours" },
            { date: "2 days ago", activity: "Table Tennis", duration: "1.5 hours" },
            { date: "3 days ago", activity: "Table Tennis", duration: "1.5 hours" },
          ].map((item, idx) => (
            <article key={idx} role="listitem" className="bg-primary/50 border border-secondary rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {/* Check icon to signal completion */}
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
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HistoryPage;
