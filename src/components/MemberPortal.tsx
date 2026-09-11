"use client";

import { useState } from "react";
import Link from "next/link";

export default function MemberPortal({ orgName }: { orgName: string }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/member-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "ত্রুটি হয়েছে");
      }
      setStatus("ok");
      form.reset();
    } catch (err: any) {
      setErrMsg(err.message || "ত্রুটি হয়েছে");
      setStatus("err");
    }
  }

  return (
    <section style={{ maxWidth: 440, margin: "0 auto", padding: "60px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <img src="/logo.png" alt={`${orgName} লোগো`} style={{ width: 64, height: 64, borderRadius: 999, objectFit: "cover", border: "2px solid var(--orange)", margin: "0 auto 14px" }} />
        <h2 className="disp" style={{ fontWeight: 800, margin: "0 0 4px" }}>সদস্য পোর্টাল</h2>
        <p style={{ opacity: 0.6, fontSize: 14, margin: 0 }}>{orgName}র সদস্যরা এখানে লগইন করুন</p>
      </div>

      <div style={{ display: "flex", marginBottom: 22 }}>
        <div
          className="tabbtn"
          style={{ flex: 1, textAlign: "center", padding: 12, fontFamily: "'Baloo Da 2'", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "1px solid var(--border)", background: tab === "login" ? "var(--orange)" : "transparent", color: tab === "login" ? "var(--bg)" : "var(--text)" }}
          onClick={() => setTab("login")}
        >
          লগইন
        </div>
        <div
          className="tabbtn"
          style={{ flex: 1, textAlign: "center", padding: 12, fontFamily: "'Baloo Da 2'", fontWeight: 700, fontSize: 14, cursor: "pointer", border: "1px solid var(--border)", borderLeft: "none", background: tab === "signup" ? "var(--orange)" : "transparent", color: tab === "signup" ? "var(--bg)" : "var(--text)" }}
          onClick={() => setTab("signup")}
        >
          সাইনআপ
        </div>
      </div>

      <div className="card" style={{ padding: 30 }}>
        {tab === "login" ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div><label className="lbl">ফোন নম্বর</label><input className="input" placeholder="01XXXXXXXXX" /></div>
            <div><label className="lbl">পাসওয়ার্ড</label><input className="input" type="password" placeholder="********" /></div>
            <div style={{ textAlign: "right" }}><a href="#" style={{ fontSize: 13 }}>পাসওয়ার্ড ভুলে গেছেন?</a></div>
            <button type="button" className="btn" disabled title="সদস্যপদ অনুমোদনের পর এই ফিচার চালু হবে">লগইন করুন</button>
          </div>
        ) : (
          <form onSubmit={handleSignup} style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ gridColumn: "1 / -1" }}><label className="lbl">পূর্ণ নাম</label><input className="input" name="fullName" placeholder="আপনার নাম" required /></div>
            <div><label className="lbl">হোল্ডিং/ফ্ল্যাট নং</label><input className="input" name="holding" /></div>
            <div><label className="lbl">ফোন নম্বর</label><input className="input" name="phone" placeholder="01XXXXXXXXX" required /></div>
            <button type="submit" className="btn" style={{ gridColumn: "1 / -1" }} disabled={status === "sending"}>
              {status === "sending" ? "পাঠানো হচ্ছে..." : "সদস্যপদের জন্য আবেদন করুন"}
            </button>
            {status === "ok" && <p className="status-msg ok" style={{ gridColumn: "1 / -1" }}>ধন্যবাদ! আপনার আবেদন গৃহীত হয়েছে।</p>}
            {status === "err" && <p className="status-msg err" style={{ gridColumn: "1 / -1" }}>{errMsg}</p>}
          </form>
        )}
      </div>
      <p style={{ textAlign: "center", fontSize: 12, opacity: 0.55, marginTop: 18 }}>
        সদস্যপদ সংক্রান্ত সহায়তার জন্য <Link href="/contact">যোগাযোগ পাতা</Link> দেখুন।
      </p>
    </section>
  );
}
