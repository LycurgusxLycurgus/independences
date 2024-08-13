// src/components/AiPopup.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AiPopupProps {
  onClose: () => void;
  onGenerate: (tokenName: string) => Promise<void>;
}

const AiPopup: React.FC<AiPopupProps> = ({ onClose, onGenerate }) => {
  const [tokenName, setTokenName] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setProgress(0);
    setMessage('Generating token description...');

    await onGenerate(tokenName);

    const steps = [
      { progress: 25, message: 'Generating token symbol...' },
      { progress: 50, message: 'Generating logo...' },
      { progress: 75, message: 'Generating website...' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 30000));
      setProgress(step.progress);
      setMessage(step.message);
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
    setProgress(100);
    setMessage('Successfully generated');
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-white">Generate Token with AI</h3>
        {!loading ? (
          <>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="Enter token name"
              className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
            >
              Generate
            </button>
          </>
        ) : (
          <div>
            <div className="mb-4">
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-indigo-600 h-2.5 rounded-full"
                />
              </div>
              <p className="mt-2 text-white">{progress}%</p>
            </div>
            <p className="text-gray-300">{message}</p>
          </div>
        )}
        {progress === 100 && (
          <button
            onClick={onClose}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
          >
            Close
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AiPopup;