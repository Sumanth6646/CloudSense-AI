import { useState } from "react";

function BillingUpload({ onDataImported }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const processFile = async (file) => {
    if (!file) {
      return;
    }

    setError("");

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV file.");
      return;
    }

    setFileName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/api/billing/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail?.message ||
          result.detail ||
          "Unable to process billing file."
        );
      }

      if (result.status !== "success") {
        throw new Error(
          result.message || "Billing file processing failed."
        );
      }

      onDataImported(result.data);

    } catch (err) {
      console.error("Billing upload error:", err);
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
      <div className="text-center">

        <div
          className={`mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >

          <div className="mb-4 text-5xl">
            📁
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Import Cloud Billing Data
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Upload your AWS, Azure, or Google Cloud billing CSV file.
          </p>

          <label
            className={`mt-6 cursor-pointer rounded-xl px-6 py-3 font-semibold text-white shadow-sm transition ${
              isUploading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Analyzing..." : "Choose CSV File"}

            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>

          <p className="mt-4 text-xs text-slate-400">
            Supported format: .CSV
          </p>

        </div>

        {fileName && !error && (
          <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-green-200 bg-green-50 p-4 text-left">
            <p className="font-semibold text-green-700">
              ✓ File processed successfully
            </p>

            <p className="mt-1 text-sm text-green-600">
              {fileName}
            </p>
          </div>
        )}

        {error && (
          <div className="mx-auto mt-5 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-left">
            <p className="font-semibold text-red-700">
              Import failed
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default BillingUpload;