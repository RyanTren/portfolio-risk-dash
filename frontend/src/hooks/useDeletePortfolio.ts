import { useState } from "react";
import { deletePortfolio } from "../api/portfolio";
import type { AlertColor } from "../types/alert";

type ShowAlert = (color: AlertColor, title: string) => void;

export function useDeletePortfolio(showAlert: ShowAlert) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number, onSuccess?: () => void) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this portfolio?"
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await deletePortfolio(id);
      showAlert("success", "Delete successful!");
      onSuccess?.();
    } catch {
      showAlert("danger", "Delete failed!");
    } finally {
      setLoading(false);
    }
  };

  return { handleDelete, loading };
}
