import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <h2 className="text-4xl font-bold">404</h2>
      <p className="text-muted-foreground">Page not found.</p>
      <Link to="/" className="text-primary underline">
        Go home
      </Link>
    </div>
  );
}
