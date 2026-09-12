import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/memberAuth";
import { getSettings } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PopupAnnouncement from "@/components/PopupAnnouncement";
import MembersDirectory from "@/components/MembersDirectory";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const [member, s] = await Promise.all([getCurrentMember(), getSettings()]);
  if (!member) redirect("/login");

  return (
    <>
      <PopupAnnouncement enabled={s.popupEnabled} imageUrl={s.popupImageUrl} linkUrl={s.popupLinkUrl} title={s.popupTitle} />
      <Nav active="/members" orgName={s.orgName} />
      <header className="page-header">
        <div className="eyebrow">সদস্যবৃন্দ</div>
        <h1 className="page-title">{s.orgName}র সদস্যরা</h1>
        <p className="page-desc">আমাদের অনুমোদিত সদস্যদের তালিকা ও পরিচিতি।</p>
      </header>

      <MembersDirectory />

      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
