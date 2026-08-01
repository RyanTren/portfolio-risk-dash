import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface RiskChartProps {
  value: number;
  varValue: number;
  stressLoss: number;
}

export default function RiskChart({ value, varValue, stressLoss }: RiskChartProps) {
  const data = [
    { name: "Portfolio Value", amount: value },
    { name: "VaR", amount: varValue },
    { name: "Stress Loss", amount: stressLoss },
  ];

  return (
    <BarChart width={500} height={300} data={data}>
      <CartesianGrid />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="amount" fill="#8884d8" />
    </BarChart>
  );
}
