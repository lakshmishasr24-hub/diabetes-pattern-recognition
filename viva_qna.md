# Viva Voce Preparation Guide: Questions & Answers
## Subject: Pattern Recognition (PR)
## Project: Diabetes Risk Pattern Recognition System

---

### Q1: What is Pattern Recognition and how is it applied in this project?
**Answer:** Pattern Recognition (PR) is the scientific discipline concerned with automatically identifying structural patterns or regularities in empirical data and assigning observations to predefined classes. In this project, PR is applied by mapping an 8-dimensional clinical feature vector $X = [\text{Pregnancies}, \text{Glucose}, \text{BloodPressure}, \dots, \text{Age}] \in \mathbb{R}^8$ to a discrete outcome label $Y \in \{0, 1\}$ using trained supervised classifiers.

---

### Q2: Why did you replace zero values in features like Glucose and Insulin?
**Answer:** Physiologically, values of 0 for Glucose, BloodPressure, SkinThickness, Insulin, and BMI are impossible in living humans. In the Pima Indians dataset, 0 represents missing or unrecorded clinical data. Blindly passing 0 into machine learning models distorts feature distributions and distance calculations. We converted 0 to `NaN` and imputed them using the median of each feature calculated from the training split.

---

### Q3: Why is Feature Scaling (StandardScaler) necessary for KNN and SVM?
**Answer:** Distance-based models (KNN) and margin-based models (SVM, Logistic Regression) calculate Euclidean distances or gradients across features. Without scaling, high-magnitude features like Insulin (range 0-846) would dominate distance calculations over small-magnitude features like Diabetes Pedigree Function (range 0.08-2.42). `StandardScaler` transforms features to mean $\mu=0$ and standard deviation $\sigma=1$, ensuring equal weight.

---

### Q4: Why doesn't Decision Tree require feature scaling?
**Answer:** Decision Trees split feature space using monotonic threshold rules (e.g. $\text{Glucose} > 127.5$). Monotonic transformations (like linear scaling) do not change the ordering of values or the Gini impurity calculation at any split node. Therefore, Decision Trees are scale-invariant.

---

### Q5: What is the difference between Accuracy, Precision, Recall, and F1 Score?
**Answer:**
- **Accuracy**: Overall fraction of correct predictions: $\frac{TP + TN}{TP + TN + FP + FN}$.
- **Precision**: Fraction of positive predictions that are correct: $\frac{TP}{TP + FP}$.
- **Recall (Sensitivity)**: Fraction of actual diabetic cases detected: $\frac{TP}{TP + FN}$.
- **F1 Score**: Harmonic mean of Precision and Recall: $2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$.

---

### Q6: In clinical screening, why is Recall often prioritized over Precision?
**Answer:** In medical screening, a **False Negative (FN)** means a diabetic patient is mistakenly classified as non-diabetic and left untreated, which poses severe health risks. A **False Positive (FP)** merely results in follow-up diagnostic testing. Therefore, maximizing Recall (sensitivity) minimizes dangerous False Negatives.

---

### Q7: Explain the Confusion Matrix and its components.
**Answer:** A Confusion Matrix is a 2x2 table comparing actual class labels against model predictions:
- **True Negative (TN)**: Actual Non-Diabetic, Predicted Non-Diabetic.
- **False Positive (FP)**: Actual Non-Diabetic, Predicted Diabetic (Type I Error).
- **False Negative (FN)**: Actual Diabetic, Predicted Non-Diabetic (Type II Error).
- **True Positive (TP)**: Actual Diabetic, Predicted Diabetic.

---

### Q8: What is Stratified Train-Test Split and why was it used?
**Answer:** Stratified splitting ensures that the train and test subsets maintain the exact same target class ratio as the original dataset (65.1% Non-Diabetic to 34.9% Diabetic). This prevents data imbalance skewing in either split.

---

### Q9: How does Logistic Regression estimate probabilities?
**Answer:** It calculates a linear combination of features $z = \mathbf{w}^T \mathbf{x} + b$, and passes $z$ through the logistic sigmoid function $\sigma(z) = \frac{1}{1 + e^{-z}}$. The output $\sigma(z) \in [0, 1]$ represents the estimated probability of class 1.

---

### Q10: How does K-Nearest Neighbors (KNN) work?
**Answer:** KNN is an instance-based lazy learning algorithm. Given an unlabelled sample, it computes the distance (Euclidean $d = \sqrt{\sum (x_i - y_i)^2}$) to all training samples, identifies the $K=5$ closest neighbors, and assigns the majority outcome class.

---

### Q11: How does a Decision Tree determine the best feature split?
**Answer:** At each node, the Decision Tree evaluates all features and candidate threshold split values to find the split that maximizes **Information Gain** or minimizes **Gini Impurity**: $Gini = 1 - \sum p_i^2$.

---

### Q12: How does Support Vector Machine (SVM) handle non-linear data?
**Answer:** SVM uses a **Kernel Function** (such as Radial Basis Function - RBF: $K(x, x') = \exp(-\gamma ||x - x'||^2)$) to implicitly map features into a higher-dimensional space where a linear hyper-plane can separate the classes with maximum margin.

---

### Q13: What model achieved the best performance on your dataset?
**Answer:** On the 20% test split, **Decision Tree** achieved the highest overall accuracy (**75.97%**), highest recall (**72.22%**), and highest F1-score (**67.83%**). **KNN** achieved the highest precision (**66.00%**).

---

### Q14: What is overfitting and how did you prevent it?
**Answer:** Overfitting occurs when a classifier learns noise and specific training samples rather than generalizable patterns. We prevented overfitting by using a 20% holdout test set, constraining Decision Tree depth (`max_depth=5`), and setting fixed random seeds (`random_state=42`).

---

### Q15: Why is Pearson correlation insufficient to prove medical causation?
**Answer:** Correlation measures the degree of linear association between two variables (e.g. Glucose vs Outcome = +0.47), but association does not prove causation. Physiological diabetes involves complex multi-factorial metabolic pathways.

---

### Q16: What features had the highest importance in your analysis?
**Answer:** **Glucose**, **BMI**, and **Age** consistently showed the highest feature importances in Decision Tree splits and the largest positive standardized coefficients in Logistic Regression.

---

### Q17: Why is this system labeled as an academic tool rather than a clinical tool?
**Answer:** Clinical diagnostic systems require extensive multi-center clinical trials, regulatory approval (FDA/CE mark), broader patient demographic data, and doctor oversight. This project is built to demonstrate pattern recognition engineering concepts using a public dataset.

---

### Q18: What is the purpose of `metrics.json` in your backend?
**Answer:** `metrics.json` caches all programmatically computed test set metrics, feature importances, zero-value counts, and correlation matrices generated by `train_models.py`, allowing the Flask REST API to serve instant responses without recalculation.

---

### Q19: How are patient inputs preprocessed during real-time prediction?
**Answer:** When a user submits clinical parameters via the React frontend, the Flask backend validates numerical ranges, constructs an 8-feature DataFrame, applies the saved `SimpleImputer` (median), applies the saved `StandardScaler`, and feeds the array into the trained model.

---

### Q20: What is the role of `joblib` in Python?
**Answer:** `joblib` is used to serialize (save) and deserialize (load) Python objects such as trained Scikit-Learn model instances and fitted `StandardScaler` preprocessors to binary `.pkl` files.

---

### Q21: What are the main limitations of the Pima Indians dataset?
**Answer:** Small sample size (768 records), restricted to females of Pima Indian heritage aged 21+, and high percentage of missing insulin values (48.8%).

---

### Q22: What is the Curse of Dimensionality?
**Answer:** As the number of features increases, the volume of feature space grows exponentially, causing data points to become sparse. Distance metrics like Euclidean distance lose contrast in very high dimensions.

---

### Q23: How would you improve this Pattern Recognition system in the future?
**Answer:** By incorporating ensemble algorithms (Random Forest, XGBoost), hyperparameter tuning via GridSearch, explainable AI techniques (SHAP values), and expanding to multi-center clinical datasets.

---

### Q24: What API endpoints does your backend provide?
**Answer:** `/api/health`, `/api/dataset-summary`, `/api/dataset-analysis`, `/api/models`, `/api/performance`, `/api/confusion-matrix/<model>`, `/api/feature-importance`, `/api/correlation`, `/api/predict`, and `/api/train`.

---

### Q25: How did you structure the frontend component architecture?
**Answer:** The frontend uses React with modular components (`Navbar`, `DisclaimerBanner`, `Footer`), an Axios API service layer (`api.js`), and 8 distinct page views (`Dashboard`, `Predict`, `DatasetAnalysis`, `PatternRecognition`, `ModelPerformance`, `ConfusionMatrixPage`, `FeatureAnalysis`, `AboutProject`).
