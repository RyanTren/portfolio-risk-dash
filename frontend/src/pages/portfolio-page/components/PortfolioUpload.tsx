import React, { useState, useRef } from "react";
import { uploadPortfolio, getPortfolios } from "../../../api/api";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import AlertPopUp from "../../../components/ui/alert";
import { useAlert } from "../../../hooks/useAlert";
import { DropzoneButton } from "../../../components/ui/dropdown/DropzoneButton";
import "../../../styles/globals.css";
import { AnimatePresence } from "framer-motion";


export default function PortfolioUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const { alert, showAlert } = useAlert();
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const redirectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!alert) return;
    // const timer = setTimeout(() => showAlert(null), 3000);
    // return () => clearTimeout(timer);
  }, [alert]);

  // clear redirect timer if component unmounts mid-flight
  React.useEffect(() => {
    return () => {
      if (redirectRef.current) clearTimeout(redirectRef.current);
    };
  }, []);

  const doUpload = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const response = await uploadPortfolio(formData);
      console.log("Upload successful", response.data);

      showAlert("success", "Upload successful!");
      setFile(null);
      setName("");

      redirectRef.current = setTimeout(() => {
        window.location.href = "/portfolios";
      }, 1500);
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } };
      showAlert("danger", `Upload failed: ${error.response?.status ?? "Unknown"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim())
      return showAlert("warning", "Portfolio name is required!");
    if (!file)
      return showAlert("warning", "No file was selected!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    try {
      const existing = await getPortfolios();
      const isDuplicate = existing.data.some(
        (p: { name: string }) => p.name.toLowerCase() === name.trim().toLowerCase()
      );
      if (isDuplicate) {
        setPendingFormData(formData);
        setShowDuplicateModal(true);
        return;
      }
    } catch {
      // check failed — proceed anyway
    }

    doUpload(formData);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <AnimatePresence>
        {alert && <AlertPopUp color={alert.color} title={alert.title} />}
      </AnimatePresence>

      {showDuplicateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl flex flex-col gap-4">
            <h3 className="font-semibold text-lg">Duplicate Portfolio Name</h3>
            <p className="text-sm text-muted-foreground">
              A portfolio named <span className="font-medium">"{name}"</span> already exists.
              Do you want to upload anyway?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => { setShowDuplicateModal(false); setPendingFormData(null); }}>
                Cancel
              </Button>
              <Button onClick={() => { setShowDuplicateModal(false); if (pendingFormData) doUpload(pendingFormData); }}>
                Upload Anyway
              </Button>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-center mb-6">Upload Portfolio</h2>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="portfolioName">Portfolio Name</Label>
          <Input
            id="portfolioName"
            placeholder="Portfolio Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="portfolioFile">Portfolio File</Label>
          <DropzoneButton onFileSelect={(f) => setFile(f)} />
        </div>
        <Button type="submit" variant="outline" disabled={isLoading} className="flex items-center gap-2">
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowUpFromLine size={16} />}
          {isLoading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </div>
  );
}