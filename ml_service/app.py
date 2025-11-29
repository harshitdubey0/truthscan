import os
import re
import string
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier

app = Flask(__name__)
CORS(app)

# Global variables for models and vectorizer
vectorizer = None
models = {}
is_trained = False

def clean_text(text):
    """Preprocessing function for text cleaning"""
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'[()]', '', text)
    text = re.sub(r'\\W', ' ', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'\w*\d\w*', '', text)
    return text

def train_models():
    """Load data and train all models"""
    global vectorizer, models, is_trained
    
    fake_path = os.path.join(os.path.dirname(__file__), 'Fake.csv')
    true_path = os.path.join(os.path.dirname(__file__), 'True.csv')
    
    if not os.path.exists(fake_path) or not os.path.exists(true_path):
        print("CSV files not found. Please upload Fake.csv and True.csv to ml_service folder.")
        return False
    
    print("Loading datasets...")
    df_fake = pd.read_csv(fake_path)
    df_true = pd.read_csv(true_path)
    
    df_fake["target"] = 0
    df_true["target"] = 1
    
    # Drop unnecessary columns
    df_fake = df_fake.drop(["title", "subject", "date"], axis=1, errors='ignore')
    df_true = df_true.drop(["title", "subject", "date"], axis=1, errors='ignore')
    
    # Combine and shuffle
    df = pd.concat([df_fake, df_true], axis=0)
    df = df.sample(frac=1).reset_index(drop=True)
    
    print("Cleaning text...")
    df["text"] = df["text"].apply(clean_text)
    
    print("Vectorizing...")
    X = df["text"]
    Y = df["target"]
    
    vectorizer = TfidfVectorizer(max_features=5000)
    xv = vectorizer.fit_transform(X)
    
    X_train, X_test, y_train, y_test = train_test_split(xv, Y, test_size=0.25, random_state=42)
    
    print("Training Logistic Regression...")
    models['lr'] = LogisticRegression(max_iter=1000)
    models['lr'].fit(X_train, y_train)
    lr_acc = models['lr'].score(X_test, y_test)
    print(f"  Accuracy: {lr_acc:.2%}")
    
    print("Training Decision Tree...")
    models['dt'] = DecisionTreeClassifier()
    models['dt'].fit(X_train, y_train)
    dt_acc = models['dt'].score(X_test, y_test)
    print(f"  Accuracy: {dt_acc:.2%}")
    
    print("Training Gradient Boosting...")
    models['gbc'] = GradientBoostingClassifier(n_estimators=100)
    models['gbc'].fit(X_train, y_train)
    gbc_acc = models['gbc'].score(X_test, y_test)
    print(f"  Accuracy: {gbc_acc:.2%}")
    
    print("Training Random Forest...")
    models['rfc'] = RandomForestClassifier(n_estimators=100)
    models['rfc'].fit(X_train, y_train)
    rfc_acc = models['rfc'].score(X_test, y_test)
    print(f"  Accuracy: {rfc_acc:.2%}")
    
    is_trained = True
    print("All models trained successfully!")
    return True

def output_label(n):
    return "Real" if n == 1 else "Fake"

def predict_news(news):
    """Make predictions using all trained models"""
    if not is_trained:
        return None
    
    processed = clean_text(news)
    vectorized = vectorizer.transform([processed])
    
    results = []
    
    # Logistic Regression
    lr_pred = models['lr'].predict(vectorized)[0]
    lr_proba = models['lr'].predict_proba(vectorized)[0]
    lr_conf = int(max(lr_proba) * 100)
    results.append({
        "name": "Logistic Regression",
        "prediction": output_label(lr_pred),
        "confidence": lr_conf
    })
    
    # Decision Tree
    dt_pred = models['dt'].predict(vectorized)[0]
    dt_proba = models['dt'].predict_proba(vectorized)[0]
    dt_conf = int(max(dt_proba) * 100)
    results.append({
        "name": "Decision Tree",
        "prediction": output_label(dt_pred),
        "confidence": dt_conf
    })
    
    # Gradient Boosting
    gbc_pred = models['gbc'].predict(vectorized)[0]
    gbc_proba = models['gbc'].predict_proba(vectorized)[0]
    gbc_conf = int(max(gbc_proba) * 100)
    results.append({
        "name": "Gradient Boosting",
        "prediction": output_label(gbc_pred),
        "confidence": gbc_conf
    })
    
    # Random Forest
    rfc_pred = models['rfc'].predict(vectorized)[0]
    rfc_proba = models['rfc'].predict_proba(vectorized)[0]
    rfc_conf = int(max(rfc_proba) * 100)
    results.append({
        "name": "Random Forest",
        "prediction": output_label(rfc_pred),
        "confidence": rfc_conf
    })
    
    # Calculate overall verdict (majority voting)
    fake_votes = sum(1 for r in results if r["prediction"] == "Fake")
    real_votes = sum(1 for r in results if r["prediction"] == "Real")
    
    verdict = "fake" if fake_votes > real_votes else "real"
    avg_confidence = int(sum(r["confidence"] for r in results) / len(results))
    
    return {
        "verdict": verdict,
        "confidence": avg_confidence,
        "models": results
    }

@app.route('/api/ml/analyze', methods=['POST'])
def analyze():
    """Analyze news article for authenticity"""
    if not is_trained:
        return jsonify({"error": "Models not trained. Please upload CSV files first."}), 503
    
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    text = data['text']
    if len(text) < 50:
        return jsonify({"error": "Text must be at least 50 characters"}), 400
    
    result = predict_news(text)
    return jsonify(result)

@app.route('/api/ml/status', methods=['GET'])
def status():
    """Check if models are trained and ready"""
    return jsonify({
        "trained": is_trained,
        "models_count": len(models) if is_trained else 0
    })

@app.route('/api/ml/train', methods=['POST'])
def train():
    """Trigger model training"""
    success = train_models()
    if success:
        return jsonify({"message": "Models trained successfully", "trained": True})
    else:
        return jsonify({"error": "Training failed. Make sure CSV files are in ml_service folder."}), 500

if __name__ == '__main__':
    # Try to train models on startup if CSV files exist
    print("Starting ML Service...")
    train_models()
    
    port = int(os.environ.get('ML_PORT', 5001))
    print(f"ML Service running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
