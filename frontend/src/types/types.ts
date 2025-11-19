export interface Position {
  id: number;
  portfolioId: number;
  ticker: string;
  quantity: number;
  price: number;
}

export interface Portfolio {
  id: number;
  name: string;
  positions: Position[]; // <- change from ticker/positionCount
  createdAt: string;
}

export interface RiskResult {
  riskId: number;
  portfolioId: number;
  timestamp: string;
  portfolioValue: number | null;
  vaR: number | null;
  stressLoss: number | null;
  status: "Pending" | "Running" | "Completed" | "Failed";
}
