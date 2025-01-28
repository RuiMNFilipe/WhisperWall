"use server";

import { prisma } from "@/lib/db";
import { ServerActionFeedback } from "@/types";
import { splitSessionAndRole } from "./utils";

export const getPostAction = async (
  id: number
): Promise<ServerActionFeedback> => {
  try {
    const [sessionToken] = await splitSessionAndRole("sessionToken");

    if (!sessionToken) {
      return {
        success: false,
        message: "Apenas utilizadores autenticados podem aceder a esta página.",
      };
    }

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
