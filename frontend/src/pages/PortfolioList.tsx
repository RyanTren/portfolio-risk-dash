import React, { useEffect, useState } from "react";
import { getPortfolios, deletePortfolio } from "../api/api";
import type { Portfolio } from "../types/types";
import { Link } from "react-router-dom";
import AlertPopUp  from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { AnimatePresence } from "framer-motion";

type AlertColor =
  | "success"
  | "danger"
  | "default"
  | "primary"
  | "secondary"
  | "warning";

import { Button } from "../components/ui/button";

export default function PortfolioList() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [alert, setAlert] = useState<{ color: AlertColor; title: string } | null>(null);

  React.useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

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
      setAlert({
        color: "success",
        title: "Delete successful!",
      });
    } catch (err) {
      console.error("Delete failed", err);
      setAlert({
        color: "danger",
        title: "Delete Failed!",
      });
    }
  };


  return (
    <div style={{ padding: 20, margin: 20, gap: 10 }}>
      <AnimatePresence>{alert && <AlertPopUp color={alert.color} title={alert.title} />}</AnimatePresence>
      <h2>Portfolios</h2>

      <ul>
        {portfolios.map(p => (
          <li key={p.id}>
            <Link to={`/portfolio/${p.id}`}>
              Portfolio Name | {p.name} | {p.positions.length} positions
            </Link>
            <Button variant="destructive" style={{marginLeft: 25, margin: 15, padding: 12}} onClick={() => handleDelete(p.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
