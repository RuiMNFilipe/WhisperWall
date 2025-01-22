"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";
import { splitSessionAndRole } from "./utils";

export const modReplyAction = async (
  formData: FormData,
  postId: number
): Promise<ServerActionFeedback> => {
  try {
    const [sessionToken] = await splitSessionAndRole("sessionToken");

    if (!sessionToken) {
      return {
        success: false,
        message: "Utilizador tem que entrar para poder responder.",
      };
    }

    const answer = formData.get("answer");

    if (!answer || typeof answer !== "string" || answer.trim() === "") {
      return { success: false, message: "A resposta não pode estar vazia." };
    }

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        answer: answer as string,
        answered: true,
        replied_at: new Date(),
      },
    });

    return { success: true, redirectTo: "/admin/dashboard" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Ocorreu um erro inesperado ao atualizar o post. Por favor, tente mais tarde.",
    };
  }
};
