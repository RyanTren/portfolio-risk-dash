import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
  BellIcon,
  CalendarIcon,
  FileTextIcon,
  GlobeIcon,
  InputIcon,
} from "@radix-ui/react-icons"

import "../styles/globals.css"
import Hero from "../components/Hero";
import DashboardPreview from "../components/Chart";
import { Safari } from "../components/ui/safari";
import { AnimatedListHome } from "../components/ui/animated-list-home"; 
import { Faq } from "../components/ui/faq";
// import RiskTable from "../components/RiskTable";

import HeroCardUI from "../components/ui/HeroCardUI";


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
          <h2 className="mt-10 text-2xl font-regular mb-2">Gain Financial Literacy <br></br> No Gimmicks</h2>
      </div>

      {/* Bento Grid with features */}
      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>

      {/* Other sections */}
      <h3 className="pt-10 text-2xl font-medium mb-10 text-center">Predict Loss and Mitigate Risk.</h3>
      <div className="pb-10 flex gap-1 flex-col lg:flex-row">
        <div className="flex-1">
          <DashboardPreview />
        </div>
        <div className="flex-1">
          <AnimatedListHome />
        </div>
      </div>



      {/* <RiskTable /> */}

      {/* Info sections */}
      <HeroCardUI />
       

      <div className="space-y-8">
        <div>
          <div style={{textAlign: "center"}}>
            <h3 style={{textShadow: "black-500"}} className="text-3xl font-medium mb-2 ta-center">Calculate risk in 3 steps</h3>
            <h5 className="text-lg font-light mb-2">Seamless user experience with clean, beautiful <br></br>data visualizations.</h5>
          </div>

          <ol className="list-decimal list-inside space-y-1">
            <li>
              <a className="text-blue-600 underline underline-offset-1 after:content-['_↗']" href="/upload">
                Upload/Connect
              </a> 
              your portfolio.
            </li>

            <li>Run a <a className="text-blue-600  underline underline-offset-1 after:content-['_↗']" href="/run-risk">
                risk calculation
              </a> and review your dashboard (VaR, Stress Loss, exposure heatmap).</li>
            <li>Use AI Insights to interpret results in plain language, fast and intuitive.</li>
          </ol>
        </div>

        <div style={{textAlign: "center", marginTop: "4rem", padding: "0 1rem"}}>
          <h2 style={{padding: "1rem", margin: "1rem"}} className="text-3xl font-medium mb-2">Real-time. <br></br> Specialized AI Insights.</h2>
          <p className="text-md font-thin mb-2">Summarize risk results, explain terminology, and help you explore scenarios.</p>
          <Safari className="w-full max-w-6xl mx-auto aspect-video mt-4"  url="/ai-insights" imageSrc="https://placehold.co/1200x750?text=Hello+World"  />
        </div>

        <Faq ></Faq>
      </div>
    </div>
  );
}