import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/memberAuth";
import { getSettings } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MemberDashboard from "@/components/MemberDashboard";

export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  const [member, s] = await Promise.all([getCurrentMember(), getSettings()]);
  if (!member) redirect("/login");

  const { passwordHash, ...profile } = member;

  return (
    <>
      <Nav orgName={s.orgName} />
      <MemberDashboard initialProfile={profile} />
      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
