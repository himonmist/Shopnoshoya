import { NextResponse } from "next/server";
import { getApprovedMembers } from "@/lib/members";
import { withJsonErrors } from "@/lib/apiError";

export const dynamic = "force-dynamic";

export const GET = withJsonErrors(async () => {
  const members = await getApprovedMembers();
  return NextResponse.json(members);
});
