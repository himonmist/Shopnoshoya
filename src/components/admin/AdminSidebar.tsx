"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { href: "/admin", label: "ড্যাশবোর্ড" },
  { href: "/admin/settings", label: "সাইট কনটেন্ট" },
  { href: "/admin/activities", label: "কার্যক্রম" },
  { href: "/admin/events", label: "ইভেন্ট" },
  { href: "/admin/gallery", label: "গ্যালারি" },
  { href: "/admin/tips", label: "টিপস" },
  { href: "/admin/blog", label: "ব্লগ" },
  { href: "/admin/messages", label: "বার্তা" },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="admin-sidebar">
      <div style={{ padding: "0 24px 20px", borderBottom: "1px solid var(--seam)", marginBottom: 12 }}>
        <div className="disp" style={{ fontWeight: 700, fontSize: 15 }}>স্বপ্নছোঁয়া</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{adminName}</div>
      </div>
      {items.map((it) => (
        <Link key={it.href} href={it.href} className={pathname === it.href ? "active" : ""}>
          {it.label}
        </Link>
      ))}
      <a href="/" target="_blank" rel="noreferrer" style={{ marginTop: 12, opacity: 0.7 }}>সাইট দেখুন ↗</a>
      <button onClick={handleLogout} className="pill-btn" style={{ margin: "16px 24px 0", width: "calc(100% - 48px)" }}>
        লগআউট
      </button>
    </aside>
  );
}
