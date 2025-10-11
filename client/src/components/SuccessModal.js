import React from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

const SuccessModal = ({ isOpen, onClose, title, message, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative inline-block align-middle bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all w-full max-w-sm mx-auto">
          <div>
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
              <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {message}
                </p>
                {children && (
                  <div className="mt-4">
                    {children}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-5 sm:mt-6">
            <button
              onClick={onClose}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;