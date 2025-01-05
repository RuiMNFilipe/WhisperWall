import { prisma } from "@/db/db";
import { ServerActionFeedback } from "@/types";
import { revalidatePath } from "next/cache";

export const getAnsweredPostsAction =
  async (): Promise<ServerActionFeedback> => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          answered: true,
        },
      });

      revalidatePath("/");

      return { success: true, data: posts };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          "Ocorreu um erro inesperado ao tentar obter lista de Posts respondidos. Por favor, tente mais tarde.",
      };
    }
  };
