"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/db/db";

export async function logoutModAction() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (sessionToken) {
    await prisma.moderator.update({
      where: {
        sessionToken,
      },
      data: {
        sessionToken: null,
      },
    });
    cookieStore.set({
      name: "sessionToken",
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: -1,
      sameSite: "strict",
    });

    return redirect("/admin");
  }
}
