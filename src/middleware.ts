import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "shopnoshoya_admin_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return redirectOrDeny(req, pathname);
    }
    try {
      const secret = process.env.AUTH_SECRET;
      if (!secret) throw new Error("missing secret");
      await jwtVerify(token, new TextEncoder().encode(secret));
    } catch {
      return redirectOrDeny(req, pathname);
    }
  }
  return NextResponse.next();
}

function redirectOrDeny(req: NextRequest, pathname: string) {
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
