import { useEffect, useState } from "react";
import { getRiskStatus } from "../api/api";
import { RiskResult } from "../types/types";
import RiskChart from "../components/RiskChart";
import { useParams } from "react-router-dom";

export default function RiskResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState<RiskResult | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getRiskStatus(Number(id));
      setResult(res.data);

      if (res.data.status === "Completed" || res.data.status === "Failed") {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [id]);

  if (!result) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Risk Run #{result.riskId}</h2>
      <p>Status: {result.status}</p>

      {result.status === "Completed" && (
        <>
          <p>Portfolio Value: ${result.portfolioValue}</p>
          <p>VaR: ${result.vaR}</p>
          <p>Stress Loss: ${result.stressLoss}</p>

          <RiskChart
            value={result.portfolioValue!}
            varValue={result.vaR!}
            stressLoss={result.stressLoss!}
          />
        </>
      )}
    </div>
  );
}
