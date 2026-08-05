import { useLocation, useNavigate } from "react-router-dom";

interface FormData {
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

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const price = location.state?.price as number | undefined;
  const formData = location.state?.formData as FormData | undefined;

  function formatPrice(value: number): string {
    return `₹ ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

  const summaryItems = formData
    ? [
        { label: "Bedrooms (BHK)", value: formData.BHK },
        { label: "Floor", value: formData.Floor },
        { label: "Bathrooms", value: formData.Bathroom },
        { label: "Balconies", value: formData.Balcony },
        { label: "Location", value: formData.Location },
        { label: "Transaction", value: formData.Transaction },
        { label: "Furnishing", value: formData.Furnishing },
        {
          label: "Amenities",
          value:
            [
              formData.Covered_Parking && "Covered Parking",
              formData.Open_Parking && "Open Parking",
              formData.Garden_Park && "Garden/Park",
              formData.Main_Road && "Main Road",
              formData.Pool && "Pool",
            ]
              .filter(Boolean)
              .join(", ") || "None",
        },
      ]
    : [];

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="app-header">
          <div className="icon-badge">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M3 11.5L12 4l9 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>Prediction Result</h1>
          <p>Estimated House Price</p>
        </div>

        <div className="card">
          {price === undefined ? (
            <div style={{ textAlign: "center" }}>
              <h2 style={{ margin: "0 0 1rem" }}>No result to show</h2>
              <button className="secondary-btn" onClick={() => navigate("/")}>
                Back to Form
              </button>
            </div>
          ) : (
            <>
              <div className="price-highlight">
                <span className="price-highlight-value">{formatPrice(price)}</span>
              </div>

              {formData && (
                <div className="summary-grid">
                  {summaryItems.map((item) => (
                    <div className="summary-card" key={item.label}>
                      <div className="summary-label">{item.label}</div>
                      <div className="summary-value">{item.value}</div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="secondary-btn"
                style={{ marginTop: "1.5rem", width: "100%" }}
                onClick={() => navigate("/")}
              >
                Predict Another Property
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}