// import { useEffect, useState } from "react";
// import { Button } from "../components/ui/button";
// import { Card, CardContent, CardTitle } from "../components/ui/card";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "../styles/globals.css"
import Hero from "../components/Hero";
import Features from "../components/HighlightCards";
import DashboardPreview from "../components/Chart";
import RiskTable from "../components/RiskTable";

// const data = [
//   { name: "Jan", value: 4000 },
//   { name: "Feb", value: 3000 },
//   { name: "Mar", value: 5000 },
// ];

// const columnDefs = [
//   { headerName: "Asset", field: "asset" },
//   { headerName: "Exposure", field: "exposure" },
//   { headerName: "VaR", field: "var" },
// ];

// const rowData = [
//   { asset: "AAPL", exposure: 50000, var: 2500 },
//   { asset: "GOOG", exposure: 40000, var: 2000 },
//   { asset: "TSLA", exposure: 30000, var: 1800 },
// ];

export default function HomePage() {
return(
  <div className="page flex flex-col"> 
      {/* add a hero section here */}
      <Hero />
      <Features />
      <DashboardPreview />
      <RiskTable />

      
    <div>
      <h2>Purpose</h2>
      <p>Analyze portfolio risk, run stress tests, and understand exposures through modern analytics and AI-assisted explanations.</p>

    </div>

    <div>
      <h3>How To</h3>
      
        <li>
          <p>1. Upload or select a portfolio.</p>
          <p>2. Run a risk calculation (VaR, Stress Loss, exposure heatmap).</p>
          <p>3. Use AI Insights to interpret results in plain language.</p>
        </li>
    </div>

    <div>
      <h3>AI-Insights</h3>
      <p>Our AI assistant can summarize risk results, explain terminology, and help you explore scenarios. It cannot provide financial recommendations.</p>

    </div>

    <div>
      <h3>Disclaimer</h3>
      <p>AI-generated outputs are for educational use only and are not verified financial advice.</p>

    </div>


    {/* add some cool ui library componenets here */}
  </div>
);
}