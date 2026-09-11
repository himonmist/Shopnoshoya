import Link from "next/link";

export default function Footer({
  orgName,
  tagline,
  address,
}: {
  orgName?: string;
  tagline?: string;
  address?: string;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img src="/logo.png" alt="লোগো" style={{ width: 32, height: 32, borderRadius: 999, objectFit: "cover" }} />
            <span className="disp" style={{ fontWeight: 700, fontSize: 16 }}>{orgName || "স্বপ্নছোঁয়া"}</span>
          </div>
          <p style={{ fontSize: 13, opacity: 0.6 }}>{tagline || "স্বপ্ননগরের সর্বপ্রথম ও ঐতিহ্যবাহী ব্যায়াম সংগঠন।"}</p>
        </div>
        <div>
          <div className="col-title">পাতাসমূহ</div>
          <div className="links">
            <Link href="/about">পরিচিতি</Link>
            <Link href="/activities">কার্যক্রম</Link>
            <Link href="/events">ইভেন্ট</Link>
            <Link href="/gallery">গ্যালারি</Link>
          </div>
        </div>
        <div>
          <div className="col-title">ঠিকানা</div>
          <p style={{ fontSize: 14, opacity: 0.8, margin: 0, whiteSpace: "pre-line" }}>
            {address || "স্বপ্ননগর, আ/এ-১, মিরপুর-৯\nঢাকা-১২১৬"}
          </p>
        </div>
      </div>
      <p className="copyright">© {year} {orgName || "স্বপ্নছোঁয়া"}, স্বপ্ননগর।</p>
    </footer>
  );
}
