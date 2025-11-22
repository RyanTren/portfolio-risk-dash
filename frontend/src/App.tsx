// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./components/ui/theme-provider";

import PortfolioList from "./pages/PortfolioList";
import PortfolioUpload from "./components/ui/PortfolioUpload";
import PortfolioDetail from "./pages/PortfolioDetail";
import RiskResultPage from "./pages/RiskResultPage";
import RunRisk from "./pages/RunRisk";
import HomePage from "./pages/Home";
import Footer from "./components/Footer";

function App() {
  return (
    <MantineProvider>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Navbar  />
        <Routes>

          <Route path="/" element={<HomePage />}></Route>
          <Route path="/portfolios" element={<PortfolioList />} />
          <Route path="/upload" element={<PortfolioUpload />} />

          <Route path="/portfolio/:id" element={<PortfolioDetail />} />

          <Route path="/risk/:id" element={<RiskResultPage />} />

          <Route path="run-risk" element={<RunRisk/>}></Route>

        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
    </MantineProvider>
  );
}

export default App;
