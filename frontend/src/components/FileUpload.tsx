import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const upload = async () => {
    if (!file) {
      setStatus("Please choose a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Uploading...");

      await axios.post("http://localhost:5233/api/portfolio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });


      setStatus("Upload successful!");
    } catch (error: any) {
      console.error(error);
      setStatus("Upload failed.");
    }
  };

  return (
    <div className="page">
      <h2>Upload Portfolio CSV</h2>

      <input type="file" accept=".csv" onChange={handleFileChange} />

      <button onClick={upload}>Upload</button>

      <p>{status}</p>
    </div>
  );
};

export default FileUpload;
