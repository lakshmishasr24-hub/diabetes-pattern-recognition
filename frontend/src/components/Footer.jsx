import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(11, 15, 25, 0.95)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '2.5rem 1.5rem 2rem 1.5rem',
      color: '#9ca3af',
      fontSize: '0.875rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {/* Project info */}
        <div>
          <h3 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Diabetes Risk Pattern Recognition System
          </h3>
          <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#9ca3af' }}>
            An academic Machine Learning & Pattern Recognition system developed to demonstrate classification algorithms, feature scaling, performance metrics, and clinical risk pattern identification.
          </p>
        </div>

        {/* PR Pipeline */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Pattern Recognition Pipeline
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {['Dataset (Pima)', 'Zero Preprocessing', 'StandardScaler', 'Decision Boundaries', 'Classification', 'Confusion Matrix', 'Academic Metrics'].map((tag, idx) => (
              <span key={idx} className="badge badge-teal" style={{ fontSize: '0.6875rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Course Info */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Academic Subject
          </h4>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.6 }}>
            Subject: <strong>Pattern Recognition (PR)</strong><br />
            Dataset: Pima Indians Diabetes Dataset (768 Samples)<br />
            Models: Logistic Regression, KNN, Decision Tree, SVM
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '2rem auto 0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        <div>
          &copy; {new Date().getFullYear()} College Academic Pattern Recognition Project.
        </div>
        <div>
          Educational & Academic Demonstration Purposes Only
        </div>
      </div>
    </footer>
  );
}
