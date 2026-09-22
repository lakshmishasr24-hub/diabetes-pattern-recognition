import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

def compute_model_metrics(y_true, y_pred, y_prob=None):
    """
    Computes standard pattern recognition classification performance metrics.
    - Accuracy
    - Precision
    - Recall (Sensitivity)
    - F1 Score
    - Specificity
    - 2x2 Confusion Matrix (TN, FP, FN, TP)
    """
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred, zero_division=0)
    rec = recall_score(y_true, y_pred, zero_division=0)
    f1 = f1_score(y_true, y_pred, zero_division=0)
    
    cm = confusion_matrix(y_true, y_pred)
    # Ensure 2x2 structure
    if cm.shape == (2, 2):
        tn, fp, fn, tp = cm.ravel()
    else:
        tn, fp, fn, tp = 0, 0, 0, 0

    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0

    return {
        "accuracy": round(float(acc), 4),
        "accuracy_pct": round(float(acc * 100), 2),
        "precision": round(float(prec), 4),
        "precision_pct": round(float(prec * 100), 2),
        "recall": round(float(rec), 4),
        "recall_pct": round(float(rec * 100), 2),
        "f1_score": round(float(f1), 4),
        "f1_score_pct": round(float(f1 * 100), 2),
        "specificity": round(float(specificity), 4),
        "confusion_matrix": {
            "tn": int(tn),
            "fp": int(fp),
            "fn": int(fn),
            "tp": int(tp),
            "matrix": [[int(tn), int(fp)], [int(fn), int(tp)]]
        }
    }
