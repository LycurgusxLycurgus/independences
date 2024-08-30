'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('./Header'), { ssr: false });
const TokenDeployer = dynamic(() => import('./TokenDeployer'), { ssr: false });

const TokenDeployerWrapper: React.FC = () => {
  const [signer, setSigner] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      <Header setSigner={setSigner} setErrorMessage={setErrorMessage} />
      <TokenDeployer />
    </>
  );
};

export default TokenDeployerWrapper;