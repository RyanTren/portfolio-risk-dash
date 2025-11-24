import React,{ useEffect, useState, useRef } from "react";
import axios from "axios";

import { Button } from "../components/ui/button"

import { 
  PortfolioSelect 
} from "../components/ui/portfolio-dropdown-menu"
import RiskChart from "../components/RiskChart";

import type { Portfolio, RiskResult} from "../types/types"
import { Spinner } from "@heroui/spinner";
import AlertPopUp  from "../components/ui/alert";

import { AnimatePresence } from "framer-motion";

const RunRisk = () => {
  type AlertColor =
  | "success"
  | "danger"
  | "default"
  | "primary"
  | "secondary"
  | "warning";

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<RiskResult | null>(null);
  const [runCounts, setRunCounts] = useState<Record<number, number>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [alert, setAlert] = useState<{ color: AlertColor; title: string } | null>(null);


  const selectedPortfolio = portfolios.find(p => p.id === selectedId);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Alert timeout
  React.useEffect(() => {
      if (!alert) return;
  
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
  
      return () => clearTimeout(timer);
    }, [alert]);
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
    // setResult(null);
    // setStatus("");
  }, [selectedId]);


  const runRisk = async () => {
    if (!selectedId) {
      // alert("No Portfolio was picked. Please select a portfolio.");
      setAlert({
        color: "warning",
        title: "No portfolio was picked. Please select a portfolio.",
      });
      setStatus("Pick a portfolio.");
      return;
    }

    if (selectedId) {
      const count = runCounts[selectedId] ?? 0;

      if (count >= 3) {
        setAlert({
          color: "secondary",
          title: "Limit reached: You can only run risk 3× for this portfolio.",
        });
        setStatus("Limit reached: You can only run risk 3× for this portfolio.");
        return;
      }
    }


    // stops any existings polling before starting new run
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    setIsRunning(true);
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

      <Spinner size="lg" />
      setStatus(`Running risk job #${riskId}...`);

      // start new polling loop and save the ID and poll the backend every 2 seconds until status = "Completed"
      pollingRef.current = setInterval(async () => {
        const r = await axios.get(`http://localhost:5233/risk/status/${riskId}`);
        setResult(r.data);

        if (r.data.status === "Completed") {
          setIsRunning(false);
          // setStatus("Risk calculation finished.");
          setAlert({
          color: "success",
          title: "Risk calculation finished.",
        });
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
        }
      }, 2000);
    } catch (err: unknown) {
      console.error(err);

      setIsRunning(false);
      setStatus("Error starting risk calculation.");
    }
  };

  return (
    <div className="page">
      <AnimatePresence>{alert && <AlertPopUp color={alert.color} title={alert.title} />}</AnimatePresence>
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

      {isRunning && (
        <div style={{ textAlign: "center", marginTop: 20}}>
          <Spinner size="lg" />
        </div>
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
