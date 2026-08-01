export const ROUTES = {
  PORTFOLIO: {
    BASE: "/api/portfolio",
    UPLOAD: "/api/portfolio/upload",
    BY_ID: (id: number) => `/api/portfolio/${id}`,
  },
  RISK: {
    RUN: "/risk/run",
    STATUS: (id: number) => `/risk/status/${id}`,
  },
} as const;
