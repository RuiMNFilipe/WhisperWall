"use server";

import { prisma } from "@/lib/db";

export const createPostAction = async (formData: FormData) => {
  try {
    const content = formData.get("content");

    await prisma.post.create({
      data: {
        content: content as string,
        answered: false,
        answer: "",
      },
    });

    return { success: true, message: "Post submetido com sucesso!" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Um erro inesperado ocorreu ao tentar submeter o Post. Por favor, tente novamente.",
    };
  }
};
