import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons"

// import "../styles/globals.css"
import Hero from "../components/Hero";
import DashboardPreview from "../components/Chart";
// import RiskTable from "../components/RiskTable";

import { BentoCard, BentoGrid } from "../components/ui/bento-grid"

const features = [
  {
    Icon: FileTextIcon,
    name: "Portfolio Analysis",
    description: "Analyze your portfolio with detailed risk metrics and stress tests.",
    href: "/portfolios",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "AI Insights",
    description: "Get AI-assisted explanations of risk results in plain language.",
    href: "/run-risk",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Visual Analytics",
    description: "Explore your exposures with heatmaps, charts, and dashboards.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Historical Tracking",
    description: "Track portfolio performance and risk metrics over time.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Risk Alerts",
    description: "Get notified when portfolio risk exceeds your defined thresholds.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -top-20 -right-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
]

export default function HomePage() {
  return(
    <div className="page flex flex-col gap-12 p-8"> 
      {/* Hero Section */}
      <Hero />

      <div className="space-y-8">
        <div>
          <h2 className="mt-10 text-2xl font-regular mb-2">Gain Financial Literacy <br></br> No Gimmicks</h2>
          <p>Understand, measure, and monitor portfolio risk using modern quantitative methods and real-time AI explanations.</p>
        </div>
      </div>

      {/* Bento Grid with features */}
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>

      {/* Other sections */}
      <DashboardPreview />
      {/* <RiskTable /> */}

      {/* Info sections */}
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">How To</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Upload/Connect your portfolio.</li>
            <li>Run a risk calculation and review your dashboard (VaR, Stress Loss, exposure heatmap).</li>
            <li>Use AI Insights to interpret results in plain language, fast and intuitive.</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Real-time AI-Insights</h3>
          <p>Our AI assistant can summarize risk results, explain terminology, and help you explore scenarios. It cannot provide financial recommendations.</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Frequently asked questions</h3>
          <p>**Disclaimer** AI-generated outputs are for educational use only and are not verified financial advice.</p>
        </div>
      </div>
    </div>
  );
}