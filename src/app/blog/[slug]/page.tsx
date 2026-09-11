import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PopupAnnouncement from "@/components/PopupAnnouncement";
import { getSettings, getBlogPost } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [s, post] = await Promise.all([getSettings(), getBlogPost(params.slug)]);
  if (!post) notFound();

  return (
    <>
      <PopupAnnouncement enabled={s.popupEnabled} imageUrl={s.popupImageUrl} linkUrl={s.popupLinkUrl} title={s.popupTitle} />
      <Nav active="/blog" orgName={s.orgName} />
      <header className="container" style={{ padding: "50px 40px 30px", maxWidth: 820 }}>
        {post.tag && <span className="badge-orange">{post.tag}</span>}
        <h1 className="disp" style={{ fontSize: "clamp(28px,4.5vw,44px)", fontWeight: 800, margin: "16px 0 10px", lineHeight: 1.15 }}>{post.title}</h1>
        <div className="eyebrow" style={{ textTransform: "none" }}>
          {new Date(post.publishedAt).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </header>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 40px" }}>
        <div style={{ overflow: "hidden", border: "1px solid var(--seam)", marginBottom: 30 }}>
          <img src={post.imageUrl} alt={post.title} style={{ width: "100%", maxHeight: 420, objectFit: "cover" }} />
        </div>
      </div>
      <article style={{ maxWidth: 820, margin: "0 auto", padding: "0 40px 80px", fontSize: 17, lineHeight: 1.9, opacity: 0.92 }}>
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} style={{ marginBottom: 20 }}>{para}</p>
        ))}
      </article>
      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
