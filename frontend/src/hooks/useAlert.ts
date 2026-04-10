import { useState, useEffect } from "react";

type AlertColor = "success" | "danger" | "default" | "primary" | "secondary" | "warning";
export type AlertState = { color: AlertColor; title: string } | null;

export function useAlert(duration = 3000) {
  const [alert, setAlert] = useState<AlertState>(null);

  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => setAlert(null), duration);
    return () => clearTimeout(timer);
  }, [alert, duration]);

  return { alert, setAlert };
}