import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withJsonErrors } from "@/lib/apiError";

export const dynamic = "force-dynamic";

export const GET = withJsonErrors(async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const asset = await prisma.imageAsset.findUnique({ where: { id } });
  if (!asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const buffer = Buffer.from(asset.data, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": asset.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});
