"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";

export const modReplyAction = async (
  formData: FormData,
  postId: number
): Promise<ServerActionFeedback> => {
  try {
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
