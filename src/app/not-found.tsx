import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#141315", color: "#f3efe9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "'Noto Sans Bengali', sans-serif" }}>
      <div style={{ fontSize: 64, fontWeight: 800, color: "#ff5c39" }}>৪০৪</div>
      <p style={{ opacity: 0.75 }}>দুঃখিত, পাতাটি খুঁজে পাওয়া যায়নি।</p>
      <Link href="/" style={{ background: "#ff5c39", color: "#141315", padding: "12px 24px", fontWeight: 700 }}>হোমে ফিরুন</Link>
    </div>
  );
}
