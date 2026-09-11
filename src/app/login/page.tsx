import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MemberPortal from "@/components/MemberPortal";
import { getSettings } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const s = await getSettings();
  return (
    <>
      <Nav orgName={s.orgName} />
      <MemberPortal orgName={s.orgName} />
      <Footer orgName={s.orgName} tagline={s.footerTagline} address={s.contactAddress} />
    </>
  );
}
