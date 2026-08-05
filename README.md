# House Price Prediction — End-to-End ML Web App

An end-to-end machine learning product that predicts house prices in India.
The project covers the full pipeline: data cleaning and model training in a
Jupyter notebook, a FastAPI backend that serves the trained model, and a
React (TypeScript) frontend where a user enters property details and
receives an instant price prediction.

## Overview

A user fills in details about a property (bedrooms, floor, bathrooms,
location, furnishing status, amenities, etc.) through a web form. The
frontend sends this data to a FastAPI backend, which runs it through a
trained Random Forest regression model and returns the predicted price
in Indian Rupees.

## Architecture

┌──────────────┐ HTTP POST /predict ┌──────────────┐
│ Frontend │ ───────────────────────────────▶ │ Backend │
│ (React + │ │ (FastAPI) │
│ TypeScript) │ ◀─────────────────────────────── │ │
└──────────────┘ { predicted_price } └──────┬───────┘
│
▼
┌──────────────┐
│ house_price │
│ .pkl │
│ (Random │
│ Forest │
│ Pipeline) │
└──────────────┘


## Tech Stack

| Layer | Technology |
|---|---|
| Data & Modeling | Python, Pandas, NumPy, scikit-learn, Jupyter |
| Backend | FastAPI, Pydantic, Uvicorn, Joblib |
| Frontend | React, TypeScript, Vite, React Router |
| Dataset | [House Price by Juhi Bhojani (Kaggle)](https://www.kaggle.com/datasets/juhibhojani/house-price) |

## Project Structure

house-price-project/
├── notebooks/
│ ├── house_price_model.ipynb # Data cleaning, EDA, training, evaluation
│ ├── house_price.pkl # Exported trained model
│ ├── locations.json # List of allowed locations
│ └── data/ # Raw dataset (not committed, see below)
├── backend/
│ ├── app/
│ │ ├── main.py # FastAPI app + CORS setup
│ │ ├── api/prediction.py # /health and /predict routes
│ │ ├── schemas/prediction.py # Request/response models
│ │ └── services/
│ │ ├── preprocessing.py # Builds a one-row DataFrame from a request
│ │ └── inference.py # Loads the model and runs predictions
│ ├── models/house_price.pkl # Model copy served by the backend
│ └── requirements.txt
├── frontend/
│ ├── src/
│ │ ├── api/predictionClient.ts # Fetch wrapper for the backend
│ │ ├── components/PredictionForm.tsx
│ │ ├── pages/HomePage.tsx | ResultPage.tsx | NotFoundPage.tsx
│ │ ├── types/prediction.ts # TypeScript types mirroring the backend schema
│ │ └── App.tsx # Routes: / , /result , * (404)
│ └── public/locations.json
└── .gitignore


## Dataset

**Source:** [House Price dataset by Juhi Bhojani](https://www.kaggle.com/datasets/juhibhojani/house-price) on Kaggle
— real property listings from India (~177,500 rows after cleaning).

**Columns used:** `BHK`, `Amount(in rupees)`, `Location`, `Floor`,
`Transaction`, `Furnishing`, `Bathroom`, `Balcony`, `Covered Parking`,
`Open Parking`, `Garden/Park`, `Main Road`, `Pool`.

### Downloading the dataset

The raw CSV is not committed to this repository (it's excluded via
`.gitignore`). To get it:

1. Create a free account on [Kaggle](https://www.kaggle.com).
2. Download the dataset manually from the
   [dataset page](https://www.kaggle.com/datasets/juhibhojani/house-price),
   or use the Kaggle CLI:

```bash
pip install kaggle
# Get your API token from Kaggle → Settings → API
kaggle datasets download -d juhibhojani/house-price -p notebooks/data --unzip
```

3. Place the resulting CSV file inside `notebooks/data/`.

## Data Cleaning & Feature Engineering

- Converted `Bathroom` and `Balcony` from text to numeric (the value
  `"> 10"` was mapped to `11`).
- Replaced the placeholder value `"0"` in `Transaction` and `Furnishing`
  with `"Unknown"`, since it represented missing/unrecognized data rather
  than an actual category.
- Removed price outliers below the 1st percentile and above the 99th
  percentile (the raw data contained unrealistic values up to ~14 billion
  rupees).
- Final cleaned dataset: **171,772 rows**.

## Model Training & Evaluation

Two models were trained and compared on a held-out test set (80/20 split):

| Model | MAE | RMSE | R² |
|---|---|---|---|
| Linear Regression | 4,573,992 | 6,890,860 | 0.572 |
| **Random Forest** | **1,538,948** | **3,834,765** | **0.867** |

**Chosen model: Random Forest**, since it achieved a substantially higher
R² and lower error across all metrics. This is expected, as the
relationship between property features and price is non-linear, and
Random Forest captures complex interactions (e.g. between location and
number of bedrooms) that Linear Regression cannot.

The full preprocessing pipeline (imputation, scaling, one-hot encoding)
is bundled inside the exported `house_price.pkl` using a scikit-learn
`Pipeline` + `ColumnTransformer`, so the backend does not need to
replicate any encoding logic manually.

## Backend Setup

```bash
cd backend
python -m venv .venv          # if not already created at the project root
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux

pip install -r requirements.txt

uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive docs (Swagger UI): `http://localhost:8000/docs`.

### Environment Variables

The backend does not currently require a `.env` file to run locally.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env` file inside `frontend/` (see `.env.example` if present):

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:8000` |

## API Reference

### `GET /health`

Health check endpoint.

**Response:**
```json
{ "status": "ok" }
```

### `POST /predict`

Predicts the price of a property given its features.

**Request body:**
```json
{
  "BHK": 2,
  "Floor": 5,
  "Bathroom": 2,
  "Balcony": 1,
  "Covered_Parking": 1,
  "Open_Parking": 0,
  "Garden_Park": 0,
  "Main_Road": 1,
  "Pool": 0,
  "Location": "Belgaum",
  "Transaction": "Resale",
  "Furnishing": "Semi-Furnished"
}
```

**Response:**
```json
{ "predicted_price": 6357200.0 }
```

**Example (curl):**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"BHK":2,"Floor":5,"Bathroom":2,"Balcony":1,"Covered_Parking":1,"Open_Parking":0,"Garden_Park":0,"Main_Road":1,"Pool":0,"Location":"Belgaum","Transaction":"Resale","Furnishing":"Semi-Furnished"}'
```

## Running the Full App

1. Start the backend: `uvicorn app.main:app --reload` (from `backend/`)
2. Start the frontend: `npm run dev` (from `frontend/`)
3. Open `http://localhost:5173`, fill in the property form, and submit
   to get a live price prediction.

## Notes

- scikit-learn version used for training must match the version installed
  in the backend environment, otherwise the pickled model may fail to load.
- The `notebooks/data/` folder and raw dataset CSV are intentionally
  excluded from version control due to file size — see the download
  instructions above.