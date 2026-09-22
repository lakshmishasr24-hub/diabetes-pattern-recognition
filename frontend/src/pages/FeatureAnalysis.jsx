import React, { useEffect, useState } from 'react';
import { Sliders, BarChart2, Info, AlertCircle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { getCorrelationMatrix, getFeatureImportance } from '../services/api';

const FEATURE_NAMES = [
  'Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
  'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age', 'Outcome'
];

export default function FeatureAnalysis() {
  const [corrMatrix, setCorrMatrix] = useState(null);
  const [importance, setImportance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [corrRes, impRes] = await Promise.all([
          getCorrelationMatrix(),
          getFeatureImportance()
        ]);
        setCorrMatrix(corrRes);
        setImportance(impRes);
      } catch (err) {
        console.error("Error fetching feature analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#14b8a6', fontWeight: 600 }}>Calculating Feature Importance & Correlation Heatmap...</p>
      </div>
    );
  }

  // Format Decision Tree Feature Importance data for Recharts
  const dtImportanceData = importance?.decision_tree_importance 
    ? Object.entries(importance.decision_tree_importance)
        .map(([feature, val]) => ({ feature, importance: roundPct(val) }))
        .sort((a, b) => b.importance - a.importance)
    : [];

  // Format Logistic Regression Coefficients
  const lrCoefData = importance?.logistic_regression_coefficients
    ? Object.entries(importance.logistic_regression_coefficients)
        .map(([feature, coef]) => ({ feature, coefficient: coef }))
        .sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))
    : [];

  function roundPct(val) {
    return roundToTwo(val * 100);
  }
  function roundToTwo(num) {
    return Math.round(num * 100) / 100;
  }

  // Helper color function for correlation matrix values (-1 to +1)
  const getCorrColor = (val) => {
    if (val === 1) return 'rgba(20, 184, 166, 0.4)';
    if (val > 0.4) return 'rgba(244, 63, 94, 0.35)';
    if (val > 0.2) return 'rgba(244, 63, 94, 0.2)';
    if (val > 0) return 'rgba(20, 184, 166, 0.15)';
    if (val < -0.2) return 'rgba(99, 102, 241, 0.3)';
    return 'rgba(255, 255, 255, 0.05)';
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
          <Sliders size={14} /> Pattern Importance
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
          Feature Importance & Correlation Analysis
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#9ca3af', maxWidth: '700px', margin: '0.5rem auto 0 auto' }}>
          Explore feature weights, decision tree information gain splits, and Pearson correlation coefficients across clinical parameters.
        </p>
      </div>

      {/* Feature Importance Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Decision Tree Feature Importance */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} color="#14b8a6" /> Decision Tree Feature Importance (%)
          </h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={dtImportanceData} margin={{ left: 30, right: 20 }}>
                <XAxis type="number" stroke="#9ca3af" unit="%" fontSize={11} />
                <YAxis dataKey="feature" type="category" stroke="#9ca3af" fontSize={11} width={100} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} formatter={(val) => [`${val}%`, 'Importance']} />
                <Bar dataKey="importance" fill="#14b8a6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginTop: '0.5rem' }}>
            Calculated from Gini impurity reduction during node splits in Decision Tree training.
          </p>
        </div>

        {/* Logistic Regression Feature Weights */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} color="#6366f1" /> Logistic Regression Coefficients (Standardized)
          </h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={lrCoefData} margin={{ left: 30, right: 20 }}>
                <XAxis type="number" stroke="#9ca3af" fontSize={11} />
                <YAxis dataKey="feature" type="category" stroke="#9ca3af" fontSize={11} width={100} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="coefficient" radius={[0, 4, 4, 0]}>
                  {lrCoefData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.coefficient >= 0 ? '#6366f1' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginTop: '0.5rem' }}>
            Positive coefficients increase log-odds of diabetes; negative coefficients decrease log-odds.
          </p>
        </div>

      </div>

      {/* Feature Correlation Matrix Heatmap */}
      <div className="glass-card" style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={18} color="#10b981" /> Pearson Feature Correlation Matrix Heatmap
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginBottom: '1.5rem' }}>
          Degree of linear association between pairs of features. Values close to +1.0 indicate strong positive correlation with Diabetes Outcome.
        </p>

        {corrMatrix && (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table" style={{ fontSize: '0.75rem', textAlign: 'center' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Feature</th>
                  {FEATURE_NAMES.map((f, i) => (
                    <th key={i} style={{ textAlign: 'center', padding: '0.5rem' }}>{f.substring(0, 6)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_NAMES.map((f1, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700, color: '#ffffff', textAlign: 'left', padding: '0.5rem' }}>{f1}</td>
                    {FEATURE_NAMES.map((f2, j) => {
                      const val = corrMatrix[f1]?.[f2] ?? 0;
                      return (
                        <td 
                          key={j} 
                          style={{
                            background: getCorrColor(val),
                            color: Math.abs(val) > 0.3 ? '#ffffff' : '#9ca3af',
                            fontWeight: f1 === f2 ? 800 : Math.abs(val) > 0.3 ? 700 : 400,
                            padding: '0.5rem'
                          }}
                        >
                          {val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#f59e0b', fontStyle: 'italic' }}>
          <AlertCircle size={14} /> Note: Correlation measures linear association strength and does NOT imply direct causal relationship.
        </div>
      </div>
    </div>
  );
}
