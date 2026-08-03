import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "@heroui/react";
import { adminApi, type AdminPortfolio, type User } from "../../api/auth";

export default function AdminUserPortfolios() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [portfolios, setPortfolios] = useState<AdminPortfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [userRes, portfoliosRes] = await Promise.all([
          adminApi.getUser(Number(id)),
          adminApi.getUserPortfolios(Number(id)),
        ]);
        setUser(userRes.data);
        setPortfolios(portfoliosRes.data);
      } catch {
        setError("Failed to load user data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/admin/users" className="text-primary hover:underline text-sm">
          &larr; Back to Users
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">
        Portfolios for {user?.username}
      </h1>
      <p className="text-muted-foreground mb-6">
        Role: {user?.role} | Member since: {user ? new Date(user.createdAt).toLocaleDateString() : ""}
      </p>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-6 py-4 font-medium">ID</th>
              <th className="text-left px-6 py-4 font-medium">Name</th>
              <th className="text-left px-6 py-4 font-medium">Positions</th>
              <th className="text-left px-6 py-4 font-medium">Risk Runs</th>
              <th className="text-left px-6 py-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {portfolios.map((portfolio) => (
              <tr key={portfolio.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-6 py-4">{portfolio.id}</td>
                <td className="px-6 py-4 font-medium">{portfolio.name}</td>
                <td className="px-6 py-4">{portfolio.positionCount}</td>
                <td className="px-6 py-4">{portfolio.riskResultCount}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(portfolio.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {portfolios.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">No portfolios found.</p>
        )}
      </div>
    </div>
  );
}
