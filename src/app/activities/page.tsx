import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings, getActivities } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const [s, activities] = await Promise.all([getSettings(), getActivities()]);
  return (
    <>
      <Nav active="/activities" orgName={s.orgName} />
      <header className="page-header">
        <div className="eyebrow">কার্যক্রম</div>
        <h1 className="page-title">প্রতিদিনের ব্যায়াম থেকে সামাজিক সেবা</h1>
        <p className="page-desc">{s.orgName}র মূল কাজ প্রতিদিন সকালের ব্যায়াম হলেও, বছরজুড়ে আমরা স্বপ্ননগরের উন্নয়ন ও সদস্যদের সৌহার্দ্যের জন্য নানা কার্যক্রম আয়োজন করি।</p>
      </header>

      <section className="container seam-grid" style={{ padding: "0 40px 80px", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))" }}>
        {activities.map((a) => (
          <div key={a.id} className="card">
            <div className="thumb-wrap" style={{ height: 160 }}><img className="thumb" src={a.imageUrl} alt={a.title} /></div>
            <div className="cat">{a.category}</div>
            <div className="title disp">{a.title}</div>
            <p className="desc">{a.description}</p>
          </div>
        ))}
        {activities.length === 0 && (
          <p style={{ opacity: 0.6, padding: 20 }}>কার্যক্রমের তথ্য শীঘ্রই যুক্ত করা হবে।</p>
        )}
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
