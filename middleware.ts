"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  const sessionToken = (await cookies()).get("sessionToken")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
