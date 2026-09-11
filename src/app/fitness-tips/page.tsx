import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PopupAnnouncement from "@/components/PopupAnnouncement";
import { getSettings, getTips } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function FitnessTipsPage() {
  const [s, tips] = await Promise.all([getSettings(), getTips("fitness-tips")]);
  return (
    <>
      <PopupAnnouncement enabled={s.popupEnabled} imageUrl={s.popupImageUrl} linkUrl={s.popupLinkUrl} title={s.popupTitle} />
      <Nav active="/fitness-tips" orgName={s.orgName} />
      <header className="container" style={{ padding: "60px 40px 40px", display: "grid", gridTemplateColumns: "minmax(280px,1.1fr) minmax(240px,0.9fr)", gap: 32, alignItems: "center" }}>
        <div>
          <div className="eyebrow">ফিটনেস টিপস</div>
          <h1 className="disp" style={{ fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 800, margin: "10px 0 14px", maxWidth: "20ch" }}>সঠিক নিয়মে, নিরাপদে ব্যায়াম করুন</h1>
          <p style={{ opacity: 0.75, fontSize: 16 }}>বিশেষ করে মধ্যবয়সী ও প্রবীণ সদস্যদের জন্য কিছু ব্যবহারিক পরামর্শ।</p>
        </div>
        <div style={{ overflow: "hidden", border: "3px solid var(--yellow)", aspectRatio: "4/3" }}>
          <img src="/gallery/g29.jpg" alt="ব্যায়াম করছেন সদস্যরা" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </header>

      <section style={{ maxWidth: 880, margin: "0 auto", padding: "0 40px 80px" }} className="seam-grid">
        {tips.map((t) => (
          <div key={t.id} className="card" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <span className="disp" style={{ color: "var(--orange)", fontSize: 26, fontWeight: 800, flex: "none" }}>{t.badge}</span>
            <div>
              <div className="disp" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{t.title}</div>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.75 }}>{t.description}</p>
            </div>
          </div>
        ))}
        {tips.length === 0 && <p style={{ opacity: 0.6, padding: 20 }}>টিপস শীঘ্রই যুক্ত করা হবে।</p>}
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
