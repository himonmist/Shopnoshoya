import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PopupAnnouncement from "@/components/PopupAnnouncement";
import { getSettings, getEvents } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [s, events] = await Promise.all([getSettings(), getEvents()]);
  const upcoming = events.find((e) => e.isUpcoming);
  const past = events.filter((e) => !e.isUpcoming);

  return (
    <>
      <PopupAnnouncement enabled={s.popupEnabled} imageUrl={s.popupImageUrl} linkUrl={s.popupLinkUrl} title={s.popupTitle} />
      <Nav active="/events" orgName={s.orgName} />
      <header className="page-header">
        <div className="eyebrow">ইভেন্ট</div>
        <h1 className="page-title">আয়োজন যা আমাদের একসাথে রাখে</h1>
      </header>

      {upcoming && (
        <section className="container" style={{ padding: "0 40px 60px" }}>
          <div style={{
            background: "var(--orange)", color: "var(--bg)", padding: "40px 44px", display: "flex",
            flexWrap: "wrap", gap: 30, alignItems: "center", justifyContent: "space-between",
            clipPath: "polygon(0 0,100% 0,98% 100%,0 100%)",
          }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <span style={{ background: "var(--bg)", color: "var(--yellow)", fontSize: 12, fontWeight: 700, padding: "5px 14px" }}>আসন্ন আয়োজন</span>
              <h2 className="disp" style={{ fontSize: 30, fontWeight: 800, margin: "14px 0 8px" }}>{upcoming.title}</h2>
              <p style={{ margin: 0, maxWidth: "55ch", opacity: 0.9 }}>{upcoming.description}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: 22, textAlign: "center" }}>
              <div><div className="disp" style={{ fontSize: 34, fontWeight: 800 }}>{upcoming.dateLabel.split(" ")[0]}</div><div style={{ fontSize: 12 }}>তারিখ</div></div>
            </div>
          </div>
        </section>
      )}

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 40px 80px" }}>
        <div className="eyebrow">অতীত আয়োজন</div>
        <h2 className="disp" style={{ fontSize: 26, fontWeight: 800, margin: "8px 0 26px" }}>আমাদের যাত্রার কিছু মুহূর্ত</h2>
        <div className="seam-grid">
          {past.map((e) => (
            <div key={e.id} className="card" style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ width: 150, height: 100, flex: "none", overflow: "hidden" }}>
                <img src={e.imageUrl} alt={e.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div className="cat">{e.dateLabel}</div>
                <div className="disp" style={{ fontSize: 17, fontWeight: 700, margin: "4px 0 6px" }}>{e.title}</div>
                <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>{e.description}</p>
              </div>
            </div>
          ))}
          {past.length === 0 && <p style={{ opacity: 0.6, padding: 20 }}>ইভেন্টের তথ্য শীঘ্রই যুক্ত করা হবে।</p>}
        </div>
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
