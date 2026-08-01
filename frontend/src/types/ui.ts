import type { Portfolio } from "../types/portfolio";

export interface PortfolioSelectProps {
  portfolios: Portfolio[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}