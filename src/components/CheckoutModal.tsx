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
      <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-50">Cancel Booking</h2>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-dark-200 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-dark-200 mb-2">
            Are you sure you want to cancel your booking?
          </p>
          <div className="bg-dark-700 rounded-lg p-3">
            <div className="text-sm text-dark-300">Activity</div>
            <div className="text-dark-50 font-medium">{activityName}</div>
            <div className="text-sm text-dark-300 mt-1">Time</div>
            <div className="text-dark-50">{time}</div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-dark-600 text-dark-200 rounded-lg hover:bg-dark-500 transition-colors"
            disabled={isLoading}
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
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