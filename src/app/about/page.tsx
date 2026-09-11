import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <>
      <Nav active="/about" orgName={s.orgName} />
      <header className="container" style={{ padding: "60px 40px 40px", display: "grid", gridTemplateColumns: "minmax(280px,1.1fr) minmax(260px,0.9fr)", gap: 40, alignItems: "center" }}>
        <div>
          <div className="eyebrow">পরিচিতি</div>
          <h1 className="disp" style={{ fontSize: "clamp(34px,5vw,56px)", fontWeight: 800, margin: "10px 0 0", lineHeight: 1.05 }}>
            আমাদের ইতিহাস<br />ও পথচলা
          </h1>
        </div>
        <div style={{ overflow: "hidden", border: "3px solid var(--yellow)", boxShadow: "10px 10px 0 var(--orange)", aspectRatio: "16/11" }}>
          <img src={s.aboutImage} alt="স্বপ্নছোঁয়ার সদস্যদের সমবেত ছবি" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </header>

      <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 40px 60px" }}>
        <div className="info-box">
          <p style={{ fontSize: 18, lineHeight: 1.8, margin: 0, opacity: 0.92, whiteSpace: "pre-line" }}>{s.aboutText}</p>
        </div>
      </section>

      <section className="seam-grid container" style={{ padding: "0 40px 60px", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 3 }}>
        {["g18", "g19", "g20", "g17"].map((n) => (
          <div key={n} style={{ overflow: "hidden", aspectRatio: "1/1" }}>
            <img src={`/gallery/${n}.jpg`} alt="স্বপ্নছোঁয়া" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(.25)" }} />
          </div>
        ))}
      </section>

      <section className="container" style={{ padding: "0 40px 80px" }}>
        <div className="eyebrow">বর্তমান কমিটি</div>
        <h2 className="disp" style={{ fontSize: 28, fontWeight: 800, margin: "8px 0 20px" }}>যারা আজকের {s.orgName} গড়ছেন</h2>
        <div style={{ background: "var(--bg-alt)", padding: "24px 30px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <span className="badge-orange">তথ্য যুক্ত হচ্ছে</span>
          <p style={{ margin: 0, flex: 1, minWidth: 220, opacity: 0.8, fontSize: 14 }}>{s.committeeNote}</p>
        </div>
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
