import { useEffect, useState } from "react";
import { getRiskStatus } from "../../api/risk";
import type { RiskResult } from "../../types/risk";
import RiskChart from "./components/RiskChart";
import { useParams } from "react-router-dom";
import { Spinner } from "@heroui/react";
import AlertPopUp from "../../components/ui/alert";
import { useAlert } from "../../hooks/useAlert";
import { AnimatePresence } from "framer-motion";

export default function RiskResultPage() {
  const { id } = useParams();
  const [result, setResult] = useState<RiskResult | null>(null);
  const { alert, showAlert } = useAlert();

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await getRiskStatus(Number(id));
      setResult(res.data);

      if (res.data.status === "Completed" || res.data.status === "Failed") {
        clearInterval(interval);
        if (res.data.status === "Completed") {
          showAlert("success", "Risk Run Completed!");
        } else {
          showAlert("danger", "Risk Run Failed!");
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [id, showAlert]);

  if (!result)
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <AnimatePresence>
        {alert && <AlertPopUp color={alert.color} title={alert.title} />}
      </AnimatePresence>

      <h2 className="text-3xl font-semibold text-center mb-8">
        Risk Run #{result.riskId}
      </h2>
      <p className="text-center text-muted-foreground mb-6">
        Status: {result.status}
      </p>

      {result.status === "Completed" && (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-3 gap-6 mb-8 w-full max-w-md">
            <div className="text-center p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
              <p className="text-xl font-semibold">
                ${result.portfolioValue?.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">VaR</p>
              <p className="text-xl font-semibold">
                ${result.vaR?.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-1">Stress Loss</p>
              <p className="text-xl font-semibold">
                ${result.stressLoss?.toLocaleString()}
              </p>
            </div>
          </div>

          <RiskChart
            value={result.portfolioValue!}
            varValue={result.vaR!}
            stressLoss={result.stressLoss!}
          />
        </div>
      )}
    </div>
  );
}
