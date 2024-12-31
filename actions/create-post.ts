"use server";

import { prisma } from "@/db/db";

export const createPostAction = async (formData: FormData) => {
  const content = formData.get("content");

  await prisma.post.create({
    data: {
      content: content as string,
      answered: false,
      answer: "",
    },
  });
};
