import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /* /admin/kayit: cookie kontrolü layout’ta (ilk kurulumda admin yokken tek kayıt için açık) */
  if (pathname === "/admin/login" || pathname === "/admin/kayit") {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jose.jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};