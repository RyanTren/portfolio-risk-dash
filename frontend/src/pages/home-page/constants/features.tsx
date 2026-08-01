import { BellIcon, CalendarIcon, FileTextIcon, GlobeIcon, InputIcon } from "@radix-ui/react-icons";

const DEFAULT_BG = <img className="absolute -top-20 -right-20 opacity-60" />;

export const features = [
  {
    Icon: FileTextIcon,
    name: "Portfolio Analysis",
    description: "Analyze your portfolio with detailed risk metrics and stress tests.",
    href: "/portfolios",
    cta: "Learn more",
    background: DEFAULT_BG,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: InputIcon,
    name: "AI Insights",
    description: "Get AI-assisted explanations of risk results in plain language.",
    href: "/run-risk",
    cta: "Learn more",
    background: DEFAULT_BG,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Visual Analytics",
    description: "Explore your exposures with heatmaps, charts, and dashboards.",
    href: "/",
    cta: "Learn more",
    background: DEFAULT_BG,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Historical Tracking",
    description: "Track portfolio performance and risk metrics over time.",
    href: "/",
    cta: "Learn more",
    background: DEFAULT_BG,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: BellIcon,
    name: "Risk Alerts",
    description: "Get notified when portfolio risk exceeds your defined thresholds.",
    href: "/",
    cta: "Learn more",
    background: DEFAULT_BG,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
].map(f => ({ ...f, cta: "Learn more", background: DEFAULT_BG }));