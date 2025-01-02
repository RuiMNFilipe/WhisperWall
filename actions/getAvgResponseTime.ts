"use server";

import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";

export const getAvgResponseTimeAction =
  async (): Promise<ServerActionFeedback> => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          answered: true,
          replied_at: {
            not: null,
          },
        },
        select: {
          created_at: true,
          replied_at: true,
        },
      });

      if (posts.length === 0) return { success: true, avgReplyTime: "N/A" };

      const avgReplyTime =
        posts.reduce((acc, post) => {
          const createdAt = new Date(post.created_at).getTime();
          const repliedAt = new Date(post.replied_at!).getTime();

          return acc + (repliedAt - createdAt);
        }, 0) / posts.length;

      return { success: true, avgReplyTime };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          "Um erro inesperado ocorreu ao tentar obter o tempo médio de resposta. Por favor, tente mais tarde",
      };
    }
  };
