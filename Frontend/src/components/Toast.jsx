import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const bgColor = type === 'success' 
    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
    : 'bg-red-500/20 border-red-500/50 text-red-400';

  return (
    <div className={`black-card ${bgColor} p-4 rounded-xl shadow-2xl transform translate-y-0 opacity-100 transition-all duration-300 fixed top-20 right-6 z-50 max-w-sm`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-2 h-2 bg-current rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-white rounded-lg"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;