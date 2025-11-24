import React, { useEffect, useState } from "react";
import { getPortfolio, deletePortfolio,  runRisk } from "../api/api";
import type { Portfolio } from "../types/types";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import AlertPopUp  from "../components/ui/alert";
import { Spinner } from "@heroui/spinner";
import { AnimatePresence } from "framer-motion";

type AlertColor =
  | "success"
  | "danger"
  | "default"
  | "primary"
  | "secondary"
  | "warning";

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [alert, setAlert] = useState<{ color: AlertColor; title: string } | null>(null);
  
  React.useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  useEffect(() => {
    getPortfolio(Number(id)).then(res => {
      // console.log("Raw API response:", res.data);
      setPortfolio(res.data);
    });
  }, [id]);

  const startRisk = async () => {
    const res = await runRisk(Number(id));
    const jobId = res.data.jobId;
    navigate(`/risk/${jobId}`);
    setAlert({
          color: "success",
          title: "Risk Run Successful!",
        });
  };

  if (!portfolio) return <div style={{alignItems: "center", alignContent: "center", padding: 100, margin: 100,}}><Spinner size="lg" /> Loading...</div>;


  const handleDelete = async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this portfolio?")) return;
  
      try {
        await deletePortfolio(id); // API call
        // setPortfolio(prev => prev?.filter(p => p.id !== id));

        setTimeout(() => {
          navigate("/portfolios");
        }, 800);
        setAlert({
          color: "success",
          title: "Delete successful!",
        });
        console.log("Delete Succeded", portfolio.id, id);
      } catch (err: unknown) {
        const error = err as { response?: { status?: number; data?: unknown } };
        // console.error("Delete failed", err);
        setAlert({
          color: "danger",
          title: `Delete failed: ${error.response?.status ?? "Unknown"}`,
        });
      }
    };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ margin: 10}}>{portfolio.name}</h2>
      <a style={{padding: 12, margin: 15, gap: 10}}>Positions: {portfolio.positions?.length ?? 0}</a>

      <h3 style={{margin: 20}}>Tickers:</h3>
      <ul style={{margin: 20}}>
        {portfolio.positions?.map(pos => (
          <li key={pos.id}>
            {pos.ticker} — {pos.quantity} shares @ ${pos.price}
          </li>
        ))}
      </ul>

      <AnimatePresence>{alert && <AlertPopUp color={alert.color} title={alert.title} />}</AnimatePresence>

      <Button variant="outline" style={{ margin: 10}} onClick={startRisk}>Run Risk</Button>
      <Button variant="destructive" style={{marginLeft: 25, margin: 15, padding: 12}} onClick={() => handleDelete(portfolio.id)}>Delete</Button>
    </div>
  );
}
