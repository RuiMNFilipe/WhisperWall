"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";

export const getAllPostsAction = async (): Promise<ServerActionFeedback> => {
  try {
    const allPosts = await prisma.post.findMany();
    return { success: true, data: allPosts };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ocorreu um erro inesperado. Por favor, tente mais tarde.",
    };
  }
};
