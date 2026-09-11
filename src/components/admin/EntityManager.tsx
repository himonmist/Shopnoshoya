"use client";

import { useEffect, useState } from "react";
import ImageField from "./ImageField";

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "image" | "number" | "checkbox" | "select";
  options?: { value: string; label: string }[];
  rows?: number;
};

export default function EntityManager({
  title,
  apiBase,
  fields,
  emptyItem,
  columns,
}: {
  title: string;
  apiBase: string;
  fields: FieldConfig[];
  emptyItem: Record<string, any>;
  columns: string[];
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(apiBase);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [apiBase]);

  function startNew() {
    setEditing({ ...emptyItem });
    setError("");
  }

  function startEdit(item: any) {
    setEditing({ ...item });
    setError("");
  }

  function updateField(key: string, val: any) {
    setEditing((e: any) => ({ ...e, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const isNew = !editing.id;
      const url = isNew ? apiBase : `${apiBase}/${editing.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "সংরক্ষণ ব্যর্থ হয়েছে");
      }
      setEditing(null);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("আপনি কি নিশ্চিত মুছে ফেলতে চান?")) return;
    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 className="disp" style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{title}</h1>
        {!editing && <button className="pill-btn primary" onClick={startNew}>+ নতুন যুক্ত করুন</button>}
      </div>

      {editing ? (
        <div className="admin-card">
          <div className="form-grid">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="lbl">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea className="input" rows={f.rows || 3} value={editing[f.key] ?? ""} onChange={(e) => updateField(f.key, e.target.value)} />
                ) : f.type === "image" ? (
                  <ImageField value={editing[f.key] ?? ""} onChange={(url) => updateField(f.key, url)} />
                ) : f.type === "checkbox" ? (
                  <input type="checkbox" checked={!!editing[f.key]} onChange={(e) => updateField(f.key, e.target.checked)} />
                ) : f.type === "select" ? (
                  <select className="input" value={editing[f.key] ?? ""} onChange={(e) => updateField(f.key, e.target.value)}>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : f.type === "number" ? (
                  <input className="input" type="number" value={editing[f.key] ?? 0} onChange={(e) => updateField(f.key, Number(e.target.value))} />
                ) : (
                  <input className="input" value={editing[f.key] ?? ""} onChange={(e) => updateField(f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="pill-btn primary" onClick={handleSave} disabled={saving}>{saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</button>
            <button className="pill-btn" onClick={() => setEditing(null)}>বাতিল</button>
          </div>
          {error && <p className="status-msg err">{error}</p>}
        </div>
      ) : loading ? (
        <p style={{ opacity: 0.6 }}>লোড হচ্ছে...</p>
      ) : (
        <div className="admin-card" style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((c) => <th key={c}>{c}</th>)}
                <th>কার্যক্রম</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => {
                    const field = fields.find((f) => f.label === c);
                    const val = field ? item[field.key] : "";
                    return (
                      <td key={c}>
                        {field?.type === "image" && val ? (
                          <img src={val} alt="" style={{ height: 40, width: 60, objectFit: "cover" }} />
                        ) : typeof val === "boolean" ? (
                          val ? "হ্যাঁ" : "না"
                        ) : (
                          String(val ?? "").slice(0, 60)
                        )}
                      </td>
                    );
                  })}
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button className="pill-btn" onClick={() => startEdit(item)} style={{ marginRight: 8 }}>সম্পাদনা</button>
                    <button className="pill-btn danger" onClick={() => handleDelete(item.id)}>মুছুন</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={columns.length + 1} style={{ opacity: 0.6 }}>কোনো তথ্য নেই।</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
