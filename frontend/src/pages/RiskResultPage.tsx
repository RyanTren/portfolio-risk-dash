import React, { useEffect, useState } from "react";
import { getRiskStatus } from "../api/api";
import type { RiskResult } from "../types/types";
import RiskChart from "../components/RiskChart";
import { useParams } from "react-router-dom";
import {Spinner} from "@heroui/react";
import AlertPopUp  from "../components/ui/alert";
import { AnimatePresence } from "framer-motion";

type AlertColor =
  | "success"
  | "danger"
  | "default"
  | "primary"
  | "secondary"
  | "warning";

export default function RiskResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState<RiskResult | null>(null);
  const [alert, setAlert] = useState<{ color: AlertColor; title: string } | null>(null);


  React.useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getRiskStatus(Number(id));
      setResult(res.data);

      if (res.data.status === "Completed" || res.data.status === "Failed") {
        clearInterval(interval);
        if (res.data.status === "Completed") {
          setAlert({
            color: "success",
            title: "Risk Run Completed!",
          });
        } else {
          setAlert({
            color: "danger",
            title: "Risk Run Failed!",
          });
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [id]);

  if (!result) return <div><Spinner size="lg" />Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <AnimatePresence>{alert && <AlertPopUp color={alert.color} title={alert.title} />}</AnimatePresence>
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
