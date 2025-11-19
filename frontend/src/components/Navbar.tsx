import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "12px", background: "#111", color: "white" }}>
      <Link to="/" style={{ marginRight: 20, color: "white" }}>Home</Link>
      <Link to="/portfolios" style={{ marginRight: 20, color: "white" }}>Portfolios</Link>
      <Link to="/upload" style={{ marginRight: 20, color: "white" }}>Upload</Link>
      <Link to="/run-risk" style={{ marginRight: 20, color: "white" }}>Run Risk</Link>
    </nav>
  );
}
