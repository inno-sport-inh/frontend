import React from 'react';
import CheckoutModal from '../components/CheckoutModal';
import SportInfoModal from '../components/SportInfoModal';
import { MedicalReferenceModal } from '../components/MedicalReferenceModal';
import { SelfSportModal } from '../components/SelfSportModal';

interface ScheduleModalsProps {
  showCancelModal: boolean;
  setShowCancelModal: (v: boolean) => void;
  showMedicalModal: boolean;
  setShowMedicalModal: (v: boolean) => void;
  showSelfSportModal: boolean;
  setShowSelfSportModal: (v: boolean) => void;
  showSportInfoModal: boolean;
  setShowSportInfoModal: (v: boolean) => void;
  isModalLoading: boolean;
  confirmCancelBooking: () => void;
  selectedActivity: any;
}

const ScheduleModals: React.FC<ScheduleModalsProps> = ({
  showCancelModal,
  setShowCancelModal,
  showMedicalModal,
  setShowMedicalModal,
  showSelfSportModal,
  setShowSelfSportModal,
  showSportInfoModal,
  setShowSportInfoModal,
  isModalLoading,
  confirmCancelBooking,
  selectedActivity,
}) => (
  <>
    <CheckoutModal
      isOpen={showCancelModal}
      onClose={() => setShowCancelModal(false)}
      onConfirm={confirmCancelBooking}
      isLoading={isModalLoading}
      activityName={selectedActivity?.activity || ''}
      time={selectedActivity?.time || ''}
      date={selectedActivity?.date ? selectedActivity.date.toLocaleDateString() : ''}
    />
    <SportInfoModal
      isOpen={showSportInfoModal}
      onClose={() => setShowSportInfoModal(false)}
      sportName={selectedActivity?.activity || ''}
    />
    <MedicalReferenceModal
      isOpen={showMedicalModal}
      onClose={() => setShowMedicalModal(false)}
    />
    <SelfSportModal
      isOpen={showSelfSportModal}
      onClose={() => setShowSelfSportModal(false)}
    />
  </>
);

export default ScheduleModals;
