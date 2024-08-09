import React, { useState, useEffect } from 'react';

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
    setProgress(25);
    setMessage('Generating token description...');

    await onGenerate(tokenName);

    // Simulate additional loading steps
    const steps = [
      { progress: 50, message: 'Generating token symbol...' },
      { progress: 75, message: 'Generating logo...' },
      { progress: 95, message: 'Generating website...' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 40000));
      setProgress(step.progress);
      setMessage(step.message);
    }

    await new Promise(resolve => setTimeout(resolve, 40000));
    setProgress(100);
    setMessage('Successfully generated');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold mb-4">Generate Token with AI</h3>
        {!loading ? (
          <>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              placeholder="Enter token name"
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Generate
            </button>
          </>
        ) : (
          <div>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-2">{progress}%</p>
            </div>
            <p>{message}</p>
          </div>
        )}
        {progress === 100 && (
          <button
            onClick={onClose}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default AiPopup;