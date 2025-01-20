"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";
import { splitSessionAndRole } from "./utils";
import { Role } from "@prisma/client";

export const adminDeleteUserAction = async (
  id: number
): Promise<ServerActionFeedback> => {
  const [sessionToken, role] = await splitSessionAndRole("sessionToken");

  if (!sessionToken) {
    return {
      success: false,
      message: "Apenas utilizadores podem utilizar esta ação.",
    };
  }

  if (role !== Role.ADMIN) {
    return {
      success: false,
      message: "Apenas administradores podem utilizar esta ação.",
    };
  }

  try {
    const userToDelete = await prisma.moderator.findUnique({
      where: {
        id,
      },
    });

    if (!userToDelete) {
      return {
        success: false,
        message: "Utilizador que quer remover não existe.",
      };
    }

    await prisma.moderator.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: `Utilizador com ID ${id} removido com sucesso!`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente novamente.",
    };
  }
};
