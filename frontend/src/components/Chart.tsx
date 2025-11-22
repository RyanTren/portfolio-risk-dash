import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/globals.css";

const data = [
  { name: "Jan", value: 32917 },
  { name: "Feb", value: 14917 },
  { name: "Mar", value: 61917 },
  { name: "Apr", value: 144917 },
  { name: "May", value: 8917 },
  { name: "Jun", value: 31917 },
  { name: "Jul", value: 184917 },
];

export default function DashboardPreview() {
  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
