"use server";

import { prisma } from "@/lib/db";
import { ServerActionFeedback } from "@/types";
import { Role } from "@prisma/client";
import { splitSessionAndRole } from "./utils";

const validRoles = [Role.ADMIN, Role.MODERATOR];

export const getRoleAction = async (): Promise<ServerActionFeedback> => {
  try {
    const [sessionToken, role] = await splitSessionAndRole("sessionToken");

    if (!sessionToken)
      return {
        success: false,
        message: "Utilizador tem que entrar para aceder a esta página.",
      };

    if (!validRoles.includes(role as Role)) {
      return {
        success: false,
        message: "A função do utilizador é inválida.",
      };
    }

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
