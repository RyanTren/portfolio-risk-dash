import React, { useState } from "react";
import { uploadPortfolio } from "../../api/api";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { ArrowUpFromLine } from "lucide-react";
import AlertPopUp  from "../../components/ui/alert";
import { DropzoneButton } from "../../components/ui/DropzoneButton";

import "../../styles/globals.css";
import { AnimatePresence } from "framer-motion";

type AlertColor =
  | "success"
  | "danger"
  | "default"
  | "primary"
  | "secondary"
  | "warning";

export default function PortfolioUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [alert, setAlert] = useState<{ color: AlertColor; title: string } | null>(null);

  React.useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alert]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setAlert({
        color: "warning",
        title: "No file was selected!",
      });
    ;


        try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);

      const response = await uploadPortfolio(formData);
      console.log("Upload successful", response.data);

      setAlert({
        color: "success",
        title: "Upload successful!",
      });
    } catch (err: unknown) {
      const error = err as { response?: { status?: number; data?: unknown } };
      // console.error("Upload failed", error.response?.status, error.response?.data);

      setAlert({
        color: "danger",
        title: `Upload failed: ${error.response?.status ?? "Unknown"}`,
      });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <AnimatePresence>{alert && <AlertPopUp color={alert.color} title={alert.title} />}</AnimatePresence>
      <h2 className="h2 text-center mb-6">Upload Portfolio</h2>

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
          <Label htmlFor="portfolioFile" >Portfolio File</Label>
          <div>
            <DropzoneButton onFileSelect={(file) => setFile(file)} />
          </div>
        </div>

        <Button type="submit" variant="outline" className="flex items-center gap-2">
          <ArrowUpFromLine size={16} />
          Upload
        </Button>
      </form>
    </div>
  );
}
