import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
];

export default function DashboardPreview() {
  return (
    <div className="w-full max-w-4xl mx-auto my-16 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Portfolio Risk Trend</h2>
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
