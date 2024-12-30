import { prisma } from "@/db/db";

export const getAnsweredPosts = async () => {
  try {
    return await prisma.post.findMany({
      where: {
        answered: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
