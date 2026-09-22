import os
import json
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC

from preprocessing import DataPreprocessor, FEATURE_NAMES, ZERO_INVALID_FEATURES
from evaluation import compute_model_metrics

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'diabetes.csv')
MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

def train_and_evaluate_all():
    os.makedirs(MODELS_DIR, exist_ok=True)

    # 1. Load Dataset
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Dataset file not found at {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    
    # Dataset statistics
    total_samples = len(df)
    non_diabetic_count = int((df['Outcome'] == 0).sum())
    diabetic_count = int((df['Outcome'] == 1).sum())

    # Count zeros in invalid clinical feature columns
    zero_counts = {}
    for col in ZERO_INVALID_FEATURES:
        zero_counts[col] = int((df[col] == 0).sum())

    X = df[FEATURE_NAMES]
    y = df['Outcome']

    # 2. Train-Test Split (80/20, fixed random_state=42, stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 3. Fit Preprocessing Pipeline
    preprocessor = DataPreprocessor()
    X_train_scaled = preprocessor.fit_transform(X_train)
    X_test_scaled = preprocessor.transform(X_test)

    # Save preprocessor
    joblib.dump(preprocessor, os.path.join(MODELS_DIR, 'preprocessor.pkl'))

    # 4. Define and Train ML Models
    models = {
        'logistic_regression': {
            'name': 'Logistic Regression',
            'instance': LogisticRegression(random_state=42, max_iter=1000),
            'description': 'A fundamental linear classification algorithm estimating probabilities using a logistic sigmoid function.',
            'category': 'Linear Model'
        },
        'knn': {
            'name': 'K-Nearest Neighbors (KNN)',
            'instance': KNeighborsClassifier(n_neighbors=5),
            'description': 'A non-parametric instance-based classifier predicting outcome based on the majority vote of 5 nearest neighbors.',
            'category': 'Instance-based'
        },
        'decision_tree': {
            'name': 'Decision Tree',
            'instance': DecisionTreeClassifier(random_state=42, max_depth=5),
            'description': 'A non-linear tree classifier that splits data into decision boundaries maximizing information gain.',
            'category': 'Tree-based'
        },
        'svm': {
            'name': 'Support Vector Machine (SVM)',
            'instance': SVC(probability=True, random_state=42, kernel='rbf'),
            'description': 'A powerful classifier constructing an optimal margin hyperplane in high-dimensional transformed feature space.',
            'category': 'Kernel Method'
        }
    }

    results = {}
    saved_model_paths = {}

    for key, info in models.items():
        model = info['instance']
        # Fit on scaled training data
        model.fit(X_train_scaled, y_train)

        # Predict on scaled test data
        y_pred = model.predict(X_test_scaled)
        y_prob = model.predict_proba(X_test_scaled)[:, 1] if hasattr(model, "predict_proba") else None

        # Compute metrics
        metrics = compute_model_metrics(y_test, y_pred, y_prob)
        metrics['key'] = key
        metrics['name'] = info['name']
        metrics['description'] = info['description']
        metrics['category'] = info['category']

        results[key] = metrics

        # Save model pkl
        model_path = os.path.join(MODELS_DIR, f'{key}.pkl')
        joblib.dump(model, model_path)
        saved_model_paths[key] = model_path

    # 5. Extract Feature Importance / Weights
    # Decision Tree Feature Importance
    dt_model = models['decision_tree']['instance']
    dt_importance = dict(zip(FEATURE_NAMES, [round(float(val), 4) for val in dt_model.feature_importances_]))

    # Logistic Regression Coefficients (Feature Weights)
    lr_model = models['logistic_regression']['instance']
    lr_coefs = dict(zip(FEATURE_NAMES, [round(float(val), 4) for val in lr_model.coef_[0]]))

    # 6. Feature Correlation Matrix
    corr_df = df[FEATURE_NAMES + ['Outcome']].corr()
    corr_matrix = {}
    for col1 in corr_df.columns:
        corr_matrix[col1] = {col2: round(float(corr_df.loc[col1, col2]), 4) for col2 in corr_df.columns}

    # 7. Dataset Feature Statistics & Distributions
    feature_stats = {}
    for col in FEATURE_NAMES:
        feature_stats[col] = {
            "mean": round(float(df[col].mean()), 2),
            "std": round(float(df[col].std()), 2),
            "min": round(float(df[col].min()), 2),
            "max": round(float(df[col].max()), 2),
            "median": round(float(df[col].median()), 2),
            "zero_count": int((df[col] == 0).sum()),
            "unit": get_unit(col)
        }

    # Assemble summary JSON
    summary = {
        "dataset_info": {
            "total_samples": total_samples,
            "train_samples": len(X_train),
            "test_samples": len(X_test),
            "num_features": len(FEATURE_NAMES),
            "feature_names": FEATURE_NAMES,
            "class_distribution": {
                "Non-Diabetic": non_diabetic_count,
                "Diabetic": diabetic_count
            },
            "zero_counts": zero_counts,
            "feature_stats": feature_stats
        },
        "performance": results,
        "feature_analysis": {
            "decision_tree_importance": dt_importance,
            "logistic_regression_coefficients": lr_coefs
        },
        "correlation_matrix": corr_matrix
    }

    # Save metrics JSON
    with open(os.path.join(MODELS_DIR, 'metrics.json'), 'w') as f:
        json.dump(summary, f, indent=2)

    print("Successfully trained all 4 models and saved metrics!")
    for k, v in results.items():
        print(f"[{v['name']}] Acc: {v['accuracy_pct']}% | Prec: {v['precision_pct']}% | Rec: {v['recall_pct']}% | F1: {v['f1_score_pct']}%")

    return summary

def get_unit(feature):
    units = {
        'Pregnancies': 'count',
        'Glucose': 'mg/dL',
        'BloodPressure': 'mmHg',
        'SkinThickness': 'mm',
        'Insulin': 'mu U/ml',
        'BMI': 'kg/m²',
        'DiabetesPedigreeFunction': 'score',
        'Age': 'years'
    }
    return units.get(feature, '')

if __name__ == '__main__':
    train_and_evaluate_all()
