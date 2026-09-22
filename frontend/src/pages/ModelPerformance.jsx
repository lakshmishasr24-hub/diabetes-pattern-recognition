import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { getPerformance, triggerRetrain } from '../services/api';

export default function ModelPerformance() {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const res = await getPerformance();
      setPerformanceData(res.models);
    } catch (err) {
      console.error("Error fetching performance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    try {
      await triggerRetrain();
      await fetchPerformance();
    } catch (err) {
      alert("Retraining failed: " + err.message);
    } finally {
      setRetraining(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#14b8a6', fontWeight: 600 }}>Calculating Model Performance Metrics from Dataset...</p>
      </div>
    );
  }

  const chartData = performanceData ? Object.values(performanceData).map(m => ({
    name: m.name,
    Accuracy: m.accuracy_pct,
    Precision: m.precision_pct,
    Recall: m.recall_pct,
    F1_Score: m.f1_score_pct
  })) : [];

  return (
    <div className="page-container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
          <BarChart3 size={14} /> Empirical Evaluation
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
          Model Performance & Metric Comparison
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#9ca3af', maxWidth: '700px', margin: '0.5rem auto 0 auto' }}>
          Evaluated on 154 test set observations (20% holdout split, stratified, random_state=42). All metrics are programmatically calculated directly from trained model predictions.
        </p>
      </div>

      {/* Metric Definitions Header Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#14b8a6' }}>Accuracy</h3>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>(TP+TN)/Total</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#d1d5db', lineHeight: 1.5 }}>
            Percentage of total test predictions that were correctly classified (both diabetic and non-diabetic).
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#6366f1' }}>Precision</h3>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>TP/(TP+FP)</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#d1d5db', lineHeight: 1.5 }}>
            Of all individuals predicted as diabetic by the model, how many were actually diabetic.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#10b981' }}>Recall (Sensitivity)</h3>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>TP/(TP+FN)</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#d1d5db', lineHeight: 1.5 }}>
            Of all actual diabetic cases in the test set, how many were correctly detected by the model.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f59e0b' }}>F1 Score</h3>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>2*(P*R)/(P+R)</span>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#d1d5db', lineHeight: 1.5 }}>
            Harmonic mean of precision and recall. Provides a balanced metric for imbalanced clinical data.
          </p>
        </div>

      </div>

      {/* Comparative Grouped Bar Chart */}
      <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="#14b8a6" /> Model Performance Metric Comparison
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Visualizing metrics side-by-side across all 4 trained classifiers</span>
          </div>
          <button 
            onClick={handleRetrain}
            className="btn-secondary"
            disabled={retraining}
            style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}
          >
            <RefreshCw size={14} className={retraining ? 'animate-spin' : ''} /> {retraining ? 'Retraining...' : 'Trigger Retrain'}
          </button>
        </div>

        <div style={{ height: '360px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" domain={[0, 100]} unit="%" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} 
                formatter={(val) => [`${val}%`]}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Accuracy" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Precision" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Recall" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="F1_Score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Benchmark Metrics Table */}
      <div className="glass-card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
          Empirical Metric Benchmark Table
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Classifier Model</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall (Sensitivity)</th>
                <th>F1 Score</th>
                <th>Specificity</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {performanceData && Object.values(performanceData).map((m, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{m.name}</td>
                  <td style={{ fontWeight: 700, color: '#14b8a6' }}>{m.accuracy_pct}%</td>
                  <td>{m.precision_pct}%</td>
                  <td>{m.recall_pct}%</td>
                  <td style={{ fontWeight: 600, color: '#f59e0b' }}>{m.f1_score_pct}%</td>
                  <td>{(m.specificity * 100).toFixed(2)}%</td>
                  <td>
                    <span className="badge badge-indigo" style={{ fontSize: '0.6875rem' }}>{m.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Objective Evaluation Synthesis */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)', border: '1px solid rgba(20, 184, 166, 0.3)', padding: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <Info size={24} color="#14b8a6" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.375rem' }}>
              Academic Performance Synthesis & Metric Trade-Offs
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.6 }}>
              Model performance varies across evaluation metrics. While <strong>Decision Tree</strong> achieves the highest overall test accuracy ({performanceData?.decision_tree?.accuracy_pct}%) and recall ({performanceData?.decision_tree?.recall_pct}%), <strong>KNN</strong> ({performanceData?.knn?.precision_pct}%) and <strong>SVM</strong> ({performanceData?.svm?.precision_pct}%) exhibit higher precision. In clinical screening, higher <em>Recall</em> is often prioritized to minimize false negatives (unidentified diabetic individuals).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
