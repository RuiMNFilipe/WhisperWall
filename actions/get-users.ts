"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";

export const getUsersAction = async (): Promise<ServerActionFeedback> => {
  try {
    const users = await prisma.moderator.findMany();

    return { success: true, data: users };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Ocorreu um erro inesperado ao obter lista de moderadores. Por favor, tente mais tarde.",
    };
  }
};
