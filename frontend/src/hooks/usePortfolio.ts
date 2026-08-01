import { useState, useEffect } from "react";
import { getPortfolio } from "../api/portfolio";
import type { Portfolio } from "../types/portfolio";

export function usePortfolio(id: number) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPortfolio(id);
      setPortfolio(res.data);
    } catch {
      setError("Failed to load portfolio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  return { portfolio, loading, error, refetch: fetchPortfolio };
}
