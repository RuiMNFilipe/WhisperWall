"use server";

import { prisma } from "@/lib/db";
import { ServerActionFeedback } from "@/types";
import { splitSessionAndRole } from "./utils";
import { Role } from "@prisma/client";

export const modDeletePostAction = async (
  id: number
): Promise<ServerActionFeedback> => {
  try {
    const [sessionToken, role] = await splitSessionAndRole("sessionToken");

    if (!sessionToken) {
      return {
        success: false,
        message: "Utilizador tem que estar autenticado.",
      };
    }

    if (role !== Role.ADMIN) {
      return {
        success: false,
        message:
          "Utilizador não tem permissões suficientes para remover utilizadores.",
      };
    }

    const postToDelete = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!postToDelete) {
      return {
        success: false,
        message: "Post que quer apagar não existe.",
      };
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
      message: `Post com ID ${id} removido com sucesso!`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Um erro ocorreu a apagar o post. Por favor, tente mais tarde.",
    };
  }
};
