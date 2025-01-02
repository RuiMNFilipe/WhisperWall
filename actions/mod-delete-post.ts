"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";

export const modDeletePostAction = async (
  id: number
): Promise<ServerActionFeedback> => {
  try {
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
