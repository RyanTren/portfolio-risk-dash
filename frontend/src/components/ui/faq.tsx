import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

import styles from "../../styles/faq.module.css";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqProps {
  heading?: string;
  items?: FaqItem[];
}

const Faq = ({
  heading = "Frequently asked questions",
  items = [
    {
    id: "faq-1",
    question: "Is this financial advice?",
    answer:
      "No. This project is for learning and demonstration only. Nothing here should be interpreted as financial, legal, or investment advice.",
  },
  {
    id: "faq-2",
    question: "Are the risk metrics accurate?",
    answer:
      "Not necessarily. All calculations such as VaR, stress tests, and volatility are simplified estimates intended for educational purposes only.",
  },
  {
    id: "faq-3",
    question: "Can I use this tool to make real investment decisions?",
    answer:
      "No. This tool is not designed for real financial decision-making and should not be relied on for trading or planning.",
  },
  {
    id: "faq-4",
    question: "Is this project affiliated with any financial companies?",
    answer:
      "No. This project is not affiliated with or endorsed by any financial institutions or advisors.",
  },
  {
    id: "faq-5",
    question: "Does this tool store or transmit my data?",
    answer:
      "No. Any data you upload or enter is processed locally in your browser or development environment.",
  },
  {
    id: "faq-6",
    question: "Does this project meet any compliance or regulatory standards?",
    answer:
      "No. This is a personal learning project and is not intended to meet regulatory or compliance requirements.",
  },
  {
    id: "faq-7",
    question: "Why does the dashboard look similar to real financial tools?",
    answer:
      "The interface is inspired by modern risk dashboards, but all simulated data and calculations are simplified.",
  },
  {
    id: "faq-8",
    question: "Can I add my real investment portfolio?",
    answer:
      "It is not recommended. Use mock or sample data only, since outputs are not suitable for real financial analysis.",
  },
  {
    id: "faq-9",
    question: "Who is this project for?",
    answer:
      "This project is intended for developers and students practicing React, TypeScript, risk modeling concepts, and dashboard UI design.",
  }
  ],
}: FaqProps) => {
  return (
  <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.reset}>
        <h1 style={{ textShadow: "black 0.5px 0.5px 1px" }} className={styles.heading}>{heading}</h1>
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </div>
      </div>
    </section>
  );
};

export { Faq };
