import React from 'react';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  activityName: string;
  time: string;
  isLoading?: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  activityName,
  time,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="innohassle-card p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-contrast">Cancel Booking</h2>
          <button
            onClick={onClose}
            className="text-inactive hover:text-contrast transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-contrast mb-2">
            Are you sure you want to cancel your booking?
          </p>
          <div className="bg-primary rounded-lg p-3 border border-secondary">
            <div className="text-sm text-inactive">Activity</div>
            <div className="text-contrast font-medium">{activityName}</div>
            <div className="text-sm text-inactive mt-1">Time</div>
            <div className="text-contrast">{time}</div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 innohassle-button-secondary px-4 py-2"
            disabled={isLoading}
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 innohassle-button-error px-4 py-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;