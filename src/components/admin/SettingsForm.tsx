"use client";

import { useState } from "react";

const fieldGroups: { title: string; fields: { key: string; label: string; textarea?: boolean }[] }[] = [
  {
    title: "সংগঠনের নাম",
    fields: [
      { key: "orgName", label: "সংগঠনের নাম" },
      { key: "orgTagline", label: "ট্যাগলাইন / ঠিকানা ব্যাজ" },
    ],
  },
  {
    title: "হিরো সেকশন",
    fields: [
      { key: "heroTitleLine1", label: "শিরোনাম লাইন ১" },
      { key: "heroTitleLine2", label: "শিরোনাম লাইন ২ (হাইলাইট রঙে)" },
      { key: "heroTitleLine3", label: "শিরোনাম লাইন ৩" },
      { key: "heroDescription", label: "বর্ণনা", textarea: true },
      { key: "heroImage1", label: "হিরো ছবি ১ (URL)" },
      { key: "heroImage2", label: "হিরো ছবি ২ (URL)" },
      { key: "heroImage3", label: "হিরো ছবি ৩ (URL)" },
      { key: "announcementText", label: "আসন্ন আয়োজনের ঘোষণা" },
    ],
  },
  {
    title: "পরিসংখ্যান",
    fields: [
      { key: "stat1Value", label: "পরিসংখ্যান ১ - মান" }, { key: "stat1Label", label: "পরিসংখ্যান ১ - লেবেল" },
      { key: "stat2Value", label: "পরিসংখ্যান ২ - মান" }, { key: "stat2Label", label: "পরিসংখ্যান ২ - লেবেল" },
      { key: "stat3Value", label: "পরিসংখ্যান ৩ - মান" }, { key: "stat3Label", label: "পরিসংখ্যান ৩ - লেবেল" },
      { key: "stat4Value", label: "পরিসংখ্যান ৪ - মান" }, { key: "stat4Label", label: "পরিসংখ্যান ৪ - লেবেল" },
    ],
  },
  {
    title: "পরিচিতি পাতা",
    fields: [
      { key: "aboutText", label: "পরিচিতি লেখা", textarea: true },
      { key: "aboutImage", label: "পরিচিতি ছবি (URL)" },
      { key: "committeeNote", label: "কমিটি সংক্রান্ত নোট", textarea: true },
    ],
  },
  {
    title: "যোগাযোগ পাতা",
    fields: [
      { key: "contactAddress", label: "ঠিকানা", textarea: true },
      { key: "contactPhone", label: "ফোন নম্বর" },
      { key: "contactEmail", label: "ইমেইল" },
      { key: "contactNote", label: "যোগাযোগ নোট (ফোন/ইমেইল ফাঁকা থাকলে দেখাবে)" },
      { key: "exerciseTimeNote", label: "প্রাতঃ ব্যায়ামের সময়" },
    ],
  },
  {
    title: "ফুটার",
    fields: [{ key: "footerTagline", label: "ফুটার ট্যাগলাইন" }],
  },
];

export default function SettingsForm({ initial }: { initial: Record<string, any> }) {
  const [values, setValues] = useState<Record<string, any>>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [errMsg, setErrMsg] = useState("");

  function update(key: string, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("সংরক্ষণ ব্যর্থ হয়েছে");
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err: any) {
      setErrMsg(err.message);
      setStatus("err");
    }
  }

  return (
    <form onSubmit={handleSave}>
      {fieldGroups.map((group) => (
        <div key={group.title} className="admin-card">
          <h3 className="disp" style={{ fontSize: 16, marginTop: 0, marginBottom: 16 }}>{group.title}</h3>
          <div className="form-grid">
            {group.fields.map((f) => (
              <div key={f.key}>
                <label className="lbl">{f.label}</label>
                {f.textarea ? (
                  <textarea className="input" rows={3} value={values[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} />
                ) : (
                  <input className="input" value={values[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button type="submit" className="pill-btn primary" disabled={status === "saving"}>
        {status === "saving" ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
      </button>
      {status === "ok" && <p className="status-msg ok">সফলভাবে সংরক্ষিত হয়েছে।</p>}
      {status === "err" && <p className="status-msg err">{errMsg}</p>}
    </form>
  );
}
