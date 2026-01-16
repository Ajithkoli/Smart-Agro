import sys
import json
import os
import argparse
import random
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

MODEL_PATH = os.path.join(os.path.dirname(__file__), '../plant_disease_model.h5')
CLASS_INDICES_PATH = os.path.join(os.path.dirname(__file__), '../class_indices.json')

def get_treatment(disease_name):
    # Dictionary of treatments based on the disease name
    # This matches the classes in your dataset
    treatments = {
        'Tomato_Early_blight': "Use copper-based fungicides. Remove infected lower leaves. Ensure good air circulation.",
        'Tomato_Late_blight': "Apply fungicide immediately (chlorothalonil or copper). Destroy infected plants to prevent spread.",
        'Tomato_healthy': "Plant is healthy! Maintain regular watering and fertilization schedule.",
        'Tomato_Bacterial_spot': "Apply copper-based bactericides. Avoid overhead watering.",
        'Tomato_Leaf_Mold': "Improve ventilation. Apply fungicides.",
        'Tomato_Septoria_leaf_spot': "Remove infected leaves. Apply organic fungicides.",
        'Tomato_Spider_mites_Two_spotted_spider_mite': "Use insecticidal soap or neem oil. Increase humidity.",
        'Tomato__Target_Spot': "Remove infected plant debris. Apply fungicides.",
        'Tomato__Tomato_YellowLeaf__Curl_Virus': "Control whiteflies. Remove infected plants immediately.",
        'Tomato__Tomato_mosaic_virus': "Remove infected plants. Wash hands after handling tobacco products.",
        'Pepper__bell___Bacterial_spot': "Copper sprays can help. Remove infected plants.",
        'Pepper__bell___healthy': "Plant is healthy! Keep up the good work.",
        'Potato___Early_blight': "Apply fungicides. Rotate crops.",
        'Potato___Late_blight': "Destroy infected tubers. Apply fungicides.",
        'Potato___healthy': "Plant is healthy! Ensure soil is well-drained."
    }
    
    # partial match fallback
    if disease_name in treatments:
        return treatments[disease_name]
    
    if "healthy" in disease_name.lower():
        return "Plant appears healthy."
    return "Isolate the plant. Consult a local expert for specific fungicide recommendations."

def get_severity(disease_name):
    if "healthy" in disease_name.lower():
        return "Low"
    if "late_blight" in disease_name.lower() or "virus" in disease_name.lower() or "bacterial" in disease_name.lower():
        return "High"
    return "Medium"

def predict(image_path):
    try:
        if not os.path.exists(MODEL_PATH):
            raise Exception(f"Model file not found at {MODEL_PATH}")
            
        if not os.path.exists(CLASS_INDICES_PATH):
             raise Exception(f"Class indices file not found at {CLASS_INDICES_PATH}")

        # Load resources
        model = tf.keras.models.load_model(MODEL_PATH)
        with open(CLASS_INDICES_PATH, 'r') as f:
            class_indices = json.load(f)
            # Ensure keys are integers if they were saved as string keys in JSON
            # But the JSON structure is {"0": "LabelA", "1": "LabelB"} usually if we inverted it
            # Or {"LabelA": 0} if strictly from keras.
            # My training script saved: idx_to_label = {v: k ...} i.e. {"0": "Label"}
            # So keys are strings representing ints.
        
        # Preprocess Image
        img = image.load_img(image_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) # Batch dimension
        img_array /= 255.0 # Normalize

        # Predict
        predictions = model.predict(img_array, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx]) * 100
        
        # Get Label
        # JSON keys are always strings
        disease_name = class_indices.get(str(predicted_class_idx), "Unknown Disease")
        
        return {
            "disease": disease_name.replace("_", " "),
            "confidence": round(confidence, 2),
            "severity": get_severity(disease_name),
            "treatment": get_treatment(disease_name)
        }

    except Exception as e:
        # Return error as JSON so backend can handle it
        return {
            "error": str(e),
            "disease": "Error",
            "confidence": 0,
            "severity": "Low",
            "treatment": "Could not process image."
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("image_path", help="Path to the leaf image")
    args = parser.parse_args()

    result = predict(args.image_path)
    print(json.dumps(result))
