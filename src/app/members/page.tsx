import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PopupAnnouncement from "@/components/PopupAnnouncement";
import { getSettings } from "@/lib/content";
import { getApprovedMembers, formatBirthday } from "@/lib/members";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const [s, members] = await Promise.all([getSettings(), getApprovedMembers()]);

  return (
    <>
      <PopupAnnouncement enabled={s.popupEnabled} imageUrl={s.popupImageUrl} linkUrl={s.popupLinkUrl} title={s.popupTitle} />
      <Nav active="/members" orgName={s.orgName} />
      <header className="page-header">
        <div className="eyebrow">সদস্যবৃন্দ</div>
        <h1 className="page-title">{s.orgName}র সদস্যরা</h1>
        <p className="page-desc">আমাদের অনুমোদিত সদস্যদের পরিচিতি।</p>
      </header>

      <section className="container seam-grid" style={{ padding: "0 40px 80px", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))" }}>
        {members.map((m) => (
          <div key={m.id} className="card">
            <div className="thumb-wrap" style={{ height: 160, borderRadius: 999, width: 100, margin: "0 auto 16px", overflow: "hidden" }}>
              <img className="thumb" src={m.photoUrl || "/logo.png"} alt={m.fullName} style={{ borderRadius: 999 }} />
            </div>
            <div className="title disp" style={{ textAlign: "center" }}>{m.fullName}</div>
            {m.profession && <div className="cat" style={{ textAlign: "center", marginTop: 4 }}>{m.profession}</div>}
            <div style={{ display: "grid", gap: 4, marginTop: 12, fontSize: 13, opacity: 0.8 }}>
              {m.holding && <div>🏠 {m.holding}</div>}
              {m.hobby && <div>🎯 শখ: {m.hobby}</div>}
              {formatBirthday(m.birthDay, m.birthMonth) && <div>🎂 জন্মদিন: {formatBirthday(m.birthDay, m.birthMonth)}</div>}
            </div>
            {m.aboutYou && <p className="desc" style={{ marginTop: 12 }}>{m.aboutYou}</p>}
            {m.motiveWord && (
              <p style={{ marginTop: 12, fontSize: 13, fontStyle: "italic", color: "var(--yellow)", borderTop: "1px solid var(--seam)", paddingTop: 10 }}>
                &ldquo;{m.motiveWord}&rdquo;
              </p>
            )}
          </div>
        ))}
        {members.length === 0 && <p style={{ opacity: 0.6, padding: 20 }}>এখনো কোনো সদস্যের তথ্য যুক্ত হয়নি।</p>}
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
