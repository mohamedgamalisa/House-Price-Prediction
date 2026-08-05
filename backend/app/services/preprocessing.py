import pandas as pd

def request_to_dataframe(data) -> pd.DataFrame:
    row = {
        "BHK": data.BHK,
        "Floor": data.Floor,
        "Bathroom": data.Bathroom,
        "Balcony": data.Balcony,
        "Covered Parking": data.Covered_Parking,
        "Open Parking": data.Open_Parking,
        "Garden/Park": data.Garden_Park,
        "Main Road": data.Main_Road,
        "Pool": data.Pool,
        "Location": data.Location,
        "Transaction": data.Transaction,
        "Furnishing": data.Furnishing,
    }
    return pd.DataFrame([row])