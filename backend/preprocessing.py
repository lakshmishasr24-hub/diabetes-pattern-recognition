import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

FEATURE_NAMES = [
    'Pregnancies',
    'Glucose',
    'BloodPressure',
    'SkinThickness',
    'Insulin',
    'BMI',
    'DiabetesPedigreeFunction',
    'Age'
]

# Features where 0 indicates missing/invalid clinical measurement
ZERO_INVALID_FEATURES = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']

class DataPreprocessor:
    """
    Data Preprocessor for Diabetes Dataset.
    - Handles clinically invalid zero values by replacing them with NaN and imputing with median.
    - Scales numerical features using StandardScaler.
    """
    def __init__(self):
        self.imputer = SimpleImputer(strategy='median')
        self.scaler = StandardScaler()
        self.is_fitted = False

    def clean_zeros(self, X_df: pd.DataFrame) -> pd.DataFrame:
        """Replace invalid 0 values with NaN for specific clinical features."""
        df_clean = X_df.copy()
        for col in ZERO_INVALID_FEATURES:
            if col in df_clean.columns:
                df_clean[col] = df_clean[col].replace(0, np.nan)
        return df_clean

    def fit_transform(self, X: pd.DataFrame) -> np.ndarray:
        """Clean invalid zeros, fit imputer and scaler, then transform data."""
        X_clean = self.clean_zeros(X)
        X_imputed = self.imputer.fit_transform(X_clean)
        X_scaled = self.scaler.fit_transform(X_imputed)
        self.is_fitted = True
        return X_scaled

    def transform(self, X: pd.DataFrame) -> np.ndarray:
        """Clean invalid zeros, impute missing values, and scale using fitted parameters."""
        if not self.is_fitted:
            raise ValueError("Preprocessor has not been fitted yet. Call fit_transform first.")
        X_clean = self.clean_zeros(X)
        X_imputed = self.imputer.transform(X_clean)
        X_scaled = self.scaler.transform(X_imputed)
        return X_scaled

    def transform_single(self, input_dict: dict) -> np.ndarray:
        """Transform a single sample dictionary into a scaled array ready for model inference."""
        sample_df = pd.DataFrame([input_dict], columns=FEATURE_NAMES)
        return self.transform(sample_df)
