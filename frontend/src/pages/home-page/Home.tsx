import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../styles/globals.css";
import Hero from "./components/Hero";
import DashboardPreview from "../../components/Chart";
import { Safari } from "./components/safari";
import { AnimatedListHome } from "../../components/ui/animated-list/animated-list-home";
import { Faq } from "../../components/ui/faq/faq";
import HeroCard from "./components/HeroCardUI";
import { BentoCard, BentoGrid } from "./components/bento-grid";

import { features } from "./constants/features";
import { steps } from "./constants/steps";
import { heroImage } from "./constants/hero-image";
import {STEP_LINK_CLASS, TEXT_SHADOW} from "./constants/tailwind";

export default function HomePage() {
  return (
    <div className="page flex flex-col gap-12 p-8">
      <Hero />

      <div className="space-y-8">
        <h2 style={TEXT_SHADOW} className="mt-10 text-2xl font-regular mb-2">
          Gain Financial Literacy <br /> No Gimmicks
        </h2>
      </div>

      <BentoGrid className="lg:grid-rows-3">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>

      <h3 style={TEXT_SHADOW} className="pt-10 text-2xl font-medium mb-10 text-center">
        Predict Loss and Mitigate Risk.
      </h3>

      <div className="pb-10 flex gap-1 flex-col lg:flex-row">
        <div className="flex-1"><DashboardPreview /></div>
        <div className="flex-1"><AnimatedListHome /></div>
      </div>

      <div className="space-y-8">
        <div className="text-center">
          <h3 style={TEXT_SHADOW} className="text-3xl font-medium mb-2">
            Calculate risk in 3 steps
          </h3>
          <h5 className="text-lg font-light mb-2">
            Seamless user experience with clean, beautiful <br /> data visualizations.
          </h5>
        </div>

        <ol className="flex justify-center space-x-8 list-decimal list-inside">
          {steps.map(({ href, label }) => (
            <li key={href} className="flex flex-col items-center">
              <HeroCard
                placeImage={heroImage}
                footerText={
                  <a className={STEP_LINK_CLASS} href={href}>
                    {label}
                  </a>
                }
              />
            </li>
          ))}
        </ol>
      </div>

      <div className="text-center mt-16 px-4">
        <h2 style={{ ...TEXT_SHADOW, padding: "1rem", margin: "1rem" }} className="text-3xl font-medium mb-2">
          Real-time. <br /> Specialized AI Insights.
        </h2>
        <p className="text-md font-thin mb-2">
          Summarize risk results, explain terminology, and help you explore scenarios.
        </p>
        <Safari
          className="w-full max-w-6xl mx-auto aspect-video mt-4"
          url="/ai-insights"
          imageSrc="https://placehold.co/1200x750?text=Hello+World"
        />
      </div>

      <Faq />
    </div>
  );
}