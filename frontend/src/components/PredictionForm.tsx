import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictPrice } from "../api/predictionClient";

const AMENITIES: { key: "Covered_Parking" | "Open_Parking" | "Garden_Park" | "Main_Road" | "Pool"; label: string }[] = [
  { key: "Covered_Parking", label: "Covered Parking" },
  { key: "Open_Parking", label: "Open Parking" },
  { key: "Garden_Park", label: "Garden / Park" },
  { key: "Main_Road", label: "Main Road" },
  { key: "Pool", label: "Swimming Pool" },
];

export default function PredictionForm() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    BHK: 2,
    Floor: 1,
    Bathroom: 2,
    Balcony: 1,
    Covered_Parking: 0,
    Open_Parking: 0,
    Garden_Park: 0,
    Main_Road: 0,
    Pool: 0,
    Location: "",
    Transaction: "Resale",
    Furnishing: "Unfurnished",
  });

  useEffect(() => {
    fetch("/locations.json")
      .then((res) => res.json())
      .then((data: string[]) => {
        setLocations(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, Location: data[0] }));
        }
      })
      .catch(() => setError("Could not load the list of locations."));
  }, []);

  function handleChange(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleAmenity(key: string) {
    setForm((prev) => ({ ...prev, [key]: prev[key as keyof typeof prev] === 1 ? 0 : 1 }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.Location) {
      setError("Please select a location.");
      return;
    }
    if (form.BHK <= 0) {
      setError("Number of bedrooms must be greater than 0.");
      return;
    }

    setLoading(true);
    try {
      const result = await predictPrice(form);
      navigate("/result", { state: { price: result.predicted_price, formData: form } });
    } catch {
      setError("Something went wrong. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  }

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
          <h1>House Price Predictor</h1>
          <p>AI-powered real estate price estimation</p>
        </div>

        <div className="badge-row">
          <div className="badge">
            <div className="badge-title">Random Forest</div>
            <div className="badge-sub">Machine Learning Model</div>
          </div>
          <div className="badge">
            <div className="badge-title">12 Features</div>
            <div className="badge-sub">Prediction Inputs</div>
          </div>
          <div className="badge">
            <div className="badge-title">FastAPI</div>
            <div className="badge-sub">Real-time Response</div>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-field">
              <label>Bedrooms (BHK)</label>
              <input
                type="number"
                min={1}
                value={form.BHK}
                onChange={(e) => handleChange("BHK", Number(e.target.value))}
              />
            </div>

            <div className="form-field">
              <label>Floor Number</label>
              <input
                type="number"
                min={0}
                value={form.Floor}
                onChange={(e) => handleChange("Floor", Number(e.target.value))}
              />
            </div>

            <div className="form-field">
              <label>Bathrooms</label>
              <input
                type="number"
                min={0}
                value={form.Bathroom}
                onChange={(e) => handleChange("Bathroom", Number(e.target.value))}
              />
            </div>

            <div className="form-field">
              <label>Balconies</label>
              <input
                type="number"
                min={0}
                value={form.Balcony}
                onChange={(e) => handleChange("Balcony", Number(e.target.value))}
              />
            </div>

            <div className="form-field full-width">
              <label>Location</label>
              <select
                value={form.Location}
                onChange={(e) => handleChange("Location", e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Transaction Type</label>
              <select
                value={form.Transaction}
                onChange={(e) => handleChange("Transaction", e.target.value)}
              >
                <option value="Resale">Resale</option>
                <option value="New Property">New Property</option>
                <option value="Rent/Lease">Rent / Lease</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Furnishing</label>
              <select
                value={form.Furnishing}
                onChange={(e) => handleChange("Furnishing", e.target.value)}
              >
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Furnished">Fully Furnished</option>
              </select>
            </div>

            <div className="form-field full-width">
              <label>Amenities</label>
              <div className="amenity-grid">
                {AMENITIES.map((a) => (
                  <label
                    key={a.key}
                    className={`amenity-pill ${form[a.key] === 1 ? "active" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={form[a.key] === 1}
                      onChange={() => toggleAmenity(a.key)}
                    />
                    {a.label}
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Calculating..." : "Predict Price"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}