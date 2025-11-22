import React, { useState } from "react";
import { uploadPortfolio } from "../../api/api";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { ArrowUpFromLine } from "lucide-react";

export default function PortfolioUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);

      const response = await uploadPortfolio(formData);
      console.log("Upload successful", response.data);
      alert("Upload successful!");
    } catch (err: any) {
      console.error("Upload failed", err.response?.status, err.response?.data);
      alert("Upload failed " + err.response?.status);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
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
          <Label htmlFor="portfolioFile">Portfolio File</Label>
          <Input
            id="portfolioFile"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <Button type="submit" variant="outline" className="flex items-center gap-2">
          <ArrowUpFromLine size={16} />
          Upload
        </Button>
      </form>
    </div>
  );
}
