import React from 'react';
import { FormData } from './types';

interface TokenFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setShowAiPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenForm: React.FC<TokenFormProps> = ({ formData, setFormData, setShowAiPopup }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <form>
      {/* Form fields */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          className="bg-indigo-600 text-white py-3 px-6 rounded-sm hover:bg-indigo-700 transition duration-300"
          type="button"
          onClick={() => setShowAiPopup(true)}
        >
          Use AI
        </button>
        <button
          className="bg-indigo-600 text-white py-3 px-6 rounded-sm hover:bg-indigo-700 transition duration-300"
          type="button"
          onClick={() => {/* Implement deployment logic */}}
        >
          Deploy
        </button>
      </div>
    </form>
  );
};

export default TokenForm;