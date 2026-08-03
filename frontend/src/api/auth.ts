import API from "./api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  role: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  displayName: string | null;
  role: string;
  hasGoogleLinked: boolean;
  createdAt: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AdminPortfolio {
  id: number;
  name: string;
  positionCount: number;
  createdAt: string;
  riskResultCount: number;
}

export interface AdminPortfolioDetail {
  id: number;
  name: string;
  createdAt: string;
  positionCount: number;
  riskResults: Array<{
    id: number;
    portfolioValue: number | null;
    vaR: number | null;
    stressLoss: number | null;
    timestamp: string;
  }>;
}

export const authApi = {
  login: (data: LoginRequest) =>
    API.post<UserResponse>("/api/auth/login", data),

  register: (data: RegisterRequest) =>
    API.post("/api/auth/register", {
      ...data,
      role: data.role || "User",
    }),

  googleLogin: (credential: string) =>
    API.post<UserResponse>("/api/auth/google", { credential }),

  logout: () => API.post("/api/auth/logout"),

  me: () => API.get<User>("/api/auth/me"),

  getProfile: () => API.get<UserProfile>("/api/auth/profile"),

  updateProfile: (data: UpdateProfileRequest) =>
    API.put<UserProfile>("/api/auth/profile", data),

  changePassword: (data: ChangePasswordRequest) =>
    API.post("/api/auth/change-password", data),

  getGoogleClientId: () => API.get<{ clientId: string }>("/api/auth/google-client-id"),
};

export const adminApi = {
  getUsers: () => API.get<User[]>("/api/admin/users"),

  getUser: (id: number) => API.get<User>(`/api/admin/users/${id}`),

  getUserPortfolios: (userId: number) =>
    API.get<AdminPortfolio[]>(`/api/admin/users/${userId}/portfolios`),

  getPortfolioDetail: (portfolioId: number) =>
    API.get<AdminPortfolioDetail>(`/api/admin/portfolios/${portfolioId}`),
};
