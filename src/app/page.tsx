import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings, getActivities } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [s, activities] = await Promise.all([getSettings(), getActivities()]);
  const cards = activities.slice(0, 4);

  return (
    <>
      <Nav active="/" orgName={s.orgName} />

      <header className="container" style={{ position: "relative", padding: "70px 40px 40px", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", top: -60, right: "-10%", width: 480, height: 480,
            background: "var(--orange)", transform: "rotate(18deg) skewY(4deg)", opacity: 0.16, zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "minmax(280px,1.15fr) minmax(300px,1fr)", gap: 48, alignItems: "end" }}>
          <div>
            <span className="badge-pill" style={{ marginBottom: 22, display: "inline-block" }}>{s.orgTagline}</span>
            <h1 className="disp" style={{ fontSize: "clamp(42px, 6.5vw, 88px)", fontWeight: 800, lineHeight: 0.98, margin: "0 0 22px", letterSpacing: "-0.02em" }}>
              {s.heroTitleLine1}<br />
              <span style={{ color: "var(--orange)" }}>{s.heroTitleLine2}</span><br />
              {s.heroTitleLine3}
            </h1>
            <p style={{ fontSize: 17, opacity: 0.75, maxWidth: "46ch", lineHeight: 1.7 }}>{s.heroDescription}</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 28 }}>
              <Link href="/events" className="btn">৪র্থ বার্ষিকীতে যোগ দিন →</Link>
              <Link href="/about" className="btn-outline">আমাদের কথা</Link>
            </div>
          </div>
          <div style={{ position: "relative", height: 460 }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "62%", height: "62%", overflow: "hidden", border: "3px solid var(--yellow)", boxShadow: "10px 10px 0 var(--orange)" }}>
              <img src={s.heroImage1} alt="ভোরের ব্যায়াম" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "55%", height: "52%", overflow: "hidden", border: "3px solid var(--orange)", transform: "rotate(-3deg)" }}>
              <img src={s.heroImage2} alt="সদস্যদের দলীয় ছবি" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", top: "8%", right: "4%", width: "34%", height: "34%", overflow: "hidden", border: "3px solid var(--bg)", boxShadow: "-6px 6px 0 var(--yellow)", transform: "rotate(4deg)" }}>
              <img src={s.heroImage3} alt="বার্ষিকী উদযাপন" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </header>

      <section className="container" style={{ margin: "40px auto" }}>
        <div style={{
          background: "var(--yellow)", color: "var(--bg)", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 20, padding: "28px 40px",
          clipPath: "polygon(0 0, 100% 0, 98% 100%, 0% 100%)",
        }}>
          <div>
            <div className="disp" style={{ fontWeight: 700, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>সামনের আয়োজন</div>
            <div className="disp" style={{ fontSize: 26, fontWeight: 800, marginTop: 4 }}>{s.announcementText}</div>
          </div>
          <Link href="/events" style={{ background: "var(--bg)", color: "var(--yellow)", padding: "12px 24px", fontFamily: "'Baloo Da 2'", fontWeight: 700, fontSize: 14 }}>বিস্তারিত →</Link>
        </div>
      </section>

      <section className="container" style={{ padding: "20px 40px 60px" }}>
        <h2 className="disp" style={{ fontSize: 34, fontWeight: 800, margin: "0 0 32px" }}>
          ব্যায়াম থেকে শুরু, <span style={{ color: "var(--orange)" }}>সম্প্রীতি</span> দিয়ে গড়া
        </h2>
        <div className="seam-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px,1fr))" }}>
          {(cards.length ? cards : fallbackCards).map((c: any, i: number) => (
            <Link key={c.id || i} href="/activities" className="card">
              <div className="thumb-wrap"><img className="thumb" src={c.imageUrl} alt={c.title} style={{ filter: "grayscale(0.3)" }} /></div>
              <div className="cat">{c.category}</div>
              <div className="title disp">{c.title}</div>
              <p className="desc">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="stats-row">
        <div><div className="disp stat-value" style={{ color: "var(--orange)" }}>{s.stat1Value}</div><div className="stat-label">{s.stat1Label}</div></div>
        <div><div className="disp stat-value" style={{ color: "var(--yellow)" }}>{s.stat2Value}</div><div className="stat-label">{s.stat2Label}</div></div>
        <div><div className="disp stat-value" style={{ color: "var(--orange)" }}>{s.stat3Value}</div><div className="stat-label">{s.stat3Label}</div></div>
        <div><div className="disp stat-value" style={{ color: "var(--yellow)" }}>{s.stat4Value}</div><div className="stat-label">{s.stat4Label}</div></div>
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}

const fallbackCards = [
  { category: "কার্যক্রম", title: "প্রতিদিনের ব্যায়াম", description: "সকালের ব্যায়াম, বৃক্ষরোপণ ও স্বাস্থ্যসেবা শিবির।", imageUrl: "/gallery/g06.jpg" },
  { category: "ফিটনেস টিপস", title: "সঠিক নিয়মে ব্যায়াম", description: "বয়স ও শরীরের ধরন অনুযায়ী পরামর্শ।", imageUrl: "/gallery/g27.jpg" },
  { category: "জীবনযাপন", title: "স্বাস্থ্যকর অভ্যাস", description: "খাদ্যাভ্যাস, ঘুম ও মানসিক প্রশান্তি।", imageUrl: "/gallery/g31.jpg" },
  { category: "গ্যালারি", title: "মুহূর্তের অ্যালবাম", description: "চার বছরের যাত্রার ছবি।", imageUrl: "/gallery/g10.jpg" },
];
