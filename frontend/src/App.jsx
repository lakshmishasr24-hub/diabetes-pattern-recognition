import React, { useState } from 'react';
import DisclaimerBanner from './components/DisclaimerBanner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import DatasetAnalysis from './pages/DatasetAnalysis';
import PatternRecognition from './pages/PatternRecognition';
import ModelPerformance from './pages/ModelPerformance';
import ConfusionMatrixPage from './pages/ConfusionMatrixPage';
import FeatureAnalysis from './pages/FeatureAnalysis';
import AboutProject from './pages/AboutProject';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'predict':
        return <Predict />;
      case 'dataset':
        return <DatasetAnalysis />;
      case 'theory':
        return <PatternRecognition />;
      case 'performance':
        return <ModelPerformance />;
      case 'confusion':
        return <ConfusionMatrixPage />;
      case 'features':
        return <FeatureAnalysis />;
      case 'about':
        return <AboutProject />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <DisclaimerBanner />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flex: 1 }}>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}
