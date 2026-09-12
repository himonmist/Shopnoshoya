"use client";

import { useRef, useState } from "react";

export default function ImageField({
  value,
  onChange,
  endpoint = "/api/admin/upload",
}: {
  value: string;
  onChange: (url: string) => void;
  endpoint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(endpoint, { method: "POST", body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "আপলোড ব্যর্থ হয়েছে");
      onChange(j.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="/gallery/xyz.jpg অথবা আপলোড করুন" />
        <button
          type="button"
          className="pill-btn"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "আপলোড হচ্ছে..." : "আপলোড"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      {value && (
        <img src={value} alt="preview" style={{ marginTop: 8, height: 80, objectFit: "cover", border: "1px solid var(--seam)" }} />
      )}
      {error && <p className="status-msg err">{error}</p>}
    </div>
  );
}
