export interface RiskResult {
  riskId: number;
  portfolioId: number;
  timestamp: string;
  portfolioValue: number | null;
  vaR: number | null;
  stressLoss: number | null;
  status: "Pending" | "Running" | "Completed" | "Failed";
}
