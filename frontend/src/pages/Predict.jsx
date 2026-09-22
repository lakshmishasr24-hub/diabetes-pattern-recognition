import React, { useState } from 'react';
import { 
  Stethoscope, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle, 
  ShieldAlert, 
  Activity,
  Cpu,
  BarChart2,
  Info
} from 'lucide-react';
import { predictDiabetes } from '../services/api';

const DEFAULT_FORM = {
  pregnancies: 2,
  glucose: 120,
  bloodPressure: 70,
  skinThickness: 20,
  insulin: 79,
  bmi: 28.5,
  diabetesPedigreeFunction: 0.35,
  age: 35,
  model: 'decision_tree'
};

const SAMPLE_PRESETS = [
  {
    name: 'Normal Healthy Sample',
    data: { pregnancies: 1, glucose: 89, bloodPressure: 66, skinThickness: 23, insulin: 94, bmi: 22.1, diabetesPedigreeFunction: 0.167, age: 21, model: 'decision_tree' }
  },
  {
    name: 'Moderate Risk Sample',
    data: { pregnancies: 3, glucose: 135, bloodPressure: 76, skinThickness: 28, insulin: 120, bmi: 31.2, diabetesPedigreeFunction: 0.45, age: 42, model: 'decision_tree' }
  },
  {
    name: 'High Risk Sample',
    data: { pregnancies: 6, glucose: 168, bloodPressure: 82, skinThickness: 35, insulin: 220, bmi: 38.6, diabetesPedigreeFunction: 0.827, age: 52, model: 'decision_tree' }
  }
];

export default function Predict() {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'model' ? value : value === '' ? '' : Number(value)
    }));
  };

  const handlePresetSelect = (presetData) => {
    setFormData(presetData);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Frontend validation
    for (const [key, val] of Object.entries(formData)) {
      if (key !== 'model' && (val === '' || val < 0)) {
        setError(`Please enter a valid non-negative number for ${key}.`);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await predictDiabetes(formData);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to contact prediction API backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setFormData(DEFAULT_FORM);
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
          <Stethoscope size={14} /> Inference Engine
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
          Diabetes Risk Prediction
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#9ca3af', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
          Input patient clinical parameters below. The backend preprocesses data using the exact same StandardScaler pipeline and fits it to your selected Pattern Recognition classifier.
        </p>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.8125rem', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
          Quick Sample Presets:
        </span>
        {SAMPLE_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePresetSelect(preset.data)}
            style={{
              fontSize: '0.75rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: '#14b8a6',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#f43f5e'
        }}>
          <AlertCircle size={20} />
          <span style={{ fontSize: '0.875rem' }}>{error}</span>
        </div>
      )}

      {/* Main Grid: Form on left, Result on right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: result ? 'repeat(auto-fit, minmax(360px, 1fr))' : '1fr',
        maxWidth: result ? '1200px' : '750px',
        margin: '0 auto',
        gap: '2rem'
      }}>
        {/* Input Form Card */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="#14b8a6" /> Clinical Input Parameters
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              
              <div className="form-group">
                <label className="form-label">
                  Pregnancies <span className="form-unit">count</span>
                </label>
                <input 
                  type="number"
                  name="pregnancies"
                  value={formData.pregnancies}
                  onChange={handleChange}
                  min="0"
                  max="20"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Glucose Concentration <span className="form-unit">mg/dL</span>
                </label>
                <input 
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  min="0"
                  max="400"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Blood Pressure <span className="form-unit">mmHg</span>
                </label>
                <input 
                  type="number"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  min="0"
                  max="250"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Skin Thickness <span className="form-unit">mm</span>
                </label>
                <input 
                  type="number"
                  name="skinThickness"
                  value={formData.skinThickness}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  2-Hour Serum Insulin <span className="form-unit">mu U/ml</span>
                </label>
                <input 
                  type="number"
                  name="insulin"
                  value={formData.insulin}
                  onChange={handleChange}
                  min="0"
                  max="900"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Body Mass Index (BMI) <span className="form-unit">kg/m²</span>
                </label>
                <input 
                  type="number"
                  name="bmi"
                  step="0.1"
                  value={formData.bmi}
                  onChange={handleChange}
                  min="0"
                  max="90"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Diabetes Pedigree Function <span className="form-unit">score</span>
                </label>
                <input 
                  type="number"
                  name="diabetesPedigreeFunction"
                  step="0.001"
                  value={formData.diabetesPedigreeFunction}
                  onChange={handleChange}
                  min="0"
                  max="3"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Age <span className="form-unit">years</span>
                </label>
                <input 
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  className="form-input"
                  required
                />
              </div>

            </div>

            {/* Model Selector */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label">
                Select Pattern Recognition Algorithm
              </label>
              <select 
                name="model" 
                value={formData.model} 
                onChange={handleChange}
                className="form-input"
                style={{ background: '#1e293b', cursor: 'pointer' }}
              >
                <option value="decision_tree">Decision Tree (Recommended)</option>
                <option value="knn">K-Nearest Neighbors (KNN)</option>
                <option value="svm">Support Vector Machine (SVM)</option>
                <option value="logistic_regression">Logistic Regression</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ flex: 1, padding: '0.875rem' }}
              >
                {loading ? 'Processing Pipeline...' : 'Predict Diabetes Risk'}
              </button>
              {result && (
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleReset}
                  style={{ padding: '0.875rem' }}
                >
                  <RotateCcw size={18} /> Reset
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Prediction Result Panel */}
        {result && (
          <div className="glass-card animate-fade-in" style={{
            border: result.prediction === 'Diabetic' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span className="badge badge-teal">
                <Cpu size={14} /> Model Inference Complete
              </span>
              <span className="badge badge-indigo">
                {result.selected_model}
              </span>
            </div>

            {/* Outcome Highlight Box */}
            <div style={{
              background: result.prediction === 'Diabetic' 
                ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)' 
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)',
              borderRadius: '16px',
              padding: '1.75rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              border: `1px solid ${result.prediction === 'Diabetic' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: result.prediction === 'Diabetic' ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto'
              }}>
                {result.prediction === 'Diabetic' ? (
                  <ShieldAlert size={32} color="#f43f5e" />
                ) : (
                  <CheckCircle size={32} color="#10b981" />
                )}
              </div>

              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Classification Result
              </span>

              <h2 style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: result.prediction === 'Diabetic' ? '#f43f5e' : '#10b981',
                margin: '0.25rem 0'
              }}>
                {result.prediction}
              </h2>

              <div style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.25)', padding: '0.375rem 0.875rem', borderRadius: '20px' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Model-estimated probability:</span>
                <strong style={{ fontSize: '1rem', color: '#ffffff' }}>{result.probability_pct}%</strong>
              </div>
            </div>

            {/* Confidence & Details Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>Confidence Indicator</span>
                <strong style={{ fontSize: '1rem', color: '#ffffff' }}>{result.confidence_level}</strong>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block' }}>Preprocessing</span>
                <strong style={{ fontSize: '1rem', color: '#14b8a6' }}>StandardScaler</strong>
              </div>
            </div>

            {/* Multi-Model Comparison Card */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart2 size={16} color="#14b8a6" /> Classifiers Cross-Comparison
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.values(result.all_models).map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <span style={{ color: m.model_key === result.selected_model_key ? '#14b8a6' : '#9ca3af', fontWeight: m.model_key === result.selected_model_key ? 700 : 400 }}>
                      {m.model_name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: m.prediction === 'Diabetic' ? '#f43f5e' : '#10b981', fontWeight: 600 }}>
                        {m.prediction}
                      </span>
                      <span style={{ color: '#6b7280', fontSize: '0.75rem', width: '50px', textAlign: 'right' }}>
                        {m.probability_pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Notice */}
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.5, background: 'rgba(255, 255, 255, 0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              {result.disclaimer}
            </p>

            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleReset}
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Analyze Another Person
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
