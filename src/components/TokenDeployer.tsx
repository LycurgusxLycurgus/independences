'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import LoadingPopup from './LoadingPopup';
import AiPopup from './AiPopup';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL;
const INFURA_URL = "https://sepolia.infura.io/v3/377cad0f477547e98ebc2c94f12411b5";

const TokenDeployer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    website: '',
    logo: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showAiPopup, setShowAiPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAiGeneration = async (tokenName: string) => {
    try {
      const response = await axios.post(WEBHOOK_URL!, { name: tokenName });
      const { name, symbol, description, website } = response.data;
      setFormData({
        name,
        symbol,
        description,
        website,
        logo: 'Logo generated'
      });
    } catch (error) {
      setErrorMessage('Error in AI generation. Please try again.');
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        setSigner(provider.getSigner());
      } catch (error) {
        setErrorMessage("Failed to connect wallet. Please try again.");
      }
    } else {
      setErrorMessage("MetaMask not detected. Please install MetaMask to use this feature.");
    }
  };

  const sendTransaction = async () => {
    if (!signer) {
      setErrorMessage("Wallet not connected");
      return;
    }
    try {
      const tx = await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS,
        value: ethers.utils.parseEther("0.001")
      });
      await tx.wait();
    } catch (error) {
      setErrorMessage("Transaction failed. Please try again.");
    }
  };

  const compileAndDeploy = async () => {
    if (!formData.name || !formData.symbol) {
      setErrorMessage('Please enter both name and symbol.');
      return;
    }
    try {
      setIsLoading(true);
      setLoadingMessage('Compiling and deploying contract...');
      const response = await axios.post('/api/deploy', {
        name: formData.name,
        symbol: formData.symbol
      });
      checkTransactionStatus(response.data.transactionHash);
    } catch (error) {
      setErrorMessage('Deployment failed. Please try again.');
      setIsLoading(false);
    }
  };

  const checkTransactionStatus = async (txHash: string) => {
    const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);
    try {
      const tx = await provider.getTransaction(txHash);
      if (tx && tx.blockNumber) {
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          setLoadingMessage(`Contract deployed successfully at address: ${receipt.contractAddress}`);
          setTimeout(() => setIsLoading(false), 3000);
        } else {
          setErrorMessage('Contract deployment failed.');
          setIsLoading(false);
        }
      } else {
        setTimeout(() => checkTransactionStatus(txHash), 5000); 
      }
    } catch (error) {
      setErrorMessage('Error checking transaction status. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-sm shadow p-6"> 
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
            onClick={compileAndDeploy}
          >
            Deploy
          </button>
        </div>
      </form>
      {errorMessage && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMessage('')}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
      )}
      {isLoading && <LoadingPopup message={loadingMessage} />}
      {showAiPopup && <AiPopup onClose={() => setShowAiPopup(false)} onGenerate={handleAiGeneration} />}
    </div>
  );
};

export default TokenDeployer;