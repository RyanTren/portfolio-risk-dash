import { useEffect, useState } from "react";
import { getPortfolios, deletePortfolio } from "../api/api";
import type { Portfolio } from "../types/types";
import { Link } from "react-router-dom";

import { Button } from "../components/ui/button";

export default function PortfolioList() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    getPortfolios().then(res => {
      setPortfolios(res.data);
    });
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
    <div style={{ padding: 20, margin: 20, gap: 10 }}>
      <h2>Portfolios</h2>

      <ul>
        {portfolios.map(p => (
          <li key={p.id}>
            <Link to={`/portfolio/${p.id}`}>
              Portfolio Name | {p.name} | {p.positions.length} positions
            </Link>
            <Button variant="outline" style={{marginLeft: 25, margin: 15, padding: 12}} onClick={() => handleDelete(p.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
