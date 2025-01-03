"use server";

import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("sessionToken")?.value;

  const isAdminPath = req.nextUrl.pathname === "/admin";
  const isDashboardPath = req.nextUrl.pathname.startsWith("/admin/dashboard");
  const isAdminPanel = req.nextUrl.pathname.startsWith("/admin/adminpanel");

  const [sessionToken, role] = sessionCookie
    ? sessionCookie.split("|")
    : [null, null];

  // Redirect signed-in moderators from /admin to /admin/dashboard
  if (isAdminPath && sessionToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Redirect unauthenticated users from /admin/dashboard to /admin
  if (isDashboardPath && !sessionToken) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Redirect non-admin users from /admin/adminpanel to /admin/dashboard
  if (sessionToken && isAdminPanel && role !== Role.ADMIN) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Allow access to any other path
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
