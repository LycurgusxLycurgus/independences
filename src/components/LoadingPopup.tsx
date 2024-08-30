// src/components/LoadingPopup.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingPopupProps {
  message: string;
  progress: number;
  isDeployed: boolean;
  onClose: () => void;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ message, progress, isDeployed, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-md">
      <h3 className="text-xl font-bold mb-4 text-white">
        {isDeployed ? 'Deployment Complete' : 'Processing'}
      </h3>
      {!isDeployed && (
        <div className="mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"
          />
        </div>
      )}
      <p className="text-gray-300 mb-4">{message}</p>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="bg-indigo-600 h-2.5 rounded-full"
        />
      </div>
      <p className="text-gray-300">{progress}% Complete</p>
      {isDeployed && (
        <button
          onClick={onClose}
          className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
        >
          Close
        </button>
      )}
    </div>
  </motion.div>
);

export default LoadingPopup;