import { useEffect, useState, useRef } from "react";
import axios from "axios";

import { Button } from "../components/ui/button"

import { 
  PortfolioSelect 
} from "../components/ui/portfolio-dropdown-menu"
import RiskChart from "../components/RiskChart";

import type { Portfolio, RiskResult} from "../types/types"

const RunRisk = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<RiskResult | null>(null);
  const [runCounts, setRunCounts] = useState<Record<number, number>>({});


  const selectedPortfolio = portfolios.find(p => p.id === selectedId);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);


  // Load portfolios
  useEffect(() => {
    axios.get("http://localhost:5233/api/portfolio")
      .then(res => setPortfolios(res.data))
      .catch(err => console.error(err));
  }, []);

  // Clear previous result whenever a new portfolio is selected and stop polling when switching portfolios or when leaving page
  useEffect(() => {
    // stop polling if switching portfolios
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    // reset UI
    setResult(null);
    setStatus("");
  }, [selectedId]);


  const runRisk = async () => {
    if (!selectedId) {
      alert("No Portfolio was picked. Please select a portfolio.");
      setStatus("Pick a portfolio.");
      return;
    }

    if (selectedId) {
      const count = runCounts[selectedId] ?? 0;

      if (count >= 3) {
        setStatus("Limit reached: You can only run risk 3× for this portfolio.");
        return;
      }
    }


    // stops any existings polling before starting new run
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    setStatus("Starting risk calculation...");

    try {
      const response = await axios.post(
        `http://localhost:5233/risk/run/`, { portfolioId: selectedId });
      const riskId = response.data.jobId;

      // increment count
      setRunCounts(prev => ({
        ...prev,
        [selectedId]: (prev[selectedId] ?? 0) + 1
      }));

      setStatus(`Running risk job #${riskId}...`);

      // start new polling loop and save the ID and poll the backend every 2 seconds until status = "Completed"
      pollingRef.current = setInterval(async () => {
        const r = await axios.get(`http://localhost:5233/risk/status/${riskId}`);
        setResult(r.data);

        if (r.data.status === "Completed") {
          setStatus("Risk calculation finished.");
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
        }
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setStatus("Error starting risk calculation.");
    }
  };

  return (
    <div className="page">
      <h2 className="h2" style={{margin: 10, padding: 10, justifyContent: "center", alignItems: "center", textAlign: "center"}}>Run Risk Calculation</h2>

      <PortfolioSelect
        portfolios={portfolios}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
      />

      {status && status !== "Risk calculation finished." && (
        <p style={{ flex: "center", justifyContent: "center", alignItems: "center", textAlign: "center", margin: 50, padding: 50 }}>
          {status}
        </p>
      )}


      {result && (
        <div className="result-card" style={{ justifyContent: "center", alignContent: "center", alignItems: "center", margin: 200, padding: 50 }}>
          <h2 className="h2">Risk Result{selectedPortfolio ? ` for ${selectedPortfolio.name}` : ""}</h2>
          <p>VaR: {result.vaR?.toLocaleString()}</p>
          <p>Stress Loss: {result.stressLoss?.toLocaleString()}</p>
          <p>Total Value: {result.portfolioValue?.toLocaleString()}</p>
          <a>Status: {result.status}</a>

          <RiskChart
            varValue={result.vaR!}
            stressLoss={result.stressLoss!}
            totalValue={result.portfolioValue!}
            status={result.status!}
          />
        </div>
      )}


      <Button variant="outline" style={{margin: 35, padding: 20}} onClick={runRisk} disabled={status.includes("Running")}>Run Risk</Button>
    </div>
  );
};

export default RunRisk;
