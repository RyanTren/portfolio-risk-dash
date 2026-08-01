import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Spinner } from "@heroui/react";

import { usePortfolio } from "../../hooks/usePortfolio";
import { useDeletePortfolio } from "../../hooks/useDeletePortfolio";
import { useAlert } from "../../hooks/useAlert";
import { runRisk } from "../../api/risk";
import AlertPopUp from "../../components/ui/alert";
import { Button } from "../../components/ui/button";

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const portfolioId = Number(id);

  const { portfolio, loading } = usePortfolio(portfolioId);
  const { alert, showAlert } = useAlert();
  const { handleDelete } = useDeletePortfolio(showAlert);

  const startRisk = async () => {
    const res = await runRisk(portfolioId);
    navigate(`/risk/${res.data.jobId}`);
  };

  if (loading || !portfolio) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center justify-center">
          <Spinner size="lg" /> Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-semibold mb-4">{portfolio.name}</h2>
      <p className="text-muted-foreground mb-6">
        Positions: {portfolio.positions?.length ?? 0}
      </p>

      <h3 className="text-xl font-medium mb-3">Tickers:</h3>
      <ul className="space-y-2 mb-8">
        {portfolio.positions?.map((pos) => (
          <li key={pos.id} className="text-sm">
            {pos.ticker} — {pos.quantity} shares @ ${pos.price}
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {alert && <AlertPopUp color={alert.color} title={alert.title} />}
      </AnimatePresence>

      <div className="flex gap-3">
        <Button variant="outline" onClick={startRisk}>
          Run Risk
        </Button>
        <Button
          variant="destructive"
          onClick={() =>
            handleDelete(portfolio.id, () => navigate("/portfolios"))
          }
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
