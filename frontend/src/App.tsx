import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import PortfolioList from "./pages/PortfolioList";
import PortfolioUpload from "./pages/PortfolioUpload";
import PortfolioDetail from "./pages/PortfolioDetail";
import RiskResultPage from "./pages/RiskResultPage";
import RunRisk from "./pages/RunRisk";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        <Route path="/" element={<PortfolioList />} />
        <Route path="/upload" element={<PortfolioUpload />} />

        <Route path="/portfolio/:id" element={<PortfolioDetail />} />

        <Route path="/risk/:id" element={<RiskResultPage />} />

        <Route path="run-risk" element={<RunRisk/>}></Route>

      </Routes>
    </Router>
  );
}

export default App;
