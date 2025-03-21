import os
import json
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import (
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    TrainingArguments,
    Trainer
)
from datasets import load_dataset, DatasetDict, Dataset as HFDataset
import numpy as np
from sklearn.model_selection import train_test_split
from flask import Flask, request, jsonify

# Configuration
MODEL_NAME = "distilbert/distilbert-base-uncased"
MAX_LENGTH = 512
BATCH_SIZE = 16
LEARNING_RATE = 2e-5
EPOCHS = 3
SAVE_DIR = "fine_tuned_model"
NUM_LABELS = 2  # Change based on your task (e.g., 2 for binary classification)

# Create save directory
os.makedirs(SAVE_DIR, exist_ok=True)

# Load tokenizer
tokenizer = DistilBertTokenizer.from_pretrained(MODEL_NAME)

# CSV data processor class
class CSVDataProcessor:
    def __init__(self, tokenizer, max_length=512):
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def process_csv_file(self, file_path, text_column="text", label_column="label"):
        """Process a .csv file with columns for text and labels"""
        df = pd.read_csv(file_path)
        
        # Handle case where label column might not exist
        if label_column in df.columns:
            return {
                "text": df[text_column].tolist(),
                "labels": df[label_column].tolist()
            }
        else:
            return {"text": df[text_column].tolist()}
    
    def process_directory(self, dir_path, text_column="text", label_column="label"):
        """Process all CSV files in a directory"""
        all_texts = []
        all_labels = []
        has_labels = False
        
        for filename in os.listdir(dir_path):
            file_path = os.path.join(dir_path, filename)
            extension = os.path.splitext(filename)[1].lower()
            
            if extension == '.csv':
                try:
                    print(f"Processing CSV file: {file_path}")
                    result = self.process_csv_file(file_path, text_column, label_column)
                    all_texts.extend(result["text"])
                    
                    if "labels" in result:
                        has_labels = True
                        all_labels.extend(result["labels"])
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
        
        if has_labels:
            return {"text": all_texts, "labels": all_labels}
        else:
            return {"text": all_texts}
    
    def create_train_val_datasets(self, data_dict, val_size=0.1):
        """Split data into training and validation sets"""
        if "labels" not in data_dict or len(data_dict["labels"]) == 0:
            raise ValueError("Labels are required for training")
            
        texts = data_dict["text"]
        labels = data_dict["labels"]
        
        X_train, X_val, y_train, y_val = train_test_split(
            texts, labels, test_size=val_size, random_state=42, stratify=labels if len(set(labels)) > 1 else None
        )
        
        train_encodings = self.tokenizer(
            X_train, 
            padding="max_length", 
            truncation=True, 
            max_length=self.max_length
        )
        
        val_encodings = self.tokenizer(
            X_val, 
            padding="max_length", 
            truncation=True, 
            max_length=self.max_length
        )
        
        train_dataset = HFDataset.from_dict({
            "input_ids": train_encodings["input_ids"],
            "attention_mask": train_encodings["attention_mask"],
            "labels": y_train,
            "text": X_train
        })
        
        val_dataset = HFDataset.from_dict({
            "input_ids": val_encodings["input_ids"],
            "attention_mask": val_encodings["attention_mask"],
            "labels": y_val,
            "text": X_val
        })
        
        return DatasetDict({
            "train": train_dataset,
            "validation": val_dataset
        })

# Fine-tuning functions
def fine_tune_model(dataset_dict):
    """Fine-tune the model on the provided dataset"""
    # Load the pre-trained model
    model = DistilBertForSequenceClassification.from_pretrained(
        MODEL_NAME, num_labels=NUM_LABELS
    )
    
    # Define training arguments
    training_args = TrainingArguments(
        output_dir=SAVE_DIR,
        num_train_epochs=EPOCHS,
        per_device_train_batch_size=BATCH_SIZE,
        per_device_eval_batch_size=BATCH_SIZE,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir="./logs",
        logging_steps=10,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        push_to_hub=False,
    )
    
    # Define the Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset_dict["train"],
        eval_dataset=dataset_dict["validation"],
    )
    
    # Train the model
    trainer.train()
    
    # Save the model
    model.save_pretrained(SAVE_DIR)
    tokenizer.save_pretrained(SAVE_DIR)
    
    return model, tokenizer

# Main fine-tuning script
def main(text_column="text", label_column="label"):
    # Initialize data processor
    data_processor = CSVDataProcessor(tokenizer, MAX_LENGTH)
    
    # Process all datasets from the 'data' directory
    data_dir = "distillbert/datasets"
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"Created data directory at {data_dir}. Please place your CSV datasets there.")
        return
    
    processed_data = data_processor.process_directory(data_dir, text_column, label_column)
    
    if "labels" not in processed_data or len(processed_data["labels"]) == 0:
        print("No labeled data found. Cannot perform fine-tuning.")
        return
    
    # Create train and validation sets
    dataset_dict = data_processor.create_train_val_datasets(processed_data)
    
    print(f"Training dataset size: {len(dataset_dict['train'])}")
    print(f"Validation dataset size: {len(dataset_dict['validation'])}")
    
    # Fine-tune the model
    model, _ = fine_tune_model(dataset_dict)
    
    print(f"Model fine-tuned and saved to {SAVE_DIR}")

# API server for the fine-tuned model
def create_api_server():
    app = Flask(__name__)
    
    # Load the fine-tuned model and tokenizer
    model_path = SAVE_DIR
    if not os.path.exists(model_path):
        raise ValueError(f"Model not found at {model_path}. Run fine-tuning first.")
    
    model = DistilBertForSequenceClassification.from_pretrained(model_path)
    tokenizer = DistilBertTokenizer.from_pretrained(model_path)
    
    model.eval()  # Set to evaluation mode
    
    # Get class labels if available
    class_labels = {}
    label_file = os.path.join(model_path, "label_mapping.json")
    if os.path.exists(label_file):
        with open(label_file, 'r') as f:
            class_labels = json.load(f)
    
    @app.route('/predict', methods=['POST'])
    def predict():
        # Try to get text from different possible input formats
        if request.is_json:
            data = request.json
            if isinstance(data, dict) and 'text' in data:
                text = data['text']
            elif isinstance(data, str):
                text = data
            else:
                return jsonify({'error': 'Invalid JSON format. Send either a string or {"text": "your text here"}'}), 400
        else:
            # Try to get plain text from request data
            text = request.data.decode('utf-8')
            if not text:
                text = request.form.get('text', '')
            if not text:
                return jsonify({'error': 'No text provided. Send text as plain text, form field, or JSON'}), 400
        
        # Tokenize input
        inputs = tokenizer(
            text,
            padding="max_length",
            truncation=True,
            max_length=MAX_LENGTH,
            return_tensors="pt"
        )
        
        # Make prediction
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.nn.functional.softmax(logits, dim=-1)
            predicted_class_idx = torch.argmax(probabilities, dim=-1).item()
            confidence = probabilities[0][predicted_class_idx].item()
        
        # Get class label if available, otherwise use the index
        predicted_class = class_labels.get(str(predicted_class_idx), predicted_class_idx)
        
        # Prepare simplified response
        response = {
            'prediction': predicted_class,
            'confidence': round(confidence * 100, 2),
            'input_text': text
        }
        
        return jsonify(response)
    
    # Add an endpoint that takes text directly in the URL for simple GET requests
    @app.route('/predict/<text>', methods=['GET'])
    def predict_get(text):
        # Tokenize input
        inputs = tokenizer(
            text,
            padding="max_length",
            truncation=True,
            max_length=MAX_LENGTH,
            return_tensors="pt"
        )
        
        # Make prediction
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probabilities = torch.nn.functional.softmax(logits, dim=-1)
            predicted_class_idx = torch.argmax(probabilities, dim=-1).item()
            confidence = probabilities[0][predicted_class_idx].item()
        
        # Get class label if available, otherwise use the index
        predicted_class = class_labels.get(str(predicted_class_idx), predicted_class_idx)
        
        # Prepare simplified response
        response = {
            'prediction': predicted_class,
            'confidence': round(confidence * 100, 2),
            'input_text': text
        }
        
        return jsonify(response)
    
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({'status': 'ok'})
    
    return app

# Save label mapping if you know your class labels
def save_label_mapping(label_mapping):
    with open(os.path.join(SAVE_DIR, "label_mapping.json"), 'w') as f:
        json.dump(label_mapping, f)

# To run the API server
def run_api_server(host='0.0.0.0', port=5000):
    # Example: Save class label mapping before starting the server
    # Modify this based on your actual class labels
    label_mapping = {
        "0": "negative",
        "1": "positive"
    }
    save_label_mapping(label_mapping)
    
    app = create_api_server()
    app.run(host=host, port=port)

# Example of how to run everything
if __name__ == "__main__":
    # Run fine-tuning with default column names
    # Change these parameters if your CSV has different column names
    main(text_column="text", label_column="label")
    
    # Then run the API server
    run_api_server()