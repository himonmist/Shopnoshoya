import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PopupAnnouncement from "@/components/PopupAnnouncement";
import { getSettings, getTips } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HealthyLifestylePage() {
  const [s, tips] = await Promise.all([getSettings(), getTips("healthy-lifestyle")]);
  return (
    <>
      <PopupAnnouncement enabled={s.popupEnabled} imageUrl={s.popupImageUrl} linkUrl={s.popupLinkUrl} title={s.popupTitle} />
      <Nav active="/healthy-lifestyle" orgName={s.orgName} />
      <header className="page-header">
        <div className="eyebrow">স্বাস্থ্যকর জীবনযাপন</div>
        <h1 className="page-title">ব্যায়ামের বাইরেও সুস্থ থাকার অভ্যাস</h1>
        <p className="page-desc">সুস্থ জীবন শুধু সকালের ব্যায়ামে সীমাবদ্ধ নয় — খাদ্যাভ্যাস, ঘুম আর মানসিক প্রশান্তিও সমান জরুরি।</p>
      </header>

      <section className="container seam-grid" style={{ padding: "0 40px 60px", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))" }}>
        {tips.map((t) => (
          <div key={t.id} className="card">
            <div className="cat">{t.badge}</div>
            <div className="title disp" style={{ fontSize: 18 }}>{t.title}</div>
            <p className="desc">{t.description}</p>
          </div>
        ))}
        {tips.length === 0 && <p style={{ opacity: 0.6, padding: 20 }}>তথ্য শীঘ্রই যুক্ত করা হবে।</p>}
      </section>

      <section className="container" style={{ padding: "0 40px 80px" }}>
        <div style={{ overflow: "hidden", border: "3px solid var(--orange)", aspectRatio: "21/6" }}>
          <img src="/gallery/g11.jpg" alt="সদস্যদের সুস্থ জীবনযাপনের অংশ" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
