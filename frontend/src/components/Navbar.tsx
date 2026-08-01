import { Link } from "react-router-dom";
import { ModeToggle } from "./ui/theme/theme-mode-toggle";
import { useTheme } from "./ui/theme/theme-provider";
import logoLight from "../assets/logos/logoLight.svg";
import logoDark from "../assets/logos/logoDark.svg";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getEffectiveTheme = () => {
    if (!mounted) return "light";
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  };

  const effectiveTheme = getEffectiveTheme();
  const logoSrc = effectiveTheme === "dark" ? logoDark : logoLight;

  return (
    <nav className="flex items-center justify-between p-3 rounded-xl bg-background text-foreground sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-5">
        <Link to="/" className="flex items-center">
          <img src={logoSrc} alt="Logo" className="w-[120px] h-8" />
        </Link>
        <Link to="/portfolios">Portfolios</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/run-risk">Run Risk</Link>
      </div>
      <ModeToggle />
    </nav>
  );
}
