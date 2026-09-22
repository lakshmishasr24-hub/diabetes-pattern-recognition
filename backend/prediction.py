import os
import joblib
import numpy as np
import pandas as pd
from preprocessing import FEATURE_NAMES, ZERO_INVALID_FEATURES

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'models')

class DiabetesPredictor:
    def __init__(self):
        self.preprocessor = None
        self.models = {}
        self.load_artifacts()

    def load_artifacts(self):
        """Load trained preprocessor and saved model artifacts."""
        preprocessor_path = os.path.join(MODELS_DIR, 'preprocessor.pkl')
        if os.path.exists(preprocessor_path):
            self.preprocessor = joblib.load(preprocessor_path)

        model_keys = ['logistic_regression', 'knn', 'decision_tree', 'svm']
        model_names = {
            'logistic_regression': 'Logistic Regression',
            'knn': 'K-Nearest Neighbors (KNN)',
            'decision_tree': 'Decision Tree',
            'svm': 'Support Vector Machine (SVM)'
        }

        for key in model_keys:
            path = os.path.join(MODELS_DIR, f'{key}.pkl')
            if os.path.exists(path):
                self.models[key] = {
                    'name': model_names[key],
                    'instance': joblib.load(path)
                }

    def validate_inputs(self, input_dict: dict):
        """Validate input payload fields and numerical constraints."""
        required = [
            'pregnancies', 'glucose', 'bloodPressure', 
            'skinThickness', 'insulin', 'bmi', 
            'diabetesPedigreeFunction', 'age'
        ]
        
        # Check required keys
        missing = [f for f in required if f not in input_dict or input_dict[f] is None]
        if missing:
            raise ValueError(f"Missing required clinical parameters: {', '.join(missing)}")

        # Parse numerical values
        parsed = {}
        try:
            parsed['Pregnancies'] = float(input_dict['pregnancies'])
            parsed['Glucose'] = float(input_dict['glucose'])
            parsed['BloodPressure'] = float(input_dict['bloodPressure'])
            parsed['SkinThickness'] = float(input_dict['skinThickness'])
            parsed['Insulin'] = float(input_dict['insulin'])
            parsed['BMI'] = float(input_dict['bmi'])
            parsed['DiabetesPedigreeFunction'] = float(input_dict['diabetesPedigreeFunction'])
            parsed['Age'] = float(input_dict['age'])
        except (ValueError, TypeError) as e:
            raise ValueError(f"Invalid numerical value provided: {str(e)}")

        # Range & Non-negative validations
        for key, val in parsed.items():
            if val < 0:
                raise ValueError(f"Clinical parameter '{key}' cannot be negative (got {val}).")

        # Specific physiological bounds validation
        if parsed['Age'] > 120 or parsed['Age'] < 1:
            raise ValueError("Age must be between 1 and 120 years.")
        if parsed['BMI'] > 90:
            raise ValueError("BMI value exceeds realistic range (< 90 kg/m²).")
        if parsed['Glucose'] > 500:
            raise ValueError("Glucose level exceeds realistic clinical range (< 500 mg/dL).")
        if parsed['BloodPressure'] > 250:
            raise ValueError("Blood pressure level exceeds realistic clinical range (< 250 mmHg).")

        return parsed

    def predict(self, input_dict: dict, selected_model_key: str = 'decision_tree'):
        """
        Runs clinical inputs through preprocessor and produces predictions from 
        selected model as well as all models for comparison.
        """
        if not self.preprocessor or not self.models:
            self.load_artifacts()
            if not self.preprocessor or not self.models:
                raise RuntimeError("Models or preprocessor not loaded. Train models first.")

        parsed_sample = self.validate_inputs(input_dict)
        
        # Transform sample using exact same pipeline
        X_sample_scaled = self.preprocessor.transform_single(parsed_sample)

        all_predictions = {}
        target_model_key = selected_model_key if selected_model_key in self.models else 'decision_tree'

        for key, item in self.models.items():
            model = item['instance']
            pred_code = int(model.predict(X_sample_scaled)[0])
            pred_label = "Diabetic" if pred_code == 1 else "Non-Diabetic"

            if hasattr(model, "predict_proba"):
                probs = model.predict_proba(X_sample_scaled)[0]
                prob_diabetic = float(probs[1])
            else:
                prob_diabetic = 1.0 if pred_code == 1 else 0.0

            all_predictions[key] = {
                'model_key': key,
                'model_name': item['name'],
                'prediction': pred_label,
                'outcome_code': pred_code,
                'probability_diabetic': round(prob_diabetic, 4),
                'probability_pct': round(prob_diabetic * 100, 2),
                'confidence_level': get_confidence_level(prob_diabetic, pred_code)
            }

        selected_result = all_predictions[target_model_key]

        return {
            'selected_model': selected_result['model_name'],
            'selected_model_key': target_model_key,
            'prediction': selected_result['prediction'],
            'outcome_code': selected_result['outcome_code'],
            'probability': selected_result['probability_diabetic'],
            'probability_pct': selected_result['probability_pct'],
            'confidence_level': selected_result['confidence_level'],
            'all_models': all_predictions,
            'processed_input': parsed_sample,
            'disclaimer': "This result is a machine learning prediction for academic demonstration and should not be interpreted as a medical diagnosis."
        }

def get_confidence_level(prob, pred_code):
    margin = abs(prob - 0.5)
    if margin > 0.35:
        return "High"
    elif margin > 0.15:
        return "Moderate"
    else:
        return "Low (Borderline)"
