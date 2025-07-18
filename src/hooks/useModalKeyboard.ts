import { useEffect } from 'react';

export const useModalKeyboard = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Добавляем обработчик события
    document.addEventListener('keydown', handleKeyDown);

    // Очищаем обработчик при размонтировании или закрытии модального окна
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
}; 