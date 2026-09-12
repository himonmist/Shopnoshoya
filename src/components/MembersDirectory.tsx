"use client";

import { useEffect, useState } from "react";
import { formatBirthday } from "@/lib/memberUtils";

type Member = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  photoUrl: string;
  profession: string;
  holding: string;
  hobby: string;
  aboutYou: string;
  birthDay: number | null;
  birthMonth: number | null;
  motiveWord: string;
};

const AVATAR_COLORS = ["#ff5c39", "#ffd166", "#3a8fb7", "#7bb87b", "#b77bb8", "#d68a4c"];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function Avatar({ member, size = 84 }: { member: Member; size?: number }) {
  if (member.photoUrl) {
    return (
      <img
        src={member.photoUrl}
        alt={member.fullName}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--seam)" }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: avatarColor(member.fullName),
        color: "#141315",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Baloo Da 2'",
        fontWeight: 800,
        fontSize: size * 0.4,
        flex: "none",
      }}
    >
      {member.fullName.trim().charAt(0) || "?"}
    </div>
  );
}

export default function MembersDirectory() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Member | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`/api/members?page=${page}&q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) throw new Error(data.error);
        setMembers(data.members || []);
        setTotal(data.total || 0);
        setPageSize(data.pageSize || 20);
      })
      .catch((err) => !cancelled && setError(err.message || "লোড করা যায়নি"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [page, debouncedQuery]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="container" style={{ padding: "0 40px 80px" }}>
      <div style={{ marginBottom: 24, maxWidth: 420 }}>
        <input
          className="input"
          placeholder="নাম, মোবাইল বা বিল্ডিং+ফ্ল্যাট দিয়ে খুঁজুন (যেমন: 8B2)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <p className="status-msg err">{error}</p>}

      {loading ? (
        <p style={{ opacity: 0.6 }}>লোড হচ্ছে...</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 16 }}>
            {members.map((m) => (
              <div key={m.id} className="card" style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                  <Avatar member={m} />
                </div>
                <div className="title disp" style={{ fontSize: 17 }}>{m.fullName}</div>
                {m.profession && <div className="cat" style={{ marginTop: 4 }}>{m.profession}</div>}
                {m.holding && <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>🏢 {m.holding}</div>}
                <button className="pill-btn primary" style={{ marginTop: 14, width: "100%" }} onClick={() => setSelected(m)}>
                  বিস্তারিত
                </button>
              </div>
            ))}
            {members.length === 0 && <p style={{ opacity: 0.6, padding: 20 }}>কোনো সদস্য খুঁজে পাওয়া যায়নি।</p>}
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32, flexWrap: "wrap" }}>
              <button className="pill-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← পূর্ববর্তী</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className="pill-btn"
                  style={p === page ? { background: "var(--orange)", color: "var(--bg)", borderColor: "var(--orange)" } : undefined}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button className="pill-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>পরবর্তী →</button>
            </div>
          )}
        </>
      )}

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(14,13,14,0.86)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="card"
            style={{
              maxWidth: 560,
              width: "100%",
              maxHeight: "85vh",
              border: "1px solid var(--seam)",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "24px 26px 20px", flex: "none", borderBottom: "1px solid var(--seam)" }}>
              <Avatar member={selected} size={72} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="disp" style={{ fontSize: 20, fontWeight: 800 }}>{selected.fullName}</div>
                {selected.profession && <div className="cat" style={{ marginTop: 4 }}>{selected.profession}</div>}
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="বন্ধ করুন"
                style={{ flex: "none", width: 32, height: 32, borderRadius: 999, background: "var(--orange)", color: "var(--bg)", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer" }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "grid", gap: 2, background: "var(--seam)", overflowY: "auto" }}>
              <DetailRow label="মোবাইল" value={selected.phone} />
              {selected.email && <DetailRow label="ইমেইল" value={selected.email} />}
              <DetailRow label="বিল্ডিং/ফ্ল্যাট" value={selected.holding} />
              <DetailRow label="শখ" value={selected.hobby} />
              <DetailRow label="জন্মদিন" value={formatBirthday(selected.birthDay, selected.birthMonth)} />
              <DetailRow label="নিজের সম্পর্কে" value={selected.aboutYou} />
              <DetailRow label="স্বপ্নছোঁয়ার জন্য অনুপ্রেরণা" value={selected.motiveWord} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div style={{ background: "var(--bg-alt)", padding: "12px 16px", display: "grid", gridTemplateColumns: "140px 1fr", gap: 12 }}>
      <div style={{ color: "var(--yellow)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
      <div style={{ fontSize: 14 }}>{value}</div>
    </div>
  );
}
