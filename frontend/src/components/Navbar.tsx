import { Link } from "react-router-dom";
import { ModeToggle } from "./ui/theme/theme-mode-toggle";
import { useTheme } from "./ui/theme/theme-provider";
import { useAuth } from "../contexts/AuthContext";
import logoLight from "../assets/logos/logoLight.svg";
import logoDark from "../assets/logos/logoDark.svg";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="flex items-center justify-between p-3 rounded-xl bg-background text-foreground sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-5">
        <Link to="/" className="flex items-center">
          <img src={logoSrc} alt="Logo" className="w-[120px] h-8" />
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/portfolios">Portfolios</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/run-risk">Run Risk</Link>
            {user?.role === "Admin" && (
              <Link to="/admin/users">Admin</Link>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {user?.username}
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
