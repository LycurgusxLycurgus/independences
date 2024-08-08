import React from 'react';

interface LoadingPopupProps {
  message: string;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h3 className="text-xl font-bold mb-4">Loading</h3>
      <p>{message}</p>
    </div>
  </div>
);

export default LoadingPopup;
