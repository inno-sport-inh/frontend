import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { studentAPI } from '../services/studentAPI';
import { useModalKeyboard } from '../hooks/useModalKeyboard';

interface UploadMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  studentId: string;
  measurementId: string;
  value: string;
}

export const UploadMeasurementModal: React.FC<UploadMeasurementModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    studentId: '',
    measurementId: '',
    value: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Добавляем поддержку закрытия по Escape
  useModalKeyboard(isOpen, onClose);

  const resetForm = () => {
    setFormData({
      studentId: '',
      measurementId: '',
      value: '',
    });
    setErrors([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Закрываем модальное окно только если клик был по backdrop, а не по содержимому
    // И только если не происходит загрузка
    if (e.target === e.currentTarget && !isUploading) {
      handleClose();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.studentId) {
      newErrors.push('Please enter the student ID');
    }

    if (!formData.measurementId) {
      newErrors.push('Please enter the measurement ID');
    }

    if (!formData.value) {
      newErrors.push('Please enter the measurement value');
    }

    const studentIdNum = parseInt(formData.studentId);
    if (isNaN(studentIdNum)) {
      newErrors.push('Student ID must be a valid number');
    }

    const measurementIdNum = parseInt(formData.measurementId);
    if (isNaN(measurementIdNum)) {
      newErrors.push('Measurement ID must be a valid number');
    }

    const valueNum = parseFloat(formData.value);
    if (isNaN(valueNum)) {
      newErrors.push('Value must be a valid number');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    try {
      const result = await studentAPI.uploadMeasurement(
        parseInt(formData.studentId),
        parseInt(formData.measurementId),
        parseFloat(formData.value)
      );

      console.log('Measurement upload successful:', result);
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error('Error uploading measurement:', error);
      setErrors(['Error uploading measurement. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="innohassle-card bg-floating max-w-md w-full max-h-[90vh] overflow-y-auto border-2 border-secondary/50">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-contrast mb-2">
                Upload Student Measurement
              </h2>
              <p className="text-inactive text-sm leading-relaxed mb-3">
                Post measurement results for a student. Only accessible by trainers.
              </p>
              <div className="p-3 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 rounded-lg border border-brand-violet/20">
                <p className="text-sm text-contrast font-medium">
                  ℹ️ This is different from medical reference upload - this is for posting measurement data.
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="text-inactive hover:text-contrast transition-colors disabled:opacity-50"
            >
              <X size={24} />
            </button>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm">
                    • {error}
                  </p>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student ID */}
            <div>
              <label className="block text-sm font-semibold text-contrast mb-3">
                Student ID *
              </label>
              <input
                type="number"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                disabled={isUploading}
                placeholder="Enter student ID"
                className="w-full p-3 bg-primary border-2 border-secondary rounded-lg 
                         text-contrast placeholder-inactive
                         focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 
                         disabled:opacity-50 transition-all duration-200"
                required
              />
            </div>

            {/* Measurement ID */}
            <div>
              <label className="block text-sm font-semibold text-contrast mb-3">
                Measurement ID *
              </label>
              <input
                type="number"
                value={formData.measurementId}
                onChange={(e) =>
                  setFormData({ ...formData, measurementId: e.target.value })
                }
                disabled={isUploading}
                placeholder="Enter measurement ID"
                className="w-full p-3 bg-primary border-2 border-secondary rounded-lg 
                         text-contrast placeholder-inactive
                         focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 
                         disabled:opacity-50 transition-all duration-200"
                required
              />
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-semibold text-contrast mb-3">
                Measurement Value *
              </label>
              <input
                type="number"
                step="any"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                disabled={isUploading}
                placeholder="Enter measurement value"
                className="w-full p-3 bg-primary border-2 border-secondary rounded-lg 
                         text-contrast placeholder-inactive
                         focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 
                         disabled:opacity-50 transition-all duration-200"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1 px-4 py-3 bg-secondary text-contrast border border-secondary 
                         rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 px-4 py-3 bg-brand-violet text-white border border-brand-violet 
                         rounded-lg hover:bg-brand-violet/90 transition-colors disabled:opacity-50
                         flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Measurement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadMeasurementModal;
