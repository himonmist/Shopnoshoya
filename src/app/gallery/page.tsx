import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSettings, getGallery } from "@/lib/content";

export const dynamic = "force-dynamic";

const spans = [
  [3, 3], [2, 2], [1, 2], [2, 1], [2, 2], [2, 1], [1, 1], [3, 2], [2, 2], [2, 1],
  [2, 2], [2, 1], [3, 2], [1, 2], [2, 1], [2, 1], [2, 2], [2, 1], [3, 2], [1, 1],
  [2, 2], [1, 1], [2, 1], [2, 2], [2, 1], [2, 2], [2, 1], [3, 2], [2, 1], [2, 2], [2, 2],
];

export default async function GalleryPage() {
  const [s, images] = await Promise.all([getSettings(), getGallery()]);
  return (
    <>
      <Nav active="/gallery" orgName={s.orgName} />
      <header className="page-header">
        <div className="eyebrow">গ্যালারি</div>
        <h1 className="page-title">চার বছরের মুহূর্তগুলো</h1>
        <p className="page-desc">প্রতিদিনের ব্যায়াম থেকে বার্ষিকী উদযাপন, বনভোজন থেকে সামাজিক সেবা — {s.orgName}র যাত্রার কিছু ছবি।</p>
      </header>

      <section className="container" style={{ padding: "0 40px 80px" }}>
        <div className="gwall">
          {images.map((img, i) => {
            const [c, r] = spans[i % spans.length];
            return (
              <figure key={img.id} style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` }}>
                <img src={img.url} alt={img.alt || s.orgName} />
              </figure>
            );
          })}
        </div>
      </section>

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
