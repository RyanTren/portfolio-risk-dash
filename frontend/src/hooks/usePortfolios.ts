import { useState, useEffect, useCallback } from "react";
import { getPortfolios } from "../api/portfolio";
import type { Portfolio } from "../types/portfolio";

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPortfolios();
      setPortfolios(res.data);
    } catch {
      setError("Failed to load portfolios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  return { portfolios, loading, error, refetch: fetchPortfolios };
}
