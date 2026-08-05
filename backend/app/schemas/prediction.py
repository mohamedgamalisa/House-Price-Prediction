from pydantic import BaseModel

class PredictionRequest(BaseModel):
    BHK: int
    Floor: int
    Bathroom: float
    Balcony: float
    Covered_Parking: int
    Open_Parking: int
    Garden_Park: int
    Main_Road: int
    Pool: int
    Location: str
    Transaction: str
    Furnishing: str

class PredictionResponse(BaseModel):
    predicted_price: float