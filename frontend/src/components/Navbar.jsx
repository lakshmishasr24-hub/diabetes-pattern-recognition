import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  Stethoscope, 
  Database, 
  BrainCircuit, 
  BarChart3, 
  Grid2X2, 
  Sliders, 
  Info,
  Menu,
  X
} from 'lucide-react';
import { getHealth } from '../services/api';

export default function Navbar({ activeTab, setActiveTab }) {
  const [apiOnline, setApiOnline] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkApi = async () => {
      try {
        await getHealth();
        setApiOnline(true);
      } catch (err) {
        setApiOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'predict', label: 'Diabetes Prediction', icon: Stethoscope },
    { id: 'dataset', label: 'Dataset Analysis', icon: Database },
    { id: 'theory', label: 'Pattern Recognition', icon: BrainCircuit },
    { id: 'performance', label: 'Model Performance', icon: BarChart3 },
    { id: 'confusion', label: 'Confusion Matrix', icon: Grid2X2 },
    { id: 'features', label: 'Feature Analysis', icon: Sliders },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <header style={{
      background: 'rgba(11, 15, 25, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)'
          }}>
            <Activity size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              Diabetes Risk <span style={{ color: '#14b8a6' }}>PR</span>
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500 }}>
              Pattern Recognition Academic System
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', gap: '0.375rem', flexWrap: 'wrap' }} className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : '#9ca3af',
                  background: isActive ? 'rgba(20, 184, 166, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#14b8a6' : '#9ca3af'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* API Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="badge badge-teal" style={{ background: apiOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', color: apiOnline ? '#10b981' : '#f43f5e', border: `1px solid ${apiOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}` }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: apiOnline ? '#10b981' : '#f43f5e',
              display: 'inline-block'
            }} />
            {apiOnline === null ? 'Checking API...' : apiOnline ? 'API Online' : 'API Offline'}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: '#0b0f19',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : '#9ca3af',
                  background: isActive ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} color={isActive ? '#14b8a6' : '#9ca3af'} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Inline styles for responsive header show/hide */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}
