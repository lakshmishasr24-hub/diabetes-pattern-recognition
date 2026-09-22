import React, { useState } from 'react';
import { 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  GitCommit, 
  Layers, 
  Target, 
  Sliders, 
  CheckCircle2, 
  XCircle,
  BookOpen
} from 'lucide-react';

const ALGORITHMS = [
  {
    key: 'logistic_regression',
    name: 'Logistic Regression',
    category: 'Linear Probabilistic Classifier',
    concept: 'Estimates the probability that an observation belongs to the diabetic class using a logistic sigmoid function mapped to a linear combination of clinical input features.',
    howItWorks: 'Calculates a weighted linear sum of input features z = w^T x + b, then passes z through the sigmoid function σ(z) = 1 / (1 + e^-z). If σ(z) ≥ 0.5, the observation is classified as Diabetic.',
    whyUsed: 'Provides an interpretable linear baseline and direct output probability estimates for clinical risk factors like Glucose and BMI.',
    advantages: [
      'Fast, simple, and computationally efficient.',
      'Outputs calibrated model-estimated class probabilities.',
      'Resistant to overfitting on small datasets when regularized.'
    ],
    limitations: [
      'Assumes linear decision boundary between classes.',
      'Struggles with complex feature interactions without explicit feature engineering.',
      'Sensitive to outliers and co-linearity.'
    ]
  },
  {
    key: 'knn',
    name: 'K-Nearest Neighbors (KNN)',
    category: 'Instance-Based Non-Parametric Classifier',
    concept: 'Classifies an unlabelled patient sample based on the majority outcome class among its K nearest clinical neighbors in Euclidean feature space.',
    howItWorks: 'Computes Euclidean distance d(x, y) = √(∑(x_i - y_i)²) between the target vector and all training points, identifies the K (e.g. K=5) closest samples, and assigns the majority class.',
    whyUsed: 'Captures non-linear local clusters in health data where individuals with similar glucose, age, and BMI profiles exhibit similar disease outcomes.',
    advantages: [
      'No training phase required (lazy learning).',
      'Naturally models non-linear decision boundaries.',
      'Simple intuitive geometric rationale.'
    ],
    limitations: [
      'Computationally expensive during inference on large datasets.',
      'Highly sensitive to feature scaling (requires StandardScaler).',
      'Degrades in high-dimensional feature space (curse of dimensionality).'
    ]
  },
  {
    key: 'decision_tree',
    name: 'Decision Tree Classifier',
    category: 'Non-Linear Rule-Based Classifier',
    concept: 'Recursively partitions feature space into hierarchical decision rules that maximize Information Gain or minimize Gini Impurity at each split.',
    howItWorks: 'Evaluates feature split thresholds (e.g. Glucose > 127.5, BMI > 29.9) to split heterogeneous nodes into homogenous child nodes, forming an interpretable tree structure.',
    whyUsed: 'Mimics clinical diagnostic decision algorithms used by doctors (e.g., checking glucose threshold first, then checking age or BMI).',
    advantages: [
      'High interpretability; decision rules can be visualized directly.',
      'Handles non-linear relationships and feature interactions automatically.',
      'Invariant to monotonic feature scaling.'
    ],
    limitations: [
      'Prone to overfitting training data if depth is not constrained (max_depth).',
      'Can be unstable; small data variations may change tree structure.',
      'Orthogonal decision splits can struggle with smooth diagonal boundaries.'
    ]
  },
  {
    key: 'svm',
    name: 'Support Vector Machine (SVM)',
    category: 'Kernel-Based Maximum Margin Classifier',
    concept: 'Finds an optimal hyperplane in a high-dimensional kernel space that maximizes the margin of separation between diabetic and non-diabetic support vectors.',
    howItWorks: 'Maps non-linearly separable clinical features into higher dimensions using an RBF (Radial Basis Function) kernel K(x, x\') = exp(-γ||x - x\'||²), constructing a maximum-margin decision surface.',
    whyUsed: 'Provides exceptional classification power on complex biomedical datasets where decision boundaries are non-linear and overlap.',
    advantages: [
      'Effective in high-dimensional spaces with clear margin maximization.',
      'Memory efficient because it only relies on a subset of support vectors.',
      'Robust against overfitting with proper regularization (C parameter).'
    ],
    limitations: [
      'Black-box nature; decision boundaries are harder to interpret intuitively.',
      'Requires feature scaling and sensitive hyperparameter tuning (C, gamma).',
      'Does not output direct probabilities natively (requires Platt scaling).'
    ]
  }
];

export default function PatternRecognition() {
  const [expandedAlgo, setExpandedAlgo] = useState('logistic_regression');

  return (
    <div className="page-container animate-fade-in">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
          <BrainCircuit size={14} /> Pattern Recognition Theory
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
          Pattern Recognition Concepts & Algorithms
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#9ca3af', maxWidth: '700px', margin: '0.5rem auto 0 auto' }}>
          Educational breakdown of Pattern Recognition principles, feature representation, scaling impact, and comparative classifier mechanics.
        </p>
      </div>

      {/* Core Concept Banner */}
      <div className="glass-card" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} color="#14b8a6" /> What is Pattern Recognition (PR)?
        </h2>
        <p style={{ fontSize: '0.9375rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          <strong>Pattern Recognition</strong> is the branch of computer science and machine learning concerned with the automatic discovery of regularities and structures in raw data, assigning observations to predefined classes based on feature measurements.
        </p>

        {/* PR System Flow */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#14b8a6', fontWeight: 700, display: 'block' }}>1. INPUT</span>
            <strong style={{ fontSize: '0.9375rem', color: '#ffffff' }}>Feature Vector X</strong>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>[Glucose, BMI, Age, Insulin...]</p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 700, display: 'block' }}>2. PATTERN</span>
            <strong style={{ fontSize: '0.9375rem', color: '#ffffff' }}>Decision Boundary</strong>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Feature Co-relations & Clusters</p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'block' }}>3. CLASSIFIER</span>
            <strong style={{ fontSize: '0.9375rem', color: '#ffffff' }}>ML Model f(X)</strong>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Logistic, KNN, Tree, SVM</p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700, display: 'block' }}>4. OUTPUT</span>
            <strong style={{ fontSize: '0.9375rem', color: '#ffffff' }}>Predicted Class Y</strong>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>Diabetic (1) / Non-Diabetic (0)</p>
          </div>
        </div>
      </div>

      {/* PR Key Fundamentals Grid */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>
        Key Academic Concepts in Pattern Recognition
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(20, 184, 166, 0.15)' }}>
              <Sliders size={20} color="#14b8a6" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Feature Representation</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.6 }}>
            Each individual is represented as an 8-dimensional numerical feature vector X = [x₁, x₂, ..., x₈] in real coordinate space ℝ⁸. Selecting informative features directly improves classification separability.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)' }}>
              <Layers size={20} color="#6366f1" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Feature Scaling (StandardScaler)</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.6 }}>
            Standardization z = (x - μ) / σ transforms features to mean 0 and variance 1. Essential for distance-based models (KNN, SVM, LR) to prevent high-magnitude features (Insulin) from dominating small-magnitude features (Pedigree Function).
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)' }}>
              <GitCommit size={20} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Decision Boundaries</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#9ca3af', lineHeight: 1.6 }}>
            The geometric hypersurface partitioning feature space into class regions. Linear models construct hyperplanes, while Non-Linear models (KNN, Decision Trees, SVM RBF) form flexible curved boundaries.
          </p>
        </div>
      </div>

      {/* Expandable Classifier Cards */}
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>
        Pattern Recognition Classification Algorithms
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ALGORITHMS.map((algo) => {
          const isExpanded = expandedAlgo === algo.key;
          return (
            <div 
              key={algo.key} 
              className="glass-card" 
              style={{
                border: isExpanded ? '1px solid rgba(20, 184, 166, 0.4)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setExpandedAlgo(isExpanded ? null : algo.key)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff' }}>
                      {algo.name}
                    </h3>
                    <span className="badge badge-teal" style={{ fontSize: '0.6875rem' }}>
                      {algo.category}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                    {algo.concept}
                  </p>
                </div>
                <div style={{ padding: '0.25rem' }}>
                  {isExpanded ? <ChevronUp size={20} color="#14b8a6" /> : <ChevronDown size={20} color="#9ca3af" />}
                </div>
              </div>

              {isExpanded && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.25rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#14b8a6', marginBottom: '0.375rem' }}>
                        How It Works
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: '#d1d5db', lineHeight: 1.6 }}>
                        {algo.howItWorks}
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.375rem' }}>
                        Suitability for Diabetes Classification
                      </h4>
                      <p style={{ fontSize: '0.8125rem', color: '#d1d5db', lineHeight: 1.6 }}>
                        {algo.whyUsed}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    {/* Advantages */}
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <CheckCircle2 size={16} /> Key Advantages
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.78125rem', color: '#9ca3af', lineHeight: 1.5 }}>
                        {algo.advantages.map((adv, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>{adv}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Limitations */}
                    <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                      <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <XCircle size={16} /> Limitations
                      </h4>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.78125rem', color: '#9ca3af', lineHeight: 1.5 }}>
                        {algo.limitations.map((lim, idx) => (
                          <li key={idx} style={{ marginBottom: '0.25rem' }}>{lim}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
