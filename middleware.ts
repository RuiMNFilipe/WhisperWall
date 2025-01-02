"use server";

import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("sessionToken")?.value;

  const isAdminPath = req.nextUrl.pathname === "/admin";
  const isDashboardPath = req.nextUrl.pathname.startsWith("/admin/dashboard");

  // Redirect signed-in moderators from /admin to /admin/dashboard
  if (isAdminPath && sessionToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Redirect unauthenticated users from /admin/dashboard to /admin
  if (isDashboardPath && !sessionToken) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Allow access to any other path
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
