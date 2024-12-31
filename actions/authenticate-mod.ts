"use server";

import crypto from "crypto";
import { cookies } from "next/headers";

import { prisma } from "@/db/db";
import { verifyPassword } from "./utils";

export const authenticateModAction = async (
  email: string,
  password: string
) => {
  try {
    if (!email || !password) {
      throw new Error("Campos de email e password são obrigatórios.");
    }

    const moderator = await prisma.moderator.findUnique({
      where: { email },
    });

    if (!moderator)
      throw new Error("Credenciais inválidas. Por favor, tente novamente.");

    const isPasswordValid = await verifyPassword(password, moderator.password);

    if (!isPasswordValid)
      throw new Error("Credenciais inválidas. Por favor, tente novamente.");

    const sessionToken = crypto.randomBytes(32).toString("hex");

    await prisma.moderator.update({
      where: { id: moderator.id },
      data: { sessionToken },
    });

    const cookieStore = await cookies();
    if (!cookieStore) throw new Error("Erro ao inicializar cookieStore");

    cookieStore.set({
      name: "sessionToken",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: 3600, // set to expire after 1h
    });

    return { success: true, redirectTo: "/admin/dashboard/" };
  } catch (error) {
    console.error("Um erro ocorreu: ", error);
    return {
      success: false,
      message:
        "Ocorreu um erro inesperado ao autenticar o utilizador. Por favor, tente mais tarde.",
    };
  }
};
