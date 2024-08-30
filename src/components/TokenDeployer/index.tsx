import React, { useState } from 'react';
import { ethers } from 'ethers';
import TokenForm from './TokenForm';
import WalletConnection from './WalletConnection';
import DeploymentHandler from './DeploymentHandler';
import ErrorDisplay from './ErrorDisplay';
import LoadingPopup from '../LoadingPopup';
import AiPopup from '../AiPopup';
import { FormData } from './types';

const TokenDeployer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  return (
    <div className="bg-gray-800 rounded-sm shadow p-6">
      <TokenForm
        formData={formData}
        setFormData={setFormData}
        setShowAiPopup={setShowAiPopup}
      />
      <WalletConnection
        setSigner={setSigner}
        setErrorMessage={setErrorMessage}
      />
      <DeploymentHandler
        formData={formData}
        signer={signer}
        setIsLoading={setIsLoading}
        setLoadingMessage={setLoadingMessage}
        setErrorMessage={setErrorMessage}
        setDeployedAddress={setDeployedAddress}
      />
      <ErrorDisplay errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
      {isLoading && (
        <LoadingPopup
          message={loadingMessage}
          isDeployed={!!deployedAddress}
          onClose={() => {
            setIsLoading(false);
            setDeployedAddress(null);
          }}
        />
      )}
      {showAiPopup && (
        <AiPopup
          onClose={() => {
            setShowAiPopup(false);
            setIsLoading(false);
          }}
          onGenerate={async (tokenName: string) => {
            // Implement AI generation logic here
          }}
        />
      )}
    </div>
  );
};

export default TokenDeployer;