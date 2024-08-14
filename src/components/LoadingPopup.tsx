import React from 'react';
import { motion } from 'framer-motion';

interface LoadingPopupProps {
  message: string;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-bold mb-4 text-white">Processing</h3>
      <p className="text-gray-300">{message}</p>
      <div className="mt-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"
        />
      </div>
    </div>
  </motion.div>
);

export default LoadingPopup;