"use server";

import { prisma } from "@/db/db";

export const modDeletePost = async (id: number) => {
  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Um erro ocorreu a apagar o post. Por favor tente mais tarde",
    };
  }
};
