import React from 'react';
import { FormData } from './types';

interface TokenFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onDeploy: () => void;
}

const TokenForm: React.FC<TokenFormProps> = ({ formData, setFormData, onDeploy }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <form>
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2" htmlFor="name">
          Token Name
        </label>
        <input
          className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          id="name"
          type="text"
          placeholder="Token Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2" htmlFor="symbol">
          Token Symbol
        </label>
        <input
          className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          id="symbol"
          type="text"
          placeholder="Token Symbol"
          value={formData.symbol}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          id="description"
          placeholder="Token Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2" htmlFor="website">
          Website
        </label>
        <input
          className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          id="website"
          type="text"
          placeholder="Website URL"
          value={formData.website}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-white text-sm font-medium mb-2" htmlFor="logo">
          Logo
        </label>
        <input
          className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          id="logo"
          type="text"
          placeholder="Logo URL"
          value={formData.logo}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="bg-indigo-600 text-white py-3 px-6 rounded-sm hover:bg-indigo-700 transition duration-300"
          type="button"
          onClick={onDeploy}
        >
          Deploy
        </button>
      </div>
    </form>
  );
};

export default TokenForm;