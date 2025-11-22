import { useEffect, useState } from "react";
import { getPortfolio, deletePortfolio,  runRisk } from "../api/api";
import type { Portfolio } from "../types/types";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    getPortfolio(Number(id)).then(res => setPortfolio(res.data));
  }, [id]);

  

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
  };

  if (!portfolio) return <div>Loading...</div>;


  const handleDelete = async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this portfolio?")) return;
  
      try {
        await deletePortfolio(id); // API call
        setPortfolio(prev => prev?.filter(p => p.id !== id));
        console.log("Delete Succeded", id);
      } catch (err) {
        console.error("Delete failed", err);
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

      <Button variant="outline" style={{ margin: 10}} onClick={startRisk}>Run Risk</Button>
      <Button variant="destructive" style={{marginLeft: 25, margin: 15, padding: 12}} onClick={() => handleDelete(p.id)}>Delete</Button>
    </div>
  );
}
