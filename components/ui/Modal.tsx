import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg p-6 my-8 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all sm:my-16 sm:align-middle">
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="mt-2 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;