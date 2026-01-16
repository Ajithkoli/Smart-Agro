import sys
import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Configuration
DATASET_PATH = os.path.join(os.path.dirname(__file__), '../dataset/Crop_Recommendation.csv')
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), '../crop_recommendation_model.pkl')

def train():
    print(f"Checking for dataset at: {DATASET_PATH}")
    if not os.path.exists(DATASET_PATH):
        print("❌ Dataset not found!")
        print("Please place your CSV file 'Crop_Recommendation.csv' in the 'backend/dataset/' folder.")
        return

    try:
        print("Loading dataset...")
        df = pd.read_csv(DATASET_PATH)
        
        # Verify columns
        required_cols = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'label']
        if not all(col in df.columns for col in required_cols):
             # Try case insensitive match or fallback
             print(f"❌ Error: CSV must contain these columns: {required_cols}")
             print(f"Found: {df.columns.tolist()}")
             return

        X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
        y = df['label']

        print("Splitting data...")
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        print("Training Random Forest Classifier...")
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        print("Evaluating model...")
        predictions = model.predict(X_test)
        accuracy = accuracy_score(y_test, predictions)
        print(f"✅ Model Accuracy: {accuracy * 100:.2f}%")

        print(f"Saving model to {MODEL_SAVE_PATH}...")
        joblib.dump(model, MODEL_SAVE_PATH)
        print("Training Complete!")

    except Exception as e:
        print(f"❌ Error during training: {e}")

if __name__ == "__main__":
    train()
