import React from 'react';

interface WeekHeaderProps {
  currentWeekStart: Date;
  onPrev: () => void;
  onNext: () => void;
  formatWeekRange: (weekStart: Date) => string;
}

const WeekHeader: React.FC<WeekHeaderProps> = ({ currentWeekStart, onPrev, onNext, formatWeekRange }) => (
  <div className="flex items-center justify-between mb-6">
    <button
      className="innohassle-button-secondary px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
      onClick={onPrev}
    >
      &larr; Previous week
    </button>
    <div className="text-lg font-semibold text-contrast">
      {formatWeekRange(currentWeekStart)}
    </div>
    <button
      className="innohassle-button-secondary px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
      onClick={onNext}
    >
      Next week &rarr;
    </button>
  </div>
);

export default WeekHeader;
