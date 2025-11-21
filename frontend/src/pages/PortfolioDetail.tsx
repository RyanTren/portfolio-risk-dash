import { useEffect, useState } from "react";
import { getPortfolio, runRisk } from "../api/api";
import type { Portfolio } from "../types/types";
import { useParams, useNavigate } from "react-router-dom";

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    getPortfolio(Number(id)).then(res => setPortfolio(res.data));
  }, [id]);

  useEffect(() => {
  getPortfolio(Number(id)).then(res => {
    console.log("Raw API response:", res.data);
    setPortfolio(res.data);
  });
}, [id]);


  const startRisk = async () => {
    const res = await runRisk(Number(id));
    const jobId = res.data.jobId;
    navigate(`/risk/${jobId}`);
  };

  if (!portfolio) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{portfolio.name}</h2>
      <p>Positions: {portfolio.positions?.length ?? 0}</p>

      <h3>Tickers:</h3>
      <ul>
        {portfolio.positions?.map(pos => (
          <li key={pos.id}>
            {pos.ticker} — {pos.quantity} shares @ ${pos.price}
          </li>
        ))}
      </ul>

      <button onClick={startRisk}>Run Risk</button>
    </div>
  );
}
