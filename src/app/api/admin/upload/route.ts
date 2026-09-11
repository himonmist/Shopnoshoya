import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "কোনো ফাইল পাওয়া যায়নি" }, { status: 400 });
  }
  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "আপলোড ব্যর্থ হয়েছে" }, { status: 500 });
  }
}
