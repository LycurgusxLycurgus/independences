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
      setLoadingMessage('Sending deployment transaction...');
      const response = await axios.post('/api/deploy', {
        name: formData.name,
        symbol: formData.symbol
      });
      updateStatus(`${response.data.message}\nPlease wait for the transaction to be mined.`);
      // Start checking the transaction status
      checkTransactionStatus(response.data.transactionHash);
    } catch (error) {
      updateStatus('Deployment failed. Please try again.');
    } finally {
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
        } else {
          updateStatus('Contract deployment failed.');
        }
      } else {
        setTimeout(() => checkTransactionStatus(txHash), 5000); // Check again after 5 seconds
      }
    } catch (error) {
      updateStatus(`Error checking transaction status: ${error}`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Token Deployer</h2>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Token Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symbol">
            Symbol
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="symbol"
            type="text"
            placeholder="Token Symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Token Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="website">
            Website
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="website"
            type="text"
            placeholder="Website URL"
            value={formData.website}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logo">
            Logo
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="logo"
            type="text"
            placeholder="Logo URL"
            value={formData.logo}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => setShowAiPopup(true)}
          >
            Use AI
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={compileAndDeploy}
          >
            Compile and Deploy
          </button>
        </div>
      </form>
      <div className="mt-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800">Status:</h3>
        <pre className="bg-gray-100 p-4 rounded text-gray-700">{status}</pre>
      </div>
      {isLoading && <LoadingPopup message={loadingMessage} />}
      {showAiPopup && <AiPopup onClose={() => setShowAiPopup(false)} onGenerate={handleAiGeneration} />}
    </div>
  );
};

export default TokenDeployer;