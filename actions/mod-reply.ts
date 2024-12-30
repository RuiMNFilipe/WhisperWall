"use server";

import { prisma } from "@/db/db";

export const modReply = async (formData: FormData, postId: number) => {
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

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Um erro inesperado ocorreu. Por favor tente mais tarde.",
    };
  }
};
