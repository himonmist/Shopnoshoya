import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings, getBlogPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [s, posts] = await Promise.all([getSettings(), getBlogPosts()]);
  return (
    <>
      <Nav active="/blog" orgName={s.orgName} />
      <header className="page-header">
        <div className="eyebrow">ব্লগ</div>
        <h1 className="page-title">সদস্যদের লেখা, {s.orgName}র কথা</h1>
      </header>

      <section className="container seam-grid" style={{ padding: "0 40px 80px", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))" }}>
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="card">
            <div className="thumb-wrap" style={{ height: 170 }}><img className="thumb" src={p.imageUrl} alt={p.title} /></div>
            <div className="cat">{new Date(p.publishedAt).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}</div>
            <div className="title disp">{p.title}</div>
            <p className="desc" style={{ marginBottom: 14 }}>{p.excerpt}</p>
            {p.tag && <span className="badge-orange">{p.tag}</span>}
          </Link>
        ))}
        {posts.length === 0 && <p style={{ opacity: 0.6, padding: 20 }}>ব্লগ পোস্ট শীঘ্রই যুক্ত করা হবে।</p>}
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
