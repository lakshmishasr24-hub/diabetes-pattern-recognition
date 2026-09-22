import React, { useEffect, useState } from 'react';
import { Grid2X2, Cpu, Info, CheckCircle2, XCircle } from 'lucide-react';
import { getConfusionMatrix } from '../services/api';

const MODELS = [
  { key: 'decision_tree', name: 'Decision Tree' },
  { key: 'knn', name: 'K-Nearest Neighbors (KNN)' },
  { key: 'svm', name: 'Support Vector Machine (SVM)' },
  { key: 'logistic_regression', name: 'Logistic Regression' }
];

export default function ConfusionMatrixPage() {
  const [selectedModel, setSelectedModel] = useState('decision_tree');
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatrix = async () => {
      setLoading(true);
      try {
        const res = await getConfusionMatrix(selectedModel);
        setMatrixData(res);
      } catch (err) {
        console.error("Error loading confusion matrix:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatrix();
  }, [selectedModel]);

  const cm = matrixData?.confusion_matrix;

  return (
    <div className="page-container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
          <Grid2X2 size={14} /> Classification Diagnostics
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
          Dynamic Confusion Matrix Analysis
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#9ca3af', maxWidth: '700px', margin: '0.5rem auto 0 auto' }}>
          Evaluate classification error types across positive (Diabetic) and negative (Non-Diabetic) test observations.
        </p>
      </div>

      {/* Model Selector Bar */}
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto 2.5rem auto', padding: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label">
            <span>Select Model for Confusion Matrix Inspection</span>
            <span className="badge badge-indigo">{selectedModel}</span>
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="form-input"
            style={{ background: '#1e293b', cursor: 'pointer', fontSize: '1rem' }}
          >
            {MODELS.map(m => (
              <option key={m.key} value={m.key}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#14b8a6' }}>Loading Confusion Matrix...</p>
        </div>
      ) : cm ? (
        <div style={{ maxWidth: '950px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            
            {/* 2x2 Confusion Matrix Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', textAlign: 'center' }}>
                {matrixData.model_name} Matrix (2x2 Grid)
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr',
                gap: '8px',
                textAlign: 'center',
                fontSize: '0.875rem'
              }}>
                {/* Header Row */}
                <div style={{ fontWeight: 700, color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Actual \ Pred</div>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.5rem', borderRadius: '6px', color: '#10b981', fontWeight: 700 }}>
                  Pred: Non-Diabetic (0)
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.5rem', borderRadius: '6px', color: '#f43f5e', fontWeight: 700 }}>
                  Pred: Diabetic (1)
                </div>

                {/* Actual Non-Diabetic Row */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.5rem', borderRadius: '6px', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Actual: Non-Diabetic (0)
                </div>
                
                {/* True Negative (TN) */}
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '1.25rem',
                  borderRadius: '10px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'block' }}>TRUE NEGATIVE (TN)</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{cm.tn}</div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Correctly Non-Diabetic</span>
                </div>

                {/* False Positive (FP) */}
                <div style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '1.25rem',
                  borderRadius: '10px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>FALSE POSITIVE (FP)</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{cm.fp}</div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Type I Error</span>
                </div>

                {/* Actual Diabetic Row */}
                <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '0.5rem', borderRadius: '6px', color: '#f43f5e', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Actual: Diabetic (1)
                </div>

                {/* False Negative (FN) */}
                <div style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  padding: '1.25rem',
                  borderRadius: '10px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700, display: 'block' }}>FALSE NEGATIVE (FN)</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{cm.fn}</div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Type II Error</span>
                </div>

                {/* True Positive (TP) */}
                <div style={{
                  background: 'rgba(20, 184, 166, 0.15)',
                  border: '1px solid rgba(20, 184, 166, 0.4)',
                  padding: '1.25rem',
                  borderRadius: '10px'
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: 700, display: 'block' }}>TRUE POSITIVE (TP)</span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>{cm.tp}</div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Correctly Diabetic</span>
                </div>
              </div>
            </div>

            {/* Derived Performance Metrics Breakdown Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>
                Derived Model Performance
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Overall Accuracy</span>
                  <strong style={{ fontSize: '1.25rem', color: '#14b8a6' }}>{matrixData.accuracy_pct}%</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Precision (Exactness)</span>
                  <strong style={{ fontSize: '1.25rem', color: '#6366f1' }}>{matrixData.precision_pct}%</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Recall / Sensitivity</span>
                  <strong style={{ fontSize: '1.25rem', color: '#10b981' }}>{matrixData.recall_pct}%</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>F1 Score</span>
                  <strong style={{ fontSize: '1.25rem', color: '#f59e0b' }}>{matrixData.f1_score_pct}%</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Specificity (True Negative Rate)</span>
                  <strong style={{ fontSize: '1.25rem', color: '#38bdf8' }}>{(matrixData.specificity * 100).toFixed(2)}%</strong>
                </div>

              </div>
            </div>

          </div>

          {/* Academic Formula Explanation */}
          <div className="glass-card">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} color="#14b8a6" /> Confusion Matrix Calculation Formulas
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem', fontSize: '0.8125rem', color: '#9ca3af' }}>
              <div>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>Sensitivity (Recall)</strong>
                <code>TP / (TP + FN) = {cm.tp} / ({cm.tp} + {cm.fn})</code>
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>Specificity</strong>
                <code>TN / (TN + FP) = {cm.tn} / ({cm.tn} + {cm.fp})</code>
              </div>
              <div>
                <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>Positive Predictive Value</strong>
                <code>TP / (TP + FP) = {cm.tp} / ({cm.tp} + {cm.fp})</code>
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
}
