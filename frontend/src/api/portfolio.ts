import API from "./api";
import { ROUTES } from "./routes";

export const uploadPortfolio = (formData: FormData) =>
  API.post(ROUTES.PORTFOLIO.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getPortfolios = () =>
  API.get(ROUTES.PORTFOLIO.BASE);

export const getPortfolio = (id: number) =>
  API.get(ROUTES.PORTFOLIO.BY_ID(id));

export const deletePortfolio = (id: number) =>
  API.delete(ROUTES.PORTFOLIO.BY_ID(id));
