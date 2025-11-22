import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-32 px-4 flex flex-col items-center text-center">
      <h1 className="text-5xl font-extrabold mb-4">Welcome to RiskVision</h1>
      <p className="text-xl mb-6">
        The future of financial risk management
      </p>
      <div className="flex gap-4">
        <Button variant="link"> 
          <Link to="/upload">
            Get Started
          </Link>
        </Button>
        <Button variant="secondary">Learn More</Button>
      </div>
    </div>
  );
}
