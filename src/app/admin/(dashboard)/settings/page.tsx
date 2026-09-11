import { prisma } from "@/lib/prisma";
import { defaultSettings } from "@/lib/content";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings: any = defaultSettings;
  try {
    settings = await prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  } catch {
    // DB not migrated yet; edit form still renders with defaults.
  }

  return (
    <div>
      <h1 className="disp" style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>সাইট কনটেন্ট</h1>
      <SettingsForm initial={settings} />
    </div>
  );
}
