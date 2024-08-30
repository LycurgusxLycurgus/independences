import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import TokenDeployerWrapper from '../components/TokenDeployerWrapper';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-4">Demo</h2>
        <TokenDeployerWrapper />
      </div>
      <About />
    </main>
  );
}