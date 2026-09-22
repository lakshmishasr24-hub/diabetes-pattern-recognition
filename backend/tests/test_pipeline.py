import os
import sys
import pytest
import pandas as pd

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from preprocessing import DataPreprocessor, FEATURE_NAMES, ZERO_INVALID_FEATURES
from prediction import DiabetesPredictor
from train_models import DATA_PATH, train_and_evaluate_all
from app import app

@pytest.fixture(scope='module')
def trained_artifacts():
    """Ensure models are trained before running tests."""
    return train_and_evaluate_all()

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_dataset_exists_and_valid():
    assert os.path.exists(DATA_PATH), "Dataset file diabetes.csv should exist."
    df = pd.read_csv(DATA_PATH)
    assert df.shape == (768, 9), f"Dataset shape should be (768, 9), got {df.shape}"
    assert 'Outcome' in df.columns, "'Outcome' target column missing."
    for feat in FEATURE_NAMES:
        assert feat in df.columns, f"Feature '{feat}' missing from dataset."

def test_preprocessor():
    df = pd.DataFrame([{
        'Pregnancies': 2,
        'Glucose': 0, # Invalid 0
        'BloodPressure': 70,
        'SkinThickness': 0, # Invalid 0
        'Insulin': 0, # Invalid 0
        'BMI': 28.5,
        'DiabetesPedigreeFunction': 0.35,
        'Age': 35
    }])
    
    prep = DataPreprocessor()
    X_clean = prep.clean_zeros(df)
    assert pd.isna(X_clean['Glucose'].iloc[0]), "Glucose 0 should be converted to NaN"
    assert pd.isna(X_clean['SkinThickness'].iloc[0]), "SkinThickness 0 should be converted to NaN"
    assert X_clean['BloodPressure'].iloc[0] == 70, "BloodPressure 70 should be retained"

def test_predictor_valid_sample(trained_artifacts):
    predictor = DiabetesPredictor()
    sample = {
        "pregnancies": 2,
        "glucose": 120,
        "bloodPressure": 70,
        "skinThickness": 20,
        "insulin": 79,
        "bmi": 28.5,
        "diabetesPedigreeFunction": 0.35,
        "age": 35
    }
    result = predictor.predict(sample, selected_model_key='decision_tree')
    assert result['prediction'] in ["Diabetic", "Non-Diabetic"]
    assert 0.0 <= result['probability'] <= 1.0
    assert 'all_models' in result
    assert len(result['all_models']) == 4

def test_predictor_invalid_negative_input():
    predictor = DiabetesPredictor()
    invalid_sample = {
        "pregnancies": -2, # Invalid negative
        "glucose": 120,
        "bloodPressure": 70,
        "skinThickness": 20,
        "insulin": 79,
        "bmi": 28.5,
        "diabetesPedigreeFunction": 0.35,
        "age": 35
    }
    with pytest.raises(ValueError, match="cannot be negative"):
        predictor.predict(invalid_sample)

def test_api_endpoints(client, trained_artifacts):
    # Health endpoint
    res_health = client.get('/api/health')
    assert res_health.status_code == 200
    assert res_health.json['status'] == 'healthy'

    # Performance endpoint
    res_perf = client.get('/api/performance')
    assert res_perf.status_code == 200
    assert 'models' in res_perf.json
    assert 'logistic_regression' in res_perf.json['models']

    # Predict endpoint
    payload = {
        "pregnancies": 6,
        "glucose": 148,
        "bloodPressure": 72,
        "skinThickness": 35,
        "insulin": 150,
        "bmi": 33.6,
        "diabetesPedigreeFunction": 0.627,
        "age": 50,
        "model": "knn"
    }
    res_pred = client.post('/api/predict', json=payload)
    assert res_pred.status_code == 200
    assert res_pred.json['selected_model_key'] == 'knn'
    assert 'probability' in res_pred.json
