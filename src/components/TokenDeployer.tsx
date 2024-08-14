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
  const [status, setStatus] = useState('');
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showAiPopup, setShowAiPopup] = useState(false);

  const updateStatus = (message: string) => {
    setStatus((prevStatus) => prevStatus + '\n' + message);
  };

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
      updateStatus('AI-generated token details received');
    } catch (error) {
      updateStatus(`Error in AI generation: ${error}`);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        setSigner(provider.getSigner());
        updateStatus("Wallet connected");
      } catch (error) {
        updateStatus("Failed to connect wallet. Please try again.");
      }
    } else {
      updateStatus("MetaMask not detected. Please install MetaMask to use this feature.");
    }
  };

  const sendTransaction = async () => {
    if (!signer) {
      updateStatus("Wallet not connected");
      return;
    }
    try {
      const tx = await signer.sendTransaction({
        to: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS,
        value: ethers.utils.parseEther("0.001")
      });
      await tx.wait();
      updateStatus(`Transaction sent! Hash: ${tx.hash}`);
    } catch (error) {
      updateStatus("Transaction failed. Please try again.");
    }
  };

  const compileAndDeploy = async () => {
    if (!formData.name || !formData.symbol) {
      updateStatus('Please enter both name and symbol.');
      return;
    }
    try {
      setIsLoading(true);
      setLoadingMessage('Compiling contract...');
      const response = await axios.post('/api/deploy', {
        name: formData.name,
        symbol: formData.symbol
      });
      updateStatus(`${response.data.message}\nDeploying contract...`);
      // Start checking the transaction status
      checkTransactionStatus(response.data.transactionHash);
    } catch (error) {
      updateStatus('Deployment failed. Please try again.');
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
          updateStatus(`Contract deployed successfully at address: ${receipt.contractAddress}`);
          setIsLoading(false);
        } else {
          updateStatus('Contract deployment failed.');
          setIsLoading(false);
        }
      } else {
        setTimeout(() => checkTransactionStatus(txHash), 5000); // Check again after 5 seconds
      }
    } catch (error) {
      updateStatus(`Error checking transaction status: ${error}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-sm shadow p-6"> {/* Updated styling */}
      <form>
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="name"> {/* Updated styling */}
            Token Name
          </label>
          <input
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600" /* Updated styling */
            id="name"
            type="text"
            placeholder="Token Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        {/* Repeat similar structure for symbol, description, website, and telegram fields */}
        <div className="mb-4"> 
          <label className="block text-white text-sm font-medium mb-2" htmlFor="symbol"> {/* Updated styling */}
            Token Symbol
          </label>
          <input
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600" /* Updated styling */
            id="symbol"
            type="text"
            placeholder="Token Symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="description"> {/* Updated styling */}
            Description
          </label>
          <textarea
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600" /* Updated styling */
            id="description"
            placeholder="Token Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="website"> {/* Updated styling */}
            Website
          </label>
          <input
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600" /* Updated styling */
            id="website"
            type="text"
            placeholder="Website URL"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="logo"> {/* Updated styling */}
            Logo
          </label>
          <input
            className="w-full bg-gray-800 text-white border border-gray-600 rounded-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-600" /* Updated styling */
            id="logo"
            type="text"
            placeholder="Logo URL"
            value={formData.logo}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-center space-x-4 mt-6"> {/* Updated styling */}
          <button
            className="bg-indigo-600 text-white py-3 px-6 rounded-sm hover:bg-indigo-700 transition duration-300" /* Updated styling */
            type="button"
            onClick={() => setShowAiPopup(true)}
          >
            Use AI
          </button>
          <button
            className="bg-indigo-600 text-white py-3 px-6 rounded-sm hover:bg-indigo-700 transition duration-300" /* Updated styling */
            type="button"
            onClick={compileAndDeploy}
          >
            Deploy
          </button>
        </div>
      </form>
      <div className="mt-4"> {/* Preserving Code B element with adjusted styling */}
        <h3 className="text-lg font-bold mb-2 text-white">Status:</h3> {/* Updated styling */}
        <pre className="bg-gray-700 text-white p-4 rounded text-gray-700">{status}</pre> {/* Updated styling */}
      </div>
      {isLoading && <LoadingPopup message={loadingMessage} />}
      {showAiPopup && <AiPopup onClose={() => setShowAiPopup(false)} onGenerate={handleAiGeneration} />}
    </div>
  );
};

export default TokenDeployer;