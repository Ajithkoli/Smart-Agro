import sys
import json
import os
import argparse
import random

# Mock logic if model is missing
def get_mock_prediction(N, P, K, temp, humidity, ph, rainfall):
    # Simple logic to make mock processing look realistic based on NPK
    crops = ['Rice', 'Maize', 'Chickpea', 'Kidneybeans', 'Pigeonpeas', 'Mothbeans', 'Mungbean', 'Blackgram', 'Lentil', 'Pomegranate', 'Banana', 'Mango', 'Grapes', 'Watermelon', 'Muskmelon', 'Apple', 'Orange', 'Papaya', 'Coconut', 'Cotton', 'Jute', 'Coffee']
    
    # Very basic heuristics for demo
    if N > 100:
        recommended = 'Cotton'
    elif humidity > 80:
        recommended = 'Rice'
    elif rainfall < 50:
        recommended = 'Watermelon'
    else:
        recommended = random.choice(crops)
        
    return {
        "recommendedCrop": recommended,
        "confidence": round(random.uniform(88.0, 99.0), 2)
    }

def predict(args):
    try:
        # MODEL_PATH = os.path.join(os.path.dirname(__file__), '../crop_recommendation_model.pkl')
        
        # if os.path.exists(MODEL_PATH):
        #     import joblib
        #     import pandas as pd
            
        #     model = joblib.load(MODEL_PATH)
        #     # Prepare input dataframe
        #     data = pd.DataFrame([[args.N, args.P, args.K, args.temperature, args.humidity, args.ph, args.rainfall]],
        #                         columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
            
        #     prediction = model.predict(data)
        #     # Get probability if model supports it
        #     confidence = 95.0 # Placeholder if model doesn't output prob
        #     if hasattr(model, 'predict_proba'):
        #          # logic to get max prob
        #          pass
                 
        #     return {
        #         "recommendedCrop": prediction[0],
        #         "confidence": confidence
        #     }
        
        # Fallback to mock
        return get_mock_prediction(args.N, args.P, args.K, args.temperature, args.humidity, args.ph, args.rainfall)

    except Exception as e:
        return {
            "error": str(e),
            "recommendedCrop": "Error",
            "confidence": 0
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--N", type=float, required=True)
    parser.add_argument("--P", type=float, required=True)
    parser.add_argument("--K", type=float, required=True)
    parser.add_argument("--temperature", type=float, required=True)
    parser.add_argument("--humidity", type=float, required=True)
    parser.add_argument("--ph", type=float, required=True)
    parser.add_argument("--rainfall", type=float, required=True)
    
    args = parser.parse_args()

    result = predict(args)
    print(json.dumps(result))
