"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/db/db";

export async function logoutModAction() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;

    if (!sessionToken) {
      console.error("No session token found in cookies.");
      redirect("/admin");
    }

    const moderator = await prisma.moderator.findUnique({
      where: {
        sessionToken,
      },
    });

    if (!moderator) {
      console.error("No moderator found in the provided session token.");
      redirect("/admin");
    }

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
  } catch (error) {
    console.error("An error occurred during logout:", error);
    throw error;
  }
}
