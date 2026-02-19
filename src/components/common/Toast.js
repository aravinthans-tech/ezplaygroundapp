import { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !isVisible) return null;

  return (
    <div className={`fixed top-16 right-4 z-50 toast ${isVisible ? 'block' : 'hidden'}`}>
      <div
        className={`bg-white rounded-lg shadow-xl p-3 border-l-4 ${
          type === 'success' ? 'border-cyan-500' : 'border-red-500'
        }`}
      >
        <p className={`font-medium text-sm ${type === 'success' ? 'text-cyan-800' : 'text-red-800'}`}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default Toast;

