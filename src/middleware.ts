import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_PATHS = ["/api/auth", "/invite"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public paths (matcher already excludes _next/static, _next/image, favicon)
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // auth() attaches session as req.auth
  if (req.auth) {
    return NextResponse.next();
  }

  // Not authenticated — check for referral code
  const referralCode = req.nextUrl.searchParams.get("referralCode");

  if (referralCode) {
    // Store referral code in cookie and redirect to invite landing
    const url = req.nextUrl.clone();
    url.pathname = "/invite";
    url.searchParams.set("referralCode", referralCode);
    const response = NextResponse.redirect(url);
    response.cookies.set("referralCode", referralCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  // No referral code — redirect to invite page
  const url = req.nextUrl.clone();
  url.pathname = "/invite";
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
