import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <>
      <Nav active="/contact" orgName={s.orgName} />
      <header className="page-header">
        <div className="eyebrow">যোগাযোগ</div>
        <h1 className="page-title">আমাদের সাথে যোগাযোগ করুন</h1>
      </header>

      <section className="container seam-grid" style={{ padding: "0 40px 80px", gridTemplateColumns: "minmax(260px,0.9fr) minmax(300px,1.1fr)" }}>
        <div className="card" style={{ display: "grid", gap: 20, alignContent: "start" }}>
          <div>
            <div className="cat">ঠিকানা</div>
            <p style={{ margin: "6px 0 0", fontSize: 15, whiteSpace: "pre-line" }}>{s.contactAddress}</p>
          </div>
          <div style={{ height: 1, background: "var(--border)" }} />
          <div>
            <div className="cat">যোগাযোগ</div>
            {s.contactPhone || s.contactEmail ? (
              <p style={{ margin: "6px 0 0", fontSize: 14 }}>
                {s.contactPhone && <>ফোন: {s.contactPhone}<br /></>}
                {s.contactEmail && <>ইমেইল: {s.contactEmail}</>}
              </p>
            ) : (
              <p style={{ margin: "6px 0 0", fontSize: 14, opacity: 0.65 }}>{s.contactNote}</p>
            )}
          </div>
          <div style={{ height: 1, background: "var(--border)" }} />
          <div>
            <div className="cat">প্রাতঃ ব্যায়ামের সময়</div>
            <p style={{ margin: "6px 0 0", fontSize: 15 }}>{s.exerciseTimeNote}</p>
          </div>
        </div>

        <div className="card">
          <div className="disp" style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>বার্তা পাঠান</div>
          <ContactForm />
        </div>
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
