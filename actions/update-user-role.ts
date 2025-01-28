"use server";

import { ServerActionFeedback } from "@/types";
import { Role } from "@prisma/client";
import { splitSessionAndRole } from "./utils";
import { prisma } from "@/lib/db";

export const updateUserRoleAction = async (
  id: number,
  newRole: Role
): Promise<ServerActionFeedback> => {
  try {
    const [sessionToken, role] = await splitSessionAndRole("sessionToken");

    if (!sessionToken || !role || role !== Role.ADMIN) {
      return {
        success: false,
        message: "Apenas administradores podem executar esta ação.",
      };
    }

    const user = await prisma.moderator.findUnique({
      where: { id },
    });

    if (!user) {
      return {
        success: false,
        message: "Utilizador não encontrado.",
      };
    }

    await prisma.moderator.update({
      where: { id },
      data: {
        role: newRole,
      },
    });

    return {
      success: true,
      message: "Utilizador atualizado com sucesso.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Ocorreu um erro ao atualizar o utilizador. Por favor, tente novamente.",
    };
  }
};
