import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5233",
});

// ===== PORTFOLIOS =====
export const uploadPortfolio = (formData: FormData) =>
  API.post("/api/portfolio/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getPortfolios = () =>
  API.get("/api/portfolio/");

export const getPortfolio = (id: number) =>
  API.get(`/api/portfolio/${id}`);

export const deletePortfolio = (id: number) =>
  API.delete(`/api/portfolio/${id}`);


// ===== RISK JOBS =====
export const runRisk = (portfolioId: number) =>
  API.post("/risk/run", { portfolioId });

export const getRiskStatus = (id: number) =>
  API.get(`/risk/status/${id}`);
