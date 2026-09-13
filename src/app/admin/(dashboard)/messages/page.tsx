"use client";

import { useEffect, useState } from "react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [passwordTarget, setPasswordTarget] = useState<any | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/messages");
    const j = await res.json();
    setMessages(j.messages || []);
    setMembers(j.members || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleRead(id: string, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !read }),
    });
    load();
  }

  async function deleteMessage(id: string) {
    if (!confirm("বার্তাটি মুছে ফেলতে চান?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    load();
  }

  async function setMemberStatus(id: string, status: string) {
    await fetch(`/api/admin/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (loading) return <p style={{ opacity: 0.6 }}>লোড হচ্ছে...</p>;

  return (
    <div>
      <h1 className="disp" style={{ fontSize: 26, fontWeight: 800, marginBottom: 20 }}>যোগাযোগ বার্তা ও সদস্যপদের আবেদন</h1>

      <h3 className="disp" style={{ fontSize: 16 }}>যোগাযোগ ফর্মের বার্তা</h3>
      <div className="admin-card" style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead><tr><th>নাম</th><th>ফোন</th><th>বিষয়</th><th>বার্তা</th><th>তারিখ</th><th>অবস্থা</th><th></th></tr></thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id} style={{ opacity: m.read ? 0.6 : 1 }}>
                <td>{m.name}</td>
                <td>{m.phone}</td>
                <td>{m.subject}</td>
                <td style={{ maxWidth: 260 }}>{m.message}</td>
                <td>{new Date(m.createdAt).toLocaleDateString("bn-BD")}</td>
                <td>{m.read ? "পঠিত" : "অপঠিত"}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button className="pill-btn" onClick={() => toggleRead(m.id, m.read)} style={{ marginRight: 8 }}>
                    {m.read ? "অপঠিত করুন" : "পঠিত করুন"}
                  </button>
                  <button className="pill-btn danger" onClick={() => deleteMessage(m.id)}>মুছুন</button>
                </td>
              </tr>
            ))}
            {messages.length === 0 && <tr><td colSpan={7} style={{ opacity: 0.6 }}>কোনো বার্তা নেই।</td></tr>}
          </tbody>
        </table>
      </div>

      <h3 className="disp" style={{ fontSize: 16, marginTop: 30 }}>সদস্যপদের আবেদন</h3>
      <div className="admin-card" style={{ overflowX: "auto" }}>
        <table className="admin-table">
          <thead><tr><th>নাম</th><th>বিল্ডিং/ফ্ল্যাট</th><th>ফোন</th><th>তারিখ</th><th>অবস্থা</th><th></th></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.fullName}</td>
                <td>{m.holding}</td>
                <td>{m.phone}</td>
                <td>{new Date(m.createdAt).toLocaleDateString("bn-BD")}</td>
                <td>{m.status === "approved" ? "অনুমোদিত" : m.status === "rejected" ? "প্রত্যাখ্যাত" : "অপেক্ষমাণ"}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button className="pill-btn" onClick={() => setMemberStatus(m.id, "approved")} style={{ marginRight: 8 }}>অনুমোদন</button>
                  <button className="pill-btn danger" onClick={() => setMemberStatus(m.id, "rejected")} style={{ marginRight: 8 }}>প্রত্যাখ্যান</button>
                  <button className="pill-btn" onClick={() => setPasswordTarget(m)}>পাসওয়ার্ড পরিবর্তন</button>
                </td>
              </tr>
            ))}
            {members.length === 0 && <tr><td colSpan={6} style={{ opacity: 0.6 }}>কোনো আবেদন নেই।</td></tr>}
          </tbody>
        </table>
      </div>

      {passwordTarget && (
        <AdminSetMemberPasswordModal
          member={passwordTarget}
          onClose={() => setPasswordTarget(null)}
        />
      )}
    </div>
  );
}

function AdminSetMemberPasswordModal({ member, onClose }: { member: any; onClose: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("পাসওয়ার্ড দুটি মিলছে না");
      setStatus("err");
      return;
    }
    setStatus("saving");
    try {
      const res = await fetch(`/api/admin/members/${member.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "পরিবর্তন ব্যর্থ হয়েছে");
      setStatus("ok");
    } catch (err: any) {
      setError(err.message);
      setStatus("err");
    }
  }

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(14,13,14,0.86)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div onClick={(e) => e.stopPropagation()} className="admin-card" style={{ maxWidth: 380, width: "100%" }}>
        <h3 className="disp" style={{ marginTop: 0 }}>পাসওয়ার্ড পরিবর্তন — {member.fullName}</h3>
        {status === "ok" ? (
          <>
            <p className="status-msg ok">পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।</p>
            <button className="pill-btn primary" onClick={onClose}>বন্ধ করুন</button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            <div>
              <label className="lbl">নতুন পাসওয়ার্ড</label>
              <input className="input" type="password" minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div>
              <label className="lbl">নতুন পাসওয়ার্ড আবার লিখুন</label>
              <input className="input" type="password" minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="pill-btn primary" disabled={status === "saving"}>
                {status === "saving" ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন করুন"}
              </button>
              <button type="button" className="pill-btn" onClick={onClose}>বাতিল</button>
            </div>
            {status === "err" && <p className="status-msg err">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
