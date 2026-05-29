import { useEffect, useState } from "react";
import { useAlert } from "../../hooks/useAlert";
import { getPortfolio, deletePortfolio,  runRisk } from "../../api/api";
import type { Portfolio } from "../../types/portfolio";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";
import AlertPopUp  from "../../components/ui/alert";
import { Spinner } from "@heroui/spinner";
import { AnimatePresence } from "framer-motion";


export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const { alert, showAlert } = useAlert();
  
  //useEffect for auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  // Fetch portfolio details on component mount
  useEffect(() => {
    getPortfolio(Number(id))
      .then(res => setPortfolio(res.data))
      .catch(() => showAlert("danger", "Failed to load portfolio."));
  });

  const startRisk = async () => {
    const res = await runRisk(Number(id));
    const jobId = res.data.jobId;
    navigate(`/risk/${jobId}`);
    // setAlert({
    //       color: "success",
    //       title: "Risk Run Successful!",
    //     });
  };

  if (!portfolio) return (
    <div className="flex items-center justify-center p-24 gap-3">
      <Spinner size="lg" /> Loading...
    </div>
  );

  const handleDelete = async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this portfolio?")) return;
  
      try {
        await deletePortfolio(id); // API call
        // setPortfolio(prev => prev?.filter(p => p.id !== id));

        showAlert("success", "Delete successful!");
        setTimeout(() => {
          navigate("/portfolios");
        }, 800);
        // console.log("Delete Succeded", portfolio.id, id);
      } catch (err: unknown) {
        const error = err as { response?: { status?: number; data?: unknown } };
        // console.error("Delete failed", err);
        showAlert("danger", `Delete failed: ${error.response?.status ?? "Unknown"}`);
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
