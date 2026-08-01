import { useEffect, useState, useRef } from "react";
import { Spinner } from "@heroui/react";
import { AnimatePresence } from "framer-motion";

import { Button } from "../../components/ui/button";
import { PortfolioSelect } from "../portfolio-page/components/portfolio-dropdown-menu";
import RiskChart from "./components/RiskChart";
import { usePortfolios } from "../../hooks/usePortfolios";
import { useAlert } from "../../hooks/useAlert";
import { runRisk, getRiskStatus } from "../../api/risk";
import AlertPopUp from "../../components/ui/alert";

import type { RiskResult } from "../../types/risk";

const RunRisk = () => {
  const { portfolios } = usePortfolios();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [result, setResult] = useState<RiskResult | null>(null);
  const [runCounts, setRunCounts] = useState<Record<number, number>>({});
  const [isRunning, setIsRunning] = useState(false);
  const { alert, showAlert } = useAlert();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  const selectedPortfolio = portfolios.find((p) => p.id === selectedId);

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Clear polling when switching portfolios
  useEffect(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, [selectedId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleRunRisk = async () => {
    if (!selectedId) {
      showAlert("warning", "No portfolio was picked. Please select a portfolio.");
      return;
    }

    const count = runCounts[selectedId] ?? 0;
    if (count >= 3) {
      showAlert("warning", "Limit reached: You can only run risk 3x for this portfolio.");
      return;
    }

    // Stop any existing polling
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    setResult(null);
    setIsRunning(true);

    try {
      const response = await runRisk(selectedId);
      const riskId = response.data.jobId;

      setRunCounts((prev) => ({
        ...prev,
        [selectedId]: (prev[selectedId] ?? 0) + 1,
      }));

      // Poll every 2 seconds until completed
      pollingRef.current = setInterval(async () => {
        try {
          const r = await getRiskStatus(riskId);
          if (!mountedRef.current) return;
          setResult(r.data);

          if (r.data.status === "Completed" || r.data.status === "Failed") {
            setIsRunning(false);
            clearInterval(pollingRef.current!);
            pollingRef.current = null;

            if (r.data.status === "Completed") {
              showAlert("success", "Risk calculation finished.");
            } else {
              showAlert("danger", "Risk calculation failed.");
            }
          }
        } catch {
          if (!mountedRef.current) return;
          setIsRunning(false);
          clearInterval(pollingRef.current!);
          pollingRef.current = null;
          showAlert("danger", "Error polling risk status.");
        }
      }, 2000);
    } catch {
      setIsRunning(false);
      showAlert("danger", "Error starting risk calculation.");
    }
  };

  if (portfolios.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">No portfolios found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <AnimatePresence>
        {alert && <AlertPopUp color={alert.color} title={alert.title} />}
      </AnimatePresence>

      <h2 className="text-3xl font-semibold text-center mb-8">
        Run Risk Calculation
      </h2>

      <div className="flex flex-col items-center gap-6">
        <PortfolioSelect
          portfolios={portfolios}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
        />

        <Button
          variant="outline"
          className="px-8 py-5 text-base"
          onClick={handleRunRisk}
          disabled={isRunning || !selectedId}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <Spinner size="sm" /> Running...
            </span>
          ) : (
            "Run Risk"
          )}
        </Button>
      </div>

      {isRunning && (
        <div className="flex flex-col items-center gap-3 mt-10">
          <Spinner size="lg" />
          <p className="text-muted-foreground text-sm">Calculating risk metrics...</p>
        </div>
      )}

      {result && !isRunning && (
        <div className="mt-12 flex flex-col items-center">
          <h3 className="text-2xl font-medium mb-6">
            Risk Result{selectedPortfolio ? ` for ${selectedPortfolio.name}` : ""}
          </h3>

          <div className="grid grid-cols-3 gap-6 mb-8 w-full max-w-md">
            <div className="text-center p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
              <p className="text-xl font-semibold">{result.portfolioValue?.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">VaR</p>
              <p className="text-xl font-semibold">{result.vaR?.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Stress Loss</p>
              <p className="text-xl font-semibold">{result.stressLoss?.toLocaleString()}</p>
            </div>
          </div>

          <RiskChart
            value={result.portfolioValue!}
            varValue={result.vaR!}
            stressLoss={result.stressLoss!}
          />
        </div>
      )}
    </div>
  );
};

export default RunRisk;
