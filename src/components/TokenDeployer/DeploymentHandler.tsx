import React from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { FormData } from './types';
import { checkTransactionStatus } from './utils';

interface DeploymentHandlerProps {
  formData: FormData;
  signer: ethers.Signer | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingMessage: React.Dispatch<React.SetStateAction<string>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setDeployedAddress: React.Dispatch<React.SetStateAction<string | null>>;
}

const DeploymentHandler: React.FC<DeploymentHandlerProps> = ({
  formData,
  signer,
  setIsLoading,
  setLoadingMessage,
  setErrorMessage,
  setDeployedAddress,
}) => {
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
      checkTransactionStatus(response.data.transactionHash, setDeployedAddress, setErrorMessage, setIsLoading);
    } catch (error) {
      setErrorMessage('Deployment failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <button onClick={compileAndDeploy}>Deploy Token</button>
  );
};

export default DeploymentHandler;