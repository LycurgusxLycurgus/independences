import React from 'react';
import dynamic from 'next/dynamic';

const WalletConnection = dynamic(() => import('./TokenDeployer/WalletConnection'), { ssr: false });

interface HeaderProps {
  setSigner: React.Dispatch<React.SetStateAction<any>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ setSigner, setErrorMessage }) => {
  return (
    <header className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-end items-center">
        <WalletConnection setSigner={setSigner} setErrorMessage={setErrorMessage} />
      </div>
    </header>
  );
};

export default Header;