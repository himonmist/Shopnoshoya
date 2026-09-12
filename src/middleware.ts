import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE_NAME = "shopnoshoya_admin_session";
const MEMBER_COOKIE_NAME = "shopnoshoya_member_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !(await verify(token, "admin"))) {
      return redirectOrDeny(req, pathname, "/admin/login");
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/member/") || pathname.startsWith("/api/member/")) {
    const isPublicMemberRoute = pathname === "/api/member/login" || pathname === "/api/member/signup" || pathname === "/api/member/logout";
    if (isPublicMemberRoute) return NextResponse.next();

    const token = req.cookies.get(MEMBER_COOKIE_NAME)?.value;
    if (!token || !(await verify(token, "member"))) {
      return redirectOrDeny(req, pathname, "/login");
    }
  }

  return NextResponse.next();
}

async function verify(token: string, expectedTyp?: string) {
  try {
    const secret = process.env.AUTH_SECRET;
    if (!secret) throw new Error("missing secret");
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (expectedTyp && payload.typ !== expectedTyp) return false;
    return true;
  } catch {
    return false;
  }
}

function redirectOrDeny(req: NextRequest, pathname: string, loginPath: string) {
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL(loginPath, req.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/member/:path*", "/api/member/:path*"],
};
