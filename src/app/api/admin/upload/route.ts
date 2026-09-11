import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/upload";
import { withJsonErrors } from "@/lib/apiError";

export const POST = withJsonErrors(async (req: NextRequest) => {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "কোনো ফাইল পাওয়া যায়নি" }, { status: 400 });
  }
  const url = await uploadImage(file);
  return NextResponse.json({ url });
});
