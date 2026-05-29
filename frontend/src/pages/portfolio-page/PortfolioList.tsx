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
                <h3 className="flex items-center gap-2 text-lg font-thin text-shadow-md text-shadow-emerald-500 ">
                  <ChartCandlestick className="w-6 h-6" />
                  {p.name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  Tickers: {p.positions.length}
                </p>
              </Link>

              <Button
                variant="destructive"
                className="relative float-right box-shadow-lg"
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
