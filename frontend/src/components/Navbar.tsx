import { Link } from "react-router-dom";
import { ModeToggle } from "./ui/theme-mode-toggle";
import { useTheme } from "./ui/theme-provider";
import logoLight from "../assets/logoLight.svg";
import logoDark from "../assets/logoDark.svg";
import "../styles/globals.css"
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the actual theme
  const getEffectiveTheme = () => {
    if (!mounted) return "light"; // Default during SSR
    
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  };

  const effectiveTheme = getEffectiveTheme();
  const logoSrc = effectiveTheme === "dark" ? logoDark : logoLight;

  return (
    <nav className="nav" style={{
        padding: "12px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          display: "flex",
          gap: "20px",
          alignItems: "center"
        }}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src={logoSrc} alt="Logo" style={{ width: "120px", height: "32px" }} />
          </Link>
          <Link to="/portfolios">Portfolios</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/run-risk">Run Risk</Link>
        </div>
      
      <ModeToggle />
    </nav>
  );
}