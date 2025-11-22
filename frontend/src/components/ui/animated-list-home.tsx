"use client"

import { cn } from "../../lib/utils"
import { AnimatedList } from "../../components/ui/animated-list"
import "../../styles/globals.css"

interface Item {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

let notifications = [
  {
    name: "Portfolio VaR exceeded threshold",
    description: "Risk Engine",
    time: "15m ago",
    icon: "⚠️",
    color: "#c96100ff",
  },
  {
    name: "High volatility spike detected (VIX +12%)",
    description: "Market Monitor",
    time: "10m ago",
    icon: "🔥",
    color: "#ffe600ff",
  },
  {
    name: "New position added: AAPL 50 shares",
    description: "Portfolio Sync",
    time: "5m ago",
    icon: "➕",
    color: "#4dff3dff",
  },
  {
    name: "Stress test completed — -8.4% projected loss",
    description: "Risk Engine",
    time: "2m ago",
    icon: "🧪",
    color: "#1E86FF",
  },
  {
    name: "Sector exposure limit breached (Energy > 25%)",
    description: "Compliance Monitor",
    time: "22m ago",
    icon: "🎯",
    color: "#ff3b3b",
  },
  {
    name: "Credit rating downgraded (A → BBB+)",
    description: "Risk Engine",
    time: "18m ago",
    icon: "📉",
    color: "#ff6b6b",
  },
  {
    name: "Liquidity ratio dropped below safe threshold",
    description: "Market Monitor",
    time: "12m ago",
    icon: "💧",
    color: "#00b3ff",
  },
  {
    name: "Counterparty risk increased by 8%",
    description: "Risk Engine",
    time: "8m ago",
    icon: "🏦",
    color: "#6A4CFF",
  },
  {
    name: "New stress scenario added: 'Recession Shock'",
    description: "Scenario Library",
    time: "6m ago",
    icon: "📊",
    color: "#7c5cff",
  },
  {
    name: "Market gap risk detected in Futures positions",
    description: "Risk Engine",
    time: "4m ago",
    icon: "📛",
    color: "#ff5252",
  },
  {
    name: "Portfolio rebalanced successfully",
    description: "Portfolio Sync",
    time: "3m ago",
    icon: "🔄",
    color: "#2ecc71",
  },
  {
    name: "Correlation spike across Tech holdings",
    description: "Analytics Engine",
    time: "14m ago",
    icon: "📈",
    color: "#0099ff",
  },
  {
    name: "Interest rate shock simulation updated",
    description: "Scenario Library",
    time: "7m ago",
    icon: "🏦",
    color: "#1E86FF",
  },
  {
    name: "Drawdown alert triggered (-5.3% daily loss)",
    description: "Market Monitor",
    time: "11m ago",
    icon: "🚨",
    color: "#ff4747",
  },
  {
    name: "Portfolio diversification score decreased",
    description: "Analytics Engine",
    time: "9m ago",
    icon: "🌐",
    color: "#4fd1c5",
  },
  {
    name: "New AI insight available for risk report",
    description: "AI Engine",
    time: "1m ago",
    icon: "🤖",
    color: "#a855f7",
  },
  {
    name: "Update: VaR recalculated after market move",
    description: "Risk Engine",
    time: "16m ago",
    icon: "📘",
    color: "#3b82f6",
  },
  {
    name: "Position limit warning reached for TSLA",
    description: "Compliance Monitor",
    time: "19m ago",
    icon: "⚡",
    color: "#facc15",
  },
  {
    name: "FX exposure increased in EUR/USD pair",
    description: "Market Monitor",
    time: "13m ago",
    icon: "💱",
    color: "#3abff8",
  },
  {
    name: "New benchmark tracking error alert",
    description: "Analytics Engine",
    time: "17m ago",
    icon: "📏",
    color: "#22c55e",
  },
];


notifications = Array.from({ length: 10 }, () => notifications).flat()

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-700 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-black/10 dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-md">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre dark:text-white dark:bg-black/10 dark:p-1 dark:rounded-md">
            <span className="text-sm sm:text-md dark:text-white">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500 dark:text-white">{time}</span>
          </figcaption>
          <p className="text-sm font-thin dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  )
}

export function AnimatedListHome({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex h-[350px] w-full flex-col overflow-hidden p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t"></div>
    </div>
  )
}
