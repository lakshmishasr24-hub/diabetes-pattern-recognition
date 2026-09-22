import React, { useEffect, useState } from 'react';
import { 
  Database, 
  Search, 
  BarChart3, 
  PieChart as PieIcon, 
  Sliders, 
  Info,
  AlertCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { getDatasetAnalysis, getDatasetSummary } from '../services/api';

const COLORS = ['#10b981', '#f43f5e'];

export default function DatasetAnalysis() {
  const [dataAnalysis, setDataAnalysis] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeChartFeature, setActiveChartFeature] = useState('Glucose');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analysisRes, summaryRes] = await Promise.all([
          getDatasetAnalysis(),
          getDatasetSummary()
        ]);
        setDataAnalysis(analysisRes);
        setSummary(summaryRes);
      } catch (err) {
        console.error("Failed to load dataset analysis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: '#14b8a6', fontWeight: 600 }}>Loading Pima Indians Dataset Analytics...</p>
      </div>
    );
  }

  const classPieData = summary ? [
    { name: 'Non-Diabetic (0)', value: summary.class_distribution['Non-Diabetic'] },
    { name: 'Diabetic (1)', value: summary.class_distribution['Diabetic'] }
  ] : [];

  const filteredSamples = dataAnalysis?.samples.filter(sample => {
    if (!searchTerm) return true;
    return Object.values(sample).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  const currentHistogram = dataAnalysis?.histograms[activeChartFeature] || [];

  return (
    <div className="page-container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
          <Database size={14} /> Exploratory Data Analysis
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
          Pima Indians Diabetes Dataset Analysis
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#9ca3af', maxWidth: '700px', margin: '0.5rem auto 0 auto' }}>
          Comprehensive evaluation of dataset records, feature distributions, zero-value counts, and class imbalance metrics.
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card">
          <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Total Observations</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
            {summary?.total_samples} Rows
          </div>
          <span style={{ fontSize: '0.75rem', color: '#14b8a6' }}>8 Numerical Features + Outcome</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Non-Diabetic Controls</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>
            {summary?.class_distribution['Non-Diabetic']} (65.1%)
          </div>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Class 0 Benchmark</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Diabetic Positive Cases</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f43f5e', marginTop: '0.25rem' }}>
            {summary?.class_distribution['Diabetic']} (34.9%)
          </div>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Class 1 Benchmark</span>
        </div>

        <div className="glass-card">
          <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>Insulin Zero Values</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>
            {summary?.zero_counts['Insulin']} Rows
          </div>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Handled by Median Imputer</span>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Class Imbalance Pie Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieIcon size={18} color="#14b8a6" /> Target Outcome Class Distribution
          </h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                >
                  {classPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#1e293b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginTop: '0.5rem' }}>
            The dataset exhibits moderate class imbalance (65:35 ratio). Stratified splitting ensures fair test split representation.
          </p>
        </div>

        {/* Feature Distribution Histogram */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="#6366f1" /> Feature Distribution Histogram
            </h3>
            <select
              value={activeChartFeature}
              onChange={(e) => setActiveChartFeature(e.target.value)}
              style={{
                background: '#1e293b',
                color: '#14b8a6',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.375rem 0.75rem',
                fontSize: '0.8125rem',
                cursor: 'pointer'
              }}
            >
              <option value="Glucose">Glucose</option>
              <option value="BMI">BMI</option>
              <option value="Age">Age</option>
              <option value="BloodPressure">Blood Pressure</option>
              <option value="Insulin">Insulin</option>
              <option value="Pregnancies">Pregnancies</option>
            </select>
          </div>

          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentHistogram}>
                <XAxis dataKey="range" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center', marginTop: '0.5rem' }}>
            Histogram distribution for feature <strong>{activeChartFeature}</strong> across 10 value bins.
          </p>
        </div>
      </div>

      {/* Feature Statistical Overview Table */}
      <div className="glass-card" style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={18} color="#14b8a6" /> Feature Summary & Zero-Value Metrics
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Feature Name</th>
                <th>Unit</th>
                <th>Mean ± Std</th>
                <th>Median</th>
                <th>Min - Max</th>
                <th>Zero Count (Invalid)</th>
                <th>Treatment</th>
              </tr>
            </thead>
            <tbody>
              {dataAnalysis?.feature_stats && Object.entries(dataAnalysis.feature_stats).map(([feat, stat], idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{feat}</td>
                  <td style={{ color: '#14b8a6', fontFamily: 'var(--font-mono)' }}>{stat.unit}</td>
                  <td>{stat.mean} ± {stat.std}</td>
                  <td>{stat.median}</td>
                  <td>{stat.min} - {stat.max}</td>
                  <td style={{ color: stat.zero_count > 0 ? '#f59e0b' : '#9ca3af', fontWeight: stat.zero_count > 0 ? 600 : 400 }}>
                    {stat.zero_count} rows
                  </td>
                  <td>
                    {stat.zero_count > 0 ? (
                      <span className="badge badge-amber" style={{ fontSize: '0.6875rem' }}>Median Imputed</span>
                    ) : (
                      <span className="badge badge-teal" style={{ fontSize: '0.6875rem' }}>Valid Range</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} color="#10b981" /> Dataset Preview (Sample Records)
          </h3>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input 
              type="text"
              placeholder="Search values..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.25rem', padding: '0.4rem 0.75rem 0.4rem 2.25rem', fontSize: '0.8125rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Pregnancies</th>
                <th>Glucose</th>
                <th>BloodPressure</th>
                <th>SkinThickness</th>
                <th>Insulin</th>
                <th>BMI</th>
                <th>Pedigree</th>
                <th>Age</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ color: '#6b7280', fontSize: '0.75rem' }}>{idx + 1}</td>
                  <td>{row.Pregnancies}</td>
                  <td style={{ fontWeight: row.Glucose > 140 ? 700 : 400, color: row.Glucose > 140 ? '#f43f5e' : 'inherit' }}>{row.Glucose}</td>
                  <td>{row.BloodPressure}</td>
                  <td>{row.SkinThickness}</td>
                  <td>{row.Insulin}</td>
                  <td style={{ fontWeight: row.BMI > 30 ? 700 : 400 }}>{row.BMI}</td>
                  <td>{row.DiabetesPedigreeFunction}</td>
                  <td>{row.Age}</td>
                  <td>
                    {row.Outcome === 1 ? (
                      <span className="badge badge-rose" style={{ fontSize: '0.6875rem' }}>Diabetic (1)</span>
                    ) : (
                      <span className="badge badge-emerald" style={{ fontSize: '0.6875rem' }}>Non-Diabetic (0)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
