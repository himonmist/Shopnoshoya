"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
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
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
      <div className="form-row-2">
        <div><label className="lbl">নাম</label><input className="input" name="name" placeholder="আপনার নাম" required /></div>
        <div><label className="lbl">ফোন নম্বর</label><input className="input" name="phone" placeholder="01XXXXXXXXX" required /></div>
      </div>
      <div><label className="lbl">বিষয়</label><input className="input" name="subject" placeholder="যেমন: সদস্যপদ, ইভেন্ট" /></div>
      <div><label className="lbl">বার্তা</label><textarea className="input" name="message" rows={4} placeholder="আপনার বার্তা লিখুন" required /></div>
      <button type="submit" className="btn" disabled={status === "sending"}>
        {status === "sending" ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
      </button>
      {status === "ok" && <p className="status-msg ok">ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে।</p>}
      {status === "err" && <p className="status-msg err">{errMsg}</p>}
    </form>
  );
}
