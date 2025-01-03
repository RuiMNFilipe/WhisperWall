"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";

export const getRoleAction = async (): Promise<ServerActionFeedback> => {
  try {
    const cookieStore = await cookies();

    const cookieToken = cookieStore.get("sessionToken")?.value;
    const [sessionToken, role] = cookieToken
      ? cookieToken.split("|")
      : [null, null];

    if (!sessionToken)
      return {
        success: false,
        message: "Utilizador tem que entrar para aceder a esta página.",
      };

    const moderator = await prisma.moderator.findUnique({
      where: {
        sessionToken,
      },
    });

    if (!moderator)
      return {
        success: false,
        message: "Não existe nenhum registo de um utilizador com este ID.",
      };

    return { success: true, role: role as Role };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    };
  }
};
