import { Card, CardContent, CardTitle } from "../components/ui/card";

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16 px-4">
      <Card className="shadow-lg hover:scale-105 transition-transform">
        <CardTitle>Portfolio Analysis</CardTitle>
        <CardContent>
          Analyze your portfolio with detailed risk metrics and stress tests.
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:scale-105 transition-transform">
        <CardTitle>AI Insights</CardTitle>
        <CardContent>
          Get AI-assisted explanations of risk results in plain language.
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:scale-105 transition-transform">
        <CardTitle>Visual Analytics</CardTitle>
        <CardContent>
          Explore your exposures with heatmaps, charts, and dashboards.
        </CardContent>
      </Card>
    </div>
  );
}
