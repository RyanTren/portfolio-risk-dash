import { useEffect, useState } from "react";
import { getPortfolios, deletePortfolio } from "../api/api";
import { Portfolio } from "../types/types";
import { Link } from "react-router-dom";

export default function PortfolioList() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    getPortfolios().then(res => setPortfolios(res.data));
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      await deletePortfolio(id); // API call
      setPortfolios(prev => prev.filter(p => p.id !== id));
      console.log("Delete Succeded", id);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };


  return (
    <div style={{ padding: 20 }}>
      <h2>Portfolios</h2>

      <ul>
        {portfolios.map(p => (
          <li key={p.id}>
            <Link to={`/portfolio/${p.id}`}>
              {p.name} — {p.positions.length} positions
            </Link>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
