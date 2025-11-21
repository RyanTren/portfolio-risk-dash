import React, { useState } from "react";
import { uploadPortfolio } from "../api/api";

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
    <div style={{ padding: 20 }}>
      <h2 style={{margin: 10,}}>Upload Portfolio</h2>

      <input
        style={{margin: 10, border: 10, outline: 1, outlineColor: "black",}}
        placeholder="Portfolio Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br/><br/>

      <input 
        type="file"
        style={{margin: 10, border: 10, outline: 1, outlineColor: "black", borderBlockColor: "black",}}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)} /><br/><br/>

      <button onClick={submit}>Upload</button>
    </div>
  );
}
