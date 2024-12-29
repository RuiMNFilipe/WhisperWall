"use server";

import { prisma } from "@/db/db";

export const getPost = async (id: number) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    return post;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
