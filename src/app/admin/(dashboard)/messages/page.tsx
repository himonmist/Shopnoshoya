"use client";

import { useEffect, useState } from "react";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
                  <button className="pill-btn danger" onClick={() => setMemberStatus(m.id, "rejected")}>প্রত্যাখ্যান</button>
                </td>
              </tr>
            ))}
            {members.length === 0 && <tr><td colSpan={6} style={{ opacity: 0.6 }}>কোনো আবেদন নেই।</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
