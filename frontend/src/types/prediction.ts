export interface PredictionRequest {
  BHK: number;
  Floor: number;
  Bathroom: number;
  Balcony: number;
  Covered_Parking: number;
  Open_Parking: number;
  Garden_Park: number;
  Main_Road: number;
  Pool: number;
  Location: string;
  Transaction: string;
  Furnishing: string;
}

export interface PredictionResponse {
  predicted_price: number;
}