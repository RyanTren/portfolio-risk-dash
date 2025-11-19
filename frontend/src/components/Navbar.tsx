import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "12px", background: "#111", color: "white" }}>
      <Link to="/" style={{ marginRight: 20, color: "white" }}>Portfolios</Link>
      <Link to="/upload" style={{ color: "white" }}>Upload</Link>
    </nav>
  );
}
