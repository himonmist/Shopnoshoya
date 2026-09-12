import Link from "next/link";

const links = [
  { href: "/", label: "হোম" },
  { href: "/about", label: "পরিচিতি" },
  { href: "/activities", label: "কার্যক্রম" },
  { href: "/fitness-tips", label: "ফিটনেস টিপস" },
  { href: "/healthy-lifestyle", label: "স্বাস্থ্যকর জীবনযাপন" },
  { href: "/events", label: "ইভেন্ট" },
  { href: "/gallery", label: "গ্যালারি" },
  { href: "/blog", label: "ব্লগ" },
  { href: "/members", label: "সদস্যবৃন্দ" },
  { href: "/contact", label: "যোগাযোগ" },
];

export default function Nav({ active, orgName }: { active?: string; orgName?: string }) {
  return (
    <nav className="navbar">
      <Link href="/" className="brand">
        <img src="/logo.png" alt={orgName || "স্বপ্নছোঁয়া"} />
        <span className="disp">{orgName || "স্বপ্নছোঁয়া"}</span>
      </Link>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={"nav-link" + (active === l.href ? " active" : "")}
        >
          {l.label}
        </Link>
      ))}
      <Link href="/login" className="nav-cta">
        লগইন
      </Link>
    </nav>
  );
}
