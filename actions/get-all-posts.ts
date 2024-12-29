"use server";

import { prisma } from "@/db/db";

export const getAllPosts = async () => {
  try {
    const allPosts = await prisma.post.findMany();
    return allPosts;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
