import { Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ChartCandlestick } from "lucide-react";

import { usePortfolios } from "../../hooks/usePortfolios";
import { useDeletePortfolio } from "../../hooks/useDeletePortfolio";
import { useAlert } from "../../hooks/useAlert";
import AlertPopUp from "../../components/ui/alert";
import { Button } from "../../components/ui/button";

export default function PortfolioList() {
  const { portfolios, loading, error, refetch } = usePortfolios();
  const { alert, showAlert } = useAlert();
  const { handleDelete } = useDeletePortfolio(showAlert);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Loading portfolios...</p>
      </div>
    );
  }

  if (error || portfolios.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">
          {error || "No portfolios found."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 m-5 gap-5">
      <AnimatePresence>
        {alert && <AlertPopUp color={alert.color} title={alert.title} />}
      </AnimatePresence>
      <h2>Portfolios</h2>

      <ul className="flex flex-col gap-4 border rounded-md p-3 m-4 bg-accent">
        {portfolios.map((p) => (
          <li
            className="flex flex-col gap-4 border rounded-md p-6 m-1 bg-accent"
            key={p.id}
          >
            <Link to={`/portfolio/${p.id}`}>
              <h3 className="flex items-center gap-2 text-lg font-thin text-shadow-md text-shadow-emerald-500">
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
              onClick={() => handleDelete(p.id, refetch)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
