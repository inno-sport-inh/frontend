import React, { useState, useEffect } from 'react';
import { X, Ruler, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { studentAPI } from '../services/studentAPI';
import { StudentMeasurementResponse, MeasurementResult } from '../services/types';

interface StudentMeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId?: number;
}

export const StudentMeasurementsModal: React.FC<StudentMeasurementsModalProps> = ({
  isOpen,
  onClose,
  studentId
}) => {
  const [measurements, setMeasurements] = useState<StudentMeasurementResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMeasurements();
    }
  }, [isOpen, studentId]);

  const loadMeasurements = async () => {
    if (!studentId) {
      setError('Student ID is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await studentAPI.getStudentMeasurements(studentId);
      setMeasurements(data);
    } catch (err) {
      console.error('Error loading measurements:', err);
      setError('Failed to load measurements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (approved: boolean) => {
    return approved ? (
      <CheckCircle className="text-success-500" size={16} />
    ) : (
      <Clock className="text-warning-500" size={16} />
    );
  };

  const getStatusText = (approved: boolean) => {
    return approved ? 'Approved' : 'Pending Review';
  };

  const getStatusBadgeClass = (approved: boolean) => {
    return approved 
      ? 'innohassle-badge-success'
      : 'innohassle-badge-warning';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="innohassle-card bg-floating max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-secondary/50">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-xl flex items-center justify-center">
                <Ruler className="text-brand-violet" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-contrast mb-1">
                  Physical Measurements
                </h2>
                <p className="text-inactive text-sm">
                  Current semester measurements
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-secondary/50 hover:bg-secondary/80 rounded-xl transition-all duration-200 text-inactive hover:text-contrast"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-2xl flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-brand-violet border-t-transparent rounded-full"></div>
                </div>
                <p className="text-inactive font-medium">Loading measurements...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-error-500/20 to-error-500/10 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="text-error-500" size={32} />
                </div>
                <p className="text-error-500 font-medium mb-2">Error Loading Measurements</p>
                <p className="text-inactive text-sm mb-4">{error}</p>
                <button
                  onClick={loadMeasurements}
                  className="innohassle-button-primary px-4 py-2"
                >
                  Try Again
                </button>
              </div>
            ) : !measurements || measurements.result.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary/30 to-secondary/20 rounded-2xl flex items-center justify-center">
                  <Ruler className="text-inactive" size={32} />
                </div>
                <p className="text-inactive font-medium mb-2">No Measurements Available</p>
                <p className="text-inactive text-sm">
                  Your physical measurements will appear here once they are recorded by a trainer.
                </p>
              </div>
            ) : (
              <>
                {/* Measurements Grid */}
                <div className="grid gap-4">
                  {measurements.result.map((measurement: MeasurementResult, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-primary/50 to-secondary/30 rounded-xl border border-secondary/50 hover:border-brand-violet/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-contrast font-semibold text-lg">
                              {measurement.measurement_name}
                            </h3>
                            <span className={`${getStatusBadgeClass(measurement.approved)} text-xs`}>
                              {getStatusText(measurement.approved)}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-inactive">Value:</span>
                              <span className="text-contrast font-medium text-lg">
                                {measurement.value} {measurement.unit}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-inactive">
                              <Calendar size={14} />
                              <span>{formatDate(measurement.date)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusIcon(measurement.approved)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 rounded-xl border border-brand-violet/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-contrast font-semibold mb-1">Summary</h4>
                      <p className="text-inactive text-sm">
                        {measurements.result.filter((m: MeasurementResult) => m.approved).length} of {measurements.result.length} measurements approved
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-brand-violet font-bold text-lg">
                        {Math.round((measurements.result.filter((m: MeasurementResult) => m.approved).length / measurements.result.length) * 100)}%
                      </div>
                      <div className="text-inactive text-xs">Completion</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-6 pt-4 border-t border-secondary/50">
            <button
              onClick={onClose}
              className="innohassle-button-secondary px-6 py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
