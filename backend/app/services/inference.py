import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "house_price.pkl")

model = joblib.load(MODEL_PATH)

def predict_price(df) -> float:
    prediction = model.predict(df)
    return float(prediction[0])