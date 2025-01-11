"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";
import { splitSessionAndRole } from "./utils";
import { Role } from "@prisma/client";

export const getUsersAction = async (): Promise<ServerActionFeedback> => {
  try {
    const [sessionToken, role] = await splitSessionAndRole("sessionToken");

    if (!sessionToken) {
      return {
        success: false,
        message: "Apenas utilizadores autenticados podem aceder a esta página.",
      };
    }

    if (role !== Role.ADMIN) {
      return {
        success: false,
        message: "Apenas administradores podem aceder a esta página.",
      };
    }

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
