import { NextResponse } from "next/server";

/** Wraps a route handler so any thrown error becomes a JSON response instead
 * of an empty-body 500 (which crashes client-side `res.json()` calls). */
export function withJsonErrors<T extends (...args: any[]) => Promise<Response>>(fn: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (err: any) {
      console.error(err);
      const message =
        err?.name === "PrismaClientInitializationError" || err?.code === "P1001"
          ? "ডাটাবেসের সাথে সংযোগ করা যায়নি। DATABASE_URL ঠিক আছে কিনা এবং /api/setup চালানো হয়েছে কিনা দেখুন।"
          : err?.message || "সার্ভার ত্রুটি হয়েছে, একটু পর আবার চেষ্টা করুন।";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }) as T;
}
