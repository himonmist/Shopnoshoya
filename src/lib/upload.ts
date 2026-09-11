import { put } from "@vercel/blob";

/** Uploads an image file to Vercel Blob storage and returns its public URL. */
export async function uploadImage(file: File) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not configured. Connect Vercel Blob storage to this project (Vercel Dashboard -> Storage -> Blob) and redeploy."
    );
  }
  const ext = file.name.split(".").pop() || "jpg";
  const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const blob = await put(key, file, { access: "public", token });
  return blob.url;
}
