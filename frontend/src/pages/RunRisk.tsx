import { useEffect, useState } from "react";
import axios from "axios";

interface Portfolio {
  id: number;
  name: string;
  createdAt: string;
}

interface RiskResult {
  riskId: number;
  portfolioId: number;
  timestamp: string;
  portfolioValue: number;
  vaR: number;
  stressLoss: number;
  status: string;
}

const RunRisk = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<RiskResult | null>(null);

  // Load portfolios
  useEffect(() => {
    axios.get("http://localhost:5141/api/portfolios")
      .then(res => setPortfolios(res.data))
      .catch(err => console.error(err));
  }, []);

  const runRisk = async () => {
    if (!selectedId) {
      setStatus("Pick a portfolio.");
      return;
    }

    setStatus("Starting risk calculation...");

    try {
      const response = await axios.post(
        `http://localhost:5141/api/risk/start/${selectedId}`
      );

      const riskId = response.data.riskId;
      setStatus(`Running risk job #${riskId}...`);

      // Poll the backend every 2 seconds until status = "Completed"
      const interval = setInterval(async () => {
        const r = await axios.get(`http://localhost:5141/api/risk/${riskId}`);
        setResult(r.data);

        if (r.data.status === "Completed") {
          setStatus("Risk calculation finished.");
          clearInterval(interval);
        }
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setStatus("Error starting risk calculation.");
    }
  };

  return (
    <div className="page">
      <h2>Run Risk Calculation</h2>

      <select onChange={(e) => setSelectedId(Number(e.target.value))}>
        <option value="">Select a portfolio...</option>
        {portfolios.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <button onClick={runRisk}>Run Risk</button>

      <p>{status}</p>

      {result && (
        <div className="result-card">
          <h3>Risk Result</h3>
          <p>VaR: {result.vaR.toLocaleString()}</p>
          <p>Stress Loss: {result.stressLoss.toLocaleString()}</p>
          <p>Total Value: {result.portfolioValue.toLocaleString()}</p>
          <p>Status: {result.status}</p>
        </div>
      )}
    </div>
  );
};

export default RunRisk;
