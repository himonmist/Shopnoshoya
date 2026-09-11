"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "লগইন ব্যর্থ হয়েছে");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/logo.png" alt="লোগো" style={{ width: 56, height: 56, borderRadius: 999, objectFit: "cover", border: "2px solid var(--orange)", margin: "0 auto 12px" }} />
          <h1 className="disp" style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>অ্যাডমিন প্যানেল</h1>
          <p style={{ opacity: 0.6, fontSize: 13 }}>স্বপ্নছোঁয়া কনটেন্ট ম্যানেজমেন্ট</p>
        </div>
        <form onSubmit={handleSubmit} className="admin-card" style={{ display: "grid", gap: 16 }}>
          <div><label className="lbl">ইমেইল</label><input className="input" name="email" type="email" required autoFocus /></div>
          <div><label className="lbl">পাসওয়ার্ড</label><input className="input" name="password" type="password" required /></div>
          <button className="btn" disabled={loading}>{loading ? "..." : "লগইন করুন"}</button>
          {error && <p className="status-msg err">{error}</p>}
        </form>
      </div>
    </div>
  );
}
