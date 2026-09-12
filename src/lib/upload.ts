import { put } from "@vercel/blob";
import { prisma } from "./prisma";

// Keeps stored images comfortably under Vercel's ~4.5MB serverless request
// body limit once base64-encoded (which inflates size by ~33%).
const MAX_DB_IMAGE_BYTES = 3 * 1024 * 1024;

/** Uploads an image file and returns its public URL.
 *  Uses Vercel Blob when configured (BLOB_READ_WRITE_TOKEN), otherwise
 *  stores the image directly in Postgres and serves it via /api/images/[id]
 *  — this needs no extra setup beyond the database that's already running. */
export async function uploadImage(file: File) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    const ext = file.name.split(".").pop() || "jpg";
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const blob = await put(key, file, { access: "public", token });
    return blob.url;
  }

  if (file.size > MAX_DB_IMAGE_BYTES) {
    throw new Error(
      `৩ মেগাবাইটের বড় ছবি আপলোড করতে Vercel Blob storage সংযুক্ত করুন (Vercel Dashboard -> Storage -> Blob), অথবা ছোট আকারের ছবি ব্যবহার করুন। (ফাইলের আকার: ${(file.size / 1024 / 1024).toFixed(1)}MB)`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await prisma.imageAsset.create({
    data: {
      data: buffer.toString("base64"),
      mimeType: file.type || "image/jpeg",
    },
  });
  return `/api/images/${asset.id}`;
}
