import os
import json
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

from train_models import train_and_evaluate_all, DATA_PATH, MODELS_DIR
from prediction import DiabetesPredictor
from preprocessing import FEATURE_NAMES

app = Flask(__name__)
CORS(app)  # Enable CORS for development frontend requests

predictor = DiabetesPredictor()

def load_metrics_json():
    metrics_path = os.path.join(MODELS_DIR, 'metrics.json')
    if not os.path.exists(metrics_path):
        train_and_evaluate_all()
    with open(metrics_path, 'r') as f:
        return json.load(f)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Diabetes Risk Pattern Recognition API",
        "version": "1.0.0"
    })

@app.route('/api/dataset-summary', methods=['GET'])
def dataset_summary():
    try:
        metrics_data = load_metrics_json()
        return jsonify(metrics_data['dataset_info'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/dataset-analysis', methods=['GET'])
def dataset_analysis():
    try:
        if not os.path.exists(DATA_PATH):
            return jsonify({"error": "Dataset file not found"}), 404
        
        df = pd.read_csv(DATA_PATH)
        
        # Take sample rows for data preview
        sample_rows = df.head(20).to_dict(orient='records')
        
        # Prepare histogram data bins for numerical features
        histograms = {}
        for col in FEATURE_NAMES:
            series = df[col]
            counts, bin_edges = pd.cut(series, bins=10, retbins=True)
            bins_summary = []
            for i, count in enumerate(counts.value_counts(sort=False)):
                edge_min = round(float(bin_edges[i]), 1)
                edge_max = round(float(bin_edges[i+1]), 1)
                bins_summary.append({
                    "range": f"{edge_min}-{edge_max}",
                    "count": int(count)
                })
            histograms[col] = bins_summary

        metrics_data = load_metrics_json()

        return jsonify({
            "samples": sample_rows,
            "total_count": len(df),
            "histograms": histograms,
            "feature_stats": metrics_data['dataset_info']['feature_stats']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    try:
        metrics_data = load_metrics_json()
        models_list = []
        for key, perf in metrics_data['performance'].items():
            models_list.append({
                "key": key,
                "name": perf['name'],
                "category": perf['category'],
                "description": perf['description']
            })
        return jsonify(models_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/performance', methods=['GET'])
def get_performance():
    try:
        metrics_data = load_metrics_json()
        return jsonify({
            "models": metrics_data['performance'],
            "summary_note": "Model performance varies across evaluation metrics. Accuracy measures overall correctness, Precision measures diabetic prediction exactness, and Recall measures sensitivity to actual diabetic cases."
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/confusion-matrix/<model_key>', methods=['GET'])
def get_confusion_matrix(model_key):
    try:
        metrics_data = load_metrics_json()
        if model_key not in metrics_data['performance']:
            return jsonify({"error": f"Model '{model_key}' not found. Available models: {list(metrics_data['performance'].keys())}"}), 404
        
        perf = metrics_data['performance'][model_key]
        return jsonify({
            "model_key": model_key,
            "model_name": perf['name'],
            "confusion_matrix": perf['confusion_matrix'],
            "accuracy_pct": perf['accuracy_pct'],
            "precision_pct": perf['precision_pct'],
            "recall_pct": perf['recall_pct'],
            "f1_score_pct": perf['f1_score_pct'],
            "specificity": perf['specificity']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/feature-importance', methods=['GET'])
def feature_importance():
    try:
        metrics_data = load_metrics_json()
        return jsonify(metrics_data['feature_analysis'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/correlation', methods=['GET'])
def correlation_matrix():
    try:
        metrics_data = load_metrics_json()
        return jsonify(metrics_data['correlation_matrix'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "Missing JSON request body"}), 400

        model_key = payload.get('model', 'decision_tree')
        result = predictor.predict(payload, selected_model_key=model_key)
        return jsonify(result)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

@app.route('/api/train', methods=['POST'])
def trigger_training():
    try:
        summary = train_and_evaluate_all()
        # Reload predictor with new trained artifacts
        predictor.load_artifacts()
        return jsonify({
            "message": "Models successfully retrained and evaluated on dataset.",
            "summary": summary
        })
    except Exception as e:
        return jsonify({"error": f"Training failed: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
