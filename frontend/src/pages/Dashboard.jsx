import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Sliders, 
  Cpu, 
  Award, 
  ArrowRight, 
  FileText, 
  Activity, 
  CheckCircle2, 
  BrainCircuit, 
  BarChart, 
  Stethoscope 
} from 'lucide-react';
import { getDatasetSummary, getPerformance } from '../services/api';

export default function Dashboard({ setActiveTab }) {
  const [summary, setSummary] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumData, perfData] = await Promise.all([
          getDatasetSummary(),
          getPerformance()
        ]);
        setSummary(sumData);
        setPerformance(perfData.models);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Find best accuracy model dynamically
  let bestModelName = 'Decision Tree';
  let bestAccuracy = 75.97;
  if (performance) {
    let maxAcc = 0;
    Object.values(performance).forEach(m => {
      if (m.accuracy_pct > maxAcc) {
        maxAcc = m.accuracy_pct;
        bestModelName = m.name;
        bestAccuracy = m.accuracy_pct;
      }
    });
  }

  const workflowSteps = [
    { title: 'Clinical Data', desc: '8 Features (Glucose, Insulin, BMI, Age...)', icon: Database },
    { title: 'Preprocessing', desc: 'Zero Imputation & StandardScaler', icon: Sliders },
    { title: 'Feature Selection', desc: 'Correlation & Feature Importance', icon: BrainCircuit },
    { title: 'Pattern Recognition', desc: 'Supervised Learning Algorithms', icon: Cpu },
    { title: 'Classification', desc: 'Diabetic vs Non-Diabetic Prediction', icon: Stethoscope },
    { title: 'Performance Evaluation', desc: 'Accuracy, Precision, Recall, F1 Matrix', icon: BarChart }
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Hero Header */}
      <div style={{
        textAlign: 'center',
        padding: '2.5rem 1rem 3rem 1rem',
        maxWidth: '850px',
        margin: '0 auto'
      }}>
        <div className="badge badge-teal" style={{ marginBottom: '1rem', padding: '0.375rem 1rem' }}>
          <BrainCircuit size={14} /> Pattern Recognition College Project
        </div>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.2,
          marginBottom: '1rem',
          letterSpacing: '-0.02em'
        }}>
          Diabetes Risk <span style={{ color: '#14b8a6' }}>Pattern Recognition</span>
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#9ca3af',
          lineHeight: 1.6,
          marginBottom: '2rem'
        }}>
          Pattern Recognition Based Classification of Diabetic and Non-Diabetic Individuals Using Machine Learning Models
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            onClick={() => setActiveTab('predict')}
            style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
          >
            <Stethoscope size={20} /> Start Prediction
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => setActiveTab('performance')}
            style={{ fontSize: '1rem', padding: '0.875rem 1.75rem' }}
          >
            <BarChart size={20} /> View Performance Metrics
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '3rem'
      }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af' }}>Dataset Samples</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={20} color="#14b8a6" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {summary ? summary.total_samples : '768'}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            Pima Indians Clinical Records (80/20 train-test split)
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af' }}>Clinical Features</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={20} color="#6366f1" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {summary ? summary.num_features : '8'}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            Glucose, BMI, Age, Insulin, Blood Pressure, etc.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af' }}>ML Classifiers</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={20} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            4 Models
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            Logistic Regression, KNN, Decision Tree, SVM
          </p>
        </div>

        <div className="glass-card" style={{ border: '1px solid rgba(20, 184, 166, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af' }}>Best Test Accuracy</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#14b8a6' }}>
            {bestAccuracy}%
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
            Achieved by {bestModelName} (Evaluated on Test Split)
          </p>
        </div>
      </div>

      {/* System Explanation Banner */}
      <div className="glass-card" style={{ marginBottom: '3rem', padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(20, 184, 166, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Activity size={26} color="#14b8a6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
              System Overview & Academic Purpose
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#9ca3af', lineHeight: 1.7 }}>
              The system analyzes clinical parameters and identifies patterns associated with diabetes using supervised machine learning classification algorithms. By evaluating multiple classifiers—Logistic Regression, K-Nearest Neighbors, Decision Trees, and Support Vector Machines—this platform demonstrates how pattern recognition principles can be applied to complex biomedical data.
            </p>
          </div>
        </div>
      </div>

      {/* Pattern Recognition Workflow */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', textAlign: 'center' }}>
          Pattern Recognition Pipeline Workflow
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af', textAlign: 'center', marginBottom: '2rem' }}>
          Complete 6-stage end-to-end PR architecture from raw clinical input to model evaluation
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          position: 'relative'
        }}>
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="glass-card" style={{
                textAlign: 'center',
                padding: '1.25rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(20, 184, 166, 0.2)',
                  color: '#14b8a6',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem'
                }}>
                  0{idx + 1}
                </div>
                <Icon size={28} color="#14b8a6" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.375rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launch Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
        border: '1px solid rgba(20, 184, 166, 0.3)',
        padding: '2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
            Ready to test clinical pattern recognition?
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', maxWidth: '600px' }}>
            Enter patient parameters into the prediction module to observe how trained classifiers preprocess inputs and estimate diabetic risk probabilities.
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setActiveTab('predict')}
          style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
        >
          <Stethoscope size={20} /> Open Diabetes Predictor
        </button>
      </div>
    </div>
  );
}
