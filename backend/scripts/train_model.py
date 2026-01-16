import os
import sys
import json
import argparse
import datetime

# Check dependencies
try:
    import tensorflow as tf
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
    from tensorflow.keras.applications import MobileNetV2
    from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
    from tensorflow.keras.models import Model
    from tensorflow.keras.optimizers import Adam
except ImportError as e:
    print(f"Error: Missing dependency. {e}")
    print("Please install requirements: pip install tensorflow pillow numpy")
    sys.exit(1)

# Configuration
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
DATASET_DIR = os.path.join(os.path.dirname(__file__), '../dataset')
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), '../plant_disease_model.h5')
CLASS_INDICES_PATH = os.path.join(os.path.dirname(__file__), '../class_indices.json')

def train():
    print(f"Checking dataset at: {DATASET_DIR}")
    if not os.path.exists(DATASET_DIR):
        print("Dataset directory not found!")
        return

    # Count classes
    classes = [d for d in os.listdir(DATASET_DIR) if os.path.isdir(os.path.join(DATASET_DIR, d))]
    num_classes = len(classes)
    
    if num_classes < 2:
        print(f"Need at least 2 classes to train. Found {num_classes}: {classes}")
        print("Please add subfolders with images in backend/dataset/")
        return

    print(f"Found {num_classes} classes: {classes}")

    # Data Augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2
    )

    print("Loading training data...")
    train_generator = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    print("Loading validation data...")
    validation_generator = train_datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )

    # Save class indices
    print("Saving class mappings...")
    class_indices = train_generator.class_indices
    # Invert mapping to be index -> label
    idx_to_label = {v: k for k, v in class_indices.items()}
    with open(CLASS_INDICES_PATH, 'w') as f:
        json.dump(idx_to_label, f, indent=4)
    print(f"Class mappings saved to {CLASS_INDICES_PATH}")

    # Build Model (Transfer Learning with MobileNetV2)
    print("Building model...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=IMG_SIZE + (3,))
    
    # Freeze base model
    base_model.trainable = False

    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(optimizer=Adam(learning_rate=0.0001),
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    print("Starting training...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        validation_data=validation_generator,
        validation_steps=validation_generator.samples // BATCH_SIZE,
        epochs=EPOCHS
    )

    print(f"Saving model to {MODEL_SAVE_PATH}...")
    model.save(MODEL_SAVE_PATH)
    print("Training Complete!")

if __name__ == "__main__":
    train()
