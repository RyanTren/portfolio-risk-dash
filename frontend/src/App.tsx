// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import {HeroUIProvider} from "@heroui/react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ui/theme/theme-provider";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import PortfolioList from "./pages/portfolio-page/PortfolioList";
import PortfolioUpload from "./pages/portfolio-page/components/PortfolioUpload";
import PortfolioDetail from "./pages/portfolio-page/PortfolioDetail";
import RiskResultPage from "./pages/risk-page/RiskResultPage";
import RunRisk from "./pages/risk-page/RunRisk";
import HomePage from "./pages/home-page/Home";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserPortfolios from "./pages/admin/AdminUserPortfolios";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HeroUIProvider>
      <MantineProvider>
        <AuthProvider>
        <div className="bg-background text-foreground">
          <Router>
            <Navbar  />
            <Routes>

              <Route path="/" element={<HomePage />}></Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/portfolios" element={
                <ProtectedRoute>
                  <PortfolioList />
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <PortfolioUpload />
                </ProtectedRoute>
              } />

              <Route path="/portfolio/:id" element={
                <ProtectedRoute>
                  <PortfolioDetail />
                </ProtectedRoute>
              } />

              <Route path="/risk/:id" element={
                <ProtectedRoute>
                  <RiskResultPage />
                </ProtectedRoute>
              } />

              <Route path="/run-risk" element={
                <ProtectedRoute>
                  <RunRisk/>
                </ProtectedRoute>
              }></Route>

              {/* Admin Routes */}
              <Route path="/admin/users" element={
                <ProtectedRoute roles={["Admin"]}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/users/:id" element={
                <ProtectedRoute roles={["Admin"]}>
                  <AdminUserPortfolios />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />

            </Routes>
            <Footer />
          </Router>
        </div>
        </AuthProvider>
      </MantineProvider>
      </HeroUIProvider>
    </ThemeProvider>
  );
}

export default App;
