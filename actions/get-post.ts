"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";

export const getPostAction = async (
  id: number
): Promise<ServerActionFeedback> => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post)
      return {
        success: false,
        message: `Não existe nenhum Post com ID ${id}.`,
      };

    return { success: true, data: post };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `Ocorreu um erro inesperado ao tentar obter o Post com ID ${id}. Por favor, tente mais tarde.`,
    };
  }
};
