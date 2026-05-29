import { useEffect, useState } from "react";
import { getPortfolios, deletePortfolio } from "../../api/api";
import type { Portfolio } from "../../types/portfolio";
import { Link } from "react-router-dom";
import AlertPopUp  from "../../components/ui/alert";
import { useAlert } from "../../hooks/useAlert";
import { Button } from "../../components/ui/button";
import { AnimatePresence } from "framer-motion";
import { ChartCandlestick } from 'lucide-react';


export default function PortfolioList() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const { alert, showAlert } = useAlert();

  // useEffect for auto-dismiss alert after 3 seconds
  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  // Fetch portfolios on component mount
  useEffect(() => {
    getPortfolios()
      .then(res => setPortfolios(res.data))
      .catch(() => showAlert("danger", "Failed to load portfolios."));
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      await deletePortfolio(id); // API call
      setPortfolios(prev => prev.filter(p => p.id !== id));
      console.log("Delete Succeded", id);
      showAlert("success", "Delete successful!");
    } catch (err) {
      console.error("Delete failed", err);
      showAlert("danger", "Delete Failed!");
    }
  };

  if (!portfolios || portfolios.length === 0) {
    return(
    <div className="flex items-center justify-center h-[60vh]">
      <p className="text-muted-foreground">
        No portfolios found.
      </p>
    </div>
    );
  }

  return (
    <div className="p-5 m-5 gap-5">
      <AnimatePresence>{alert && <AlertPopUp color={alert.color} title={alert.title} />}</AnimatePresence>
      <h2>Portfolios</h2>

      <ul className="flex flex-col gap-4 border rounded-md p-3 m-4 bg-accent">
        {portfolios.length === 0 ? (
          <p className="text-muted-foreground justify-content center">No portfolios found.</p>
        ) : (
          portfolios.map(p => (
            <li className="flex flex-col gap-4 border rounded-md p-6 m-1 bg-accent" key={p.id}>
              <Link to={`/portfolio/${p.id}`}>
                {p.name} <ChartCandlestick className="w-4 h-4" /> Tickers: {p.positions.length}
              </Link>
              <Button
                variant="destructive"
                className="relative float-right"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
