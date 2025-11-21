import { Link } from "react-router-dom";
import { ModeToggle } from "./ui/theme-mode-toggle";
import "../styles/globals.css"

export default function Navbar() {
  return (
    <nav className="nav" style={{
        padding: "12px",
        borderRadius: "10px",
        justifyContent: "space-between",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          display: "flex",
          gap: "20px",
          padding: "10px"
        }}>
          {/* add a logo here */}
          <Link to="/" style={{ marginRight: 20}}>Home</Link>
          <Link to="/portfolios" style={{ marginRight: 20}}>Portfolios</Link>
          <Link to="/upload" style={{ marginRight: 20}}>Upload</Link>
          <Link to="/run-risk" style={{ marginRight: 20}}>Run Risk</Link>
        </div>
      
      <ModeToggle />
    </nav>
  );
}
