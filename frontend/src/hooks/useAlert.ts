import { useState, useEffect } from "react";
import type { AlertColor, AlertState } from "../types/alert";

export function useAlert(duration = 3000) {
  const [alert, setAlert] = useState<AlertState | null>(null);
  useEffect(() => {
    if (!alert) return;
      const t = setTimeout(() => setAlert(null), duration);
    return () => clearTimeout(t);
  }, [alert, duration]);

const showAlert = (color: AlertColor, title: string) =>
  setAlert({ color, title });
return { alert, showAlert };
}