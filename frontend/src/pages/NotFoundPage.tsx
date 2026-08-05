import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="page-wrapper">
      <div className="card" style={{ textAlign: "center" }}>
        <h2>404 - Page Not Found</h2>
        <button className="secondary-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}