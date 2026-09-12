"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/admin/ImageField";

const MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

type Profile = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  holding: string;
  profession: string;
  hobby: string;
  aboutYou: string;
  birthDay: number | null;
  birthMonth: number | null;
  motiveWord: string;
  photoUrl: string;
};

type BlogDraft = { title: string; excerpt: string; content: string; imageUrl: string; tag: string };

const emptyDraft: BlogDraft = { title: "", excerpt: "", content: "", imageUrl: "", tag: "" };

export default function MemberDashboard({ initialProfile }: { initialProfile: Profile }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [saveError, setSaveError] = useState("");

  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<BlogDraft>(emptyDraft);
  const [draftStatus, setDraftStatus] = useState<"idle" | "saving" | "err">("idle");
  const [draftError, setDraftError] = useState("");

  async function loadPosts() {
    setPostsLoading(true);
    const res = await fetch("/api/member/blog");
    const data = await res.json().catch(() => []);
    setPosts(Array.isArray(data) ? data : []);
    setPostsLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function updateField(key: keyof Profile, val: any) {
    setProfile((p) => ({ ...p, [key]: val }));
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/member/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "সংরক্ষণ ব্যর্থ হয়েছে");
      setProfile(j);
      setSaveStatus("ok");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err: any) {
      setSaveError(err.message);
      setSaveStatus("err");
    }
  }

  function startNewDraft() {
    setEditingId("new");
    setDraft(emptyDraft);
    setDraftError("");
  }

  function startEditDraft(post: any) {
    setEditingId(post.id);
    setDraft({ title: post.title, excerpt: post.excerpt, content: post.content, imageUrl: post.imageUrl, tag: post.tag });
    setDraftError("");
  }

  async function submitDraft() {
    setDraftStatus("saving");
    setDraftError("");
    try {
      const isNew = editingId === "new";
      const url = isNew ? "/api/member/blog" : `/api/member/blog/${editingId}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "সংরক্ষণ ব্যর্থ হয়েছে");
      setEditingId(null);
      await loadPosts();
    } catch (err: any) {
      setDraftError(err.message);
    } finally {
      setDraftStatus("idle");
    }
  }

  async function deletePost(id: string) {
    if (!confirm("লেখাটি মুছে ফেলতে চান?")) return;
    await fetch(`/api/member/blog/${id}`, { method: "DELETE" });
    await loadPosts();
  }

  async function handleLogout() {
    await fetch("/api/member/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <section className="container" style={{ padding: "50px 40px 80px", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="eyebrow">সদস্য ড্যাশবোর্ড</div>
          <h1 className="page-title" style={{ margin: "6px 0 0" }}>স্বাগতম, {profile.fullName}</h1>
        </div>
        <button className="pill-btn" onClick={handleLogout}>লগআউট</button>
      </div>

      <div className="admin-card" style={{ marginTop: 30 }}>
        <h3 className="disp" style={{ marginTop: 0 }}>আমার প্রোফাইল</h3>
        <form onSubmit={saveProfile} className="form-grid">
          <div>
            <label className="lbl">ছবি</label>
            <ImageField value={profile.photoUrl} onChange={(url) => updateField("photoUrl", url)} endpoint="/api/member/upload" />
          </div>
          <div className="form-row-2">
            <div><label className="lbl">নাম</label><input className="input" value={profile.fullName} onChange={(e) => updateField("fullName", e.target.value)} required /></div>
            <div><label className="lbl">মোবাইল</label><input className="input" value={profile.phone} onChange={(e) => updateField("phone", e.target.value)} required /></div>
          </div>
          <div className="form-row-2">
            <div><label className="lbl">ইমেইল</label><input className="input" type="email" value={profile.email} onChange={(e) => updateField("email", e.target.value)} /></div>
            <div><label className="lbl">বিল্ডিং/ফ্ল্যাট নং</label><input className="input" value={profile.holding} onChange={(e) => updateField("holding", e.target.value)} /></div>
          </div>
          <div className="form-row-2">
            <div><label className="lbl">পেশা</label><input className="input" value={profile.profession} onChange={(e) => updateField("profession", e.target.value)} /></div>
            <div><label className="lbl">শখ</label><input className="input" value={profile.hobby} onChange={(e) => updateField("hobby", e.target.value)} /></div>
          </div>
          <div className="form-row-2">
            <div>
              <label className="lbl">জন্মদিন - দিন</label>
              <select className="input" value={profile.birthDay ?? ""} onChange={(e) => updateField("birthDay", e.target.value ? Number(e.target.value) : null)}>
                <option value="">নির্বাচন করুন</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">জন্মদিন - মাস</label>
              <select className="input" value={profile.birthMonth ?? ""} onChange={(e) => updateField("birthMonth", e.target.value ? Number(e.target.value) : null)}>
                <option value="">নির্বাচন করুন</option>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>
          <div><label className="lbl">নিজের সম্পর্কে</label><textarea className="input" rows={3} value={profile.aboutYou} onChange={(e) => updateField("aboutYou", e.target.value)} /></div>
          <div><label className="lbl">স্বপ্নছোঁয়ার জন্য অনুপ্রেরণার কথা</label><input className="input" value={profile.motiveWord} onChange={(e) => updateField("motiveWord", e.target.value)} /></div>
          <button type="submit" className="pill-btn primary" disabled={saveStatus === "saving"}>
            {saveStatus === "saving" ? "সংরক্ষণ হচ্ছে..." : "প্রোফাইল সংরক্ষণ করুন"}
          </button>
          {saveStatus === "ok" && <p className="status-msg ok">সফলভাবে সংরক্ষিত হয়েছে।</p>}
          {saveStatus === "err" && <p className="status-msg err">{saveError}</p>}
        </form>
      </div>

      <div className="admin-card" style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="disp" style={{ marginTop: 0 }}>আমার লেখা</h3>
          {editingId === null && <button className="pill-btn primary" onClick={startNewDraft}>+ নতুন লেখা জমা দিন</button>}
        </div>

        {editingId !== null ? (
          <div className="form-grid" style={{ marginTop: 16 }}>
            <div><label className="lbl">শিরোনাম</label><input className="input" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} /></div>
            <div><label className="lbl">সংক্ষিপ্ত বিবরণ</label><textarea className="input" rows={2} value={draft.excerpt} onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))} /></div>
            <div><label className="lbl">পূর্ণ লেখা</label><textarea className="input" rows={8} value={draft.content} onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))} /></div>
            <div>
              <label className="lbl">কভার ছবি</label>
              <ImageField value={draft.imageUrl} onChange={(url) => setDraft((d) => ({ ...d, imageUrl: url }))} endpoint="/api/member/upload" />
            </div>
            <div><label className="lbl">ট্যাগ</label><input className="input" value={draft.tag} onChange={(e) => setDraft((d) => ({ ...d, tag: e.target.value }))} /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="pill-btn primary" onClick={submitDraft} disabled={draftStatus === "saving"}>
                {draftStatus === "saving" ? "পাঠানো হচ্ছে..." : "জমা দিন"}
              </button>
              <button className="pill-btn" onClick={() => setEditingId(null)}>বাতিল</button>
            </div>
            {draftError && <p className="status-msg err">{draftError}</p>}
            <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>জমা দেওয়ার পর অ্যাডমিন অনুমোদন করলেই লেখাটি ওয়েবসাইটে প্রকাশিত হবে।</p>
          </div>
        ) : postsLoading ? (
          <p style={{ opacity: 0.6, marginTop: 16 }}>লোড হচ্ছে...</p>
        ) : (
          <div className="admin-table" style={{ marginTop: 16, display: "grid", gap: 2, background: "var(--seam)" }}>
            {posts.map((p) => (
              <div key={p.id} style={{ background: "var(--bg-alt)", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  <div style={{ fontSize: 12, opacity: 0.65 }}>{p.published ? "✅ প্রকাশিত" : "⏳ পর্যালোচনাধীন"}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {!p.published && <button className="pill-btn" onClick={() => startEditDraft(p)}>সম্পাদনা</button>}
                  <button className="pill-btn danger" onClick={() => deletePost(p.id)}>মুছুন</button>
                </div>
              </div>
            ))}
            {posts.length === 0 && <p style={{ opacity: 0.6, padding: 12 }}>আপনি এখনো কোনো লেখা জমা দেননি।</p>}
          </div>
        )}
      </div>
    </section>
  );
}
