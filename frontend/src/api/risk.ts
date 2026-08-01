import API from "./api";
import { ROUTES } from "./routes";

export const runRisk = (portfolioId: number) =>
  API.post(ROUTES.RISK.RUN, { portfolioId });

export const getRiskStatus = (id: number) =>
  API.get(ROUTES.RISK.STATUS(id));
