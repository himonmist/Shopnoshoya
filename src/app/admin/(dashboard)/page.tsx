import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function safeCount(fn: () => Promise<number>) {
  try {
    return await fn();
  } catch {
    return 0;
  }
}

export default async function AdminDashboardPage() {
  const [activities, events, gallery, blog, messages, unread, members] = await Promise.all([
    safeCount(() => prisma.activity.count()),
    safeCount(() => prisma.eventItem.count()),
    safeCount(() => prisma.galleryImage.count()),
    safeCount(() => prisma.blogPost.count()),
    safeCount(() => prisma.contactMessage.count()),
    safeCount(() => prisma.contactMessage.count({ where: { read: false } })),
    safeCount(() => prisma.memberApplication.count({ where: { status: "pending" } })),
  ]);

  const cards = [
    { label: "কার্যক্রম", value: activities, href: "/admin/activities" },
    { label: "ইভেন্ট", value: events, href: "/admin/events" },
    { label: "গ্যালারি ছবি", value: gallery, href: "/admin/gallery" },
    { label: "ব্লগ পোস্ট", value: blog, href: "/admin/blog" },
    { label: "মোট বার্তা", value: messages, href: "/admin/messages" },
    { label: "অপঠিত বার্তা", value: unread, href: "/admin/messages" },
    { label: "সদস্যপদের আবেদন", value: members, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="disp" style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>ড্যাশবোর্ড</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 16 }}>
        {cards.map((c) => (
          <a key={c.label} href={c.href} className="admin-card" style={{ display: "block", color: "var(--text)" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--orange)" }} className="disp">{c.value}</div>
            <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{c.label}</div>
          </a>
        ))}
      </div>
      <p style={{ marginTop: 30, fontSize: 13, opacity: 0.6 }}>
        বাম পাশের মেনু থেকে সাইটের হিরো টেক্সট, পরিচিতি, কার্যক্রম, ইভেন্ট, গ্যালারি, টিপস ও ব্লগ পরিচালনা করুন। পরিবর্তন সংরক্ষণের সাথে সাথে সরাসরি লাইভ সাইটে দেখা যাবে।
      </p>
    </div>
  );
}
