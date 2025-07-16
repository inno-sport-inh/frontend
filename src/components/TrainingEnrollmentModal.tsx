import React, { useState } from 'react';
import { X, Clock, Users, Calendar, BookOpen } from 'lucide-react';
import { useModalKeyboard } from '../hooks/useModalKeyboard';

interface TrainingEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (clubName: string, sessionTime: string) => void;
  activityName: string;
  availableTimes: string[];
  availableClubs: string[];
  isLoading?: boolean;
}

const TrainingEnrollmentModal: React.FC<TrainingEnrollmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  activityName,
  availableTimes,
  availableClubs,
  isLoading = false
}) => {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedClub, setSelectedClub] = useState('');

  // Добавляем поддержку закрытия по Escape
  useModalKeyboard(isOpen, onClose);

  const handleSubmit = () => {
    if (selectedTime && selectedClub) {
      onConfirm(selectedClub, selectedTime);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Закрываем модальное окно только если клик был по backdrop, а не по содержимому
    // И только если не происходит загрузка
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const isValid = selectedTime && selectedClub;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="innohassle-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-contrast">Enroll in Training</h2>
          <button
            onClick={onClose}
            className="text-inactive hover:text-contrast transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Activity Info */}
        <div className="mb-6">
          <div className="bg-primary rounded-lg p-4 border border-secondary">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen size={18} className="text-brand-violet" />
              <span className="font-medium text-contrast">Activity</span>
            </div>
            <p className="text-lg font-semibold text-contrast">{activityName}</p>
          </div>
        </div>

        {/* Time Selection */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Clock size={18} className="text-brand-violet" />
            <label className="font-medium text-contrast">Select Training Time</label>
          </div>
          <div className="space-y-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  selectedTime === time
                    ? 'border-brand-violet bg-brand-violet/10 text-brand-violet'
                    : 'border-secondary bg-primary text-contrast hover:border-brand-violet/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Club Selection */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Users size={18} className="text-brand-violet" />
            <label className="font-medium text-contrast">Select Club/Group</label>
          </div>
          <div className="space-y-2">
            {availableClubs.map((club) => (
              <button
                key={club}
                onClick={() => setSelectedClub(club)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  selectedClub === club
                    ? 'border-brand-violet bg-brand-violet/10 text-brand-violet'
                    : 'border-secondary bg-primary text-contrast hover:border-brand-violet/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users size={16} />
                  <span>{club}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selection Summary */}
        {isValid && (
          <div className="mb-6 p-4 bg-brand-violet/10 rounded-lg border border-brand-violet/30">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar size={16} className="text-brand-violet" />
              <span className="font-medium text-brand-violet">Enrollment Summary</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-contrast"><strong>Activity:</strong> {activityName}</p>
              <p className="text-contrast"><strong>Time:</strong> {selectedTime}</p>
              <p className="text-contrast"><strong>Club:</strong> {selectedClub}</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 innohassle-button-secondary px-4 py-2"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 innohassle-button-primary px-4 py-2 disabled:opacity-50"
            disabled={isLoading || !isValid}
          >
            {isLoading ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
          <p className="text-xs text-inactive">
            <strong>Note:</strong> You can change your club selection later. 
            Time slots are confirmed based on availability and club capacity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingEnrollmentModal;
