import { NextRequest, NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/memberAuth";
import { searchApprovedMembers } from "@/lib/members";
import { withJsonErrors } from "@/lib/apiError";

export const dynamic = "force-dynamic";

// Member-only directory (requires an approved member session — this is why
// it lives outside /api/member/* but is still gated here rather than
// relying on middleware's path-prefix match alone).
export const GET = withJsonErrors(async (req: NextRequest) => {
  const member = await getCurrentMember();
  if (!member) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const page = Number(req.nextUrl.searchParams.get("page") || "1");
  const query = req.nextUrl.searchParams.get("q") || "";
  const result = await searchApprovedMembers({ page, query });
  return NextResponse.json(result);
});
