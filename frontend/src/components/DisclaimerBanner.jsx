import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(20, 184, 166, 0.12) 100%)',
      borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
      padding: '0.625rem 1.5rem',
      fontSize: '0.8125rem',
      color: '#fef3c7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.625rem',
      textAlign: 'center'
    }}>
      <AlertTriangle size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
      <span>
        <strong>Academic Disclaimer:</strong> This project is developed for educational and pattern recognition evaluation purposes only. It is not a medical diagnostic tool. Predictions should not be used as a substitute for professional medical advice.
      </span>
    </div>
  );
}
