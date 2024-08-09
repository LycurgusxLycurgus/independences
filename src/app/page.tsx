import React from 'react';
import Hero from '../components/Hero';
import TokenDeployer from '../components/TokenDeployer';
import About from '../components/About';
import AiPopup from '../components/AiPopup';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <TokenDeployer />
      </div>
      <About />
    </main>
  );
}