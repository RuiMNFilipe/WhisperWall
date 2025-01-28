"use server";

import { Role } from "@prisma/client";
import { hashPassword, splitSessionAndRole } from "./utils";
import { ServerActionFeedback } from "@/types";
import { prisma } from "@/lib/db";

export const adminAddModAction = async (
  formData: FormData
): Promise<ServerActionFeedback> => {
  const newUserRole = formData.get("role") as Role;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || email.trim() === "" || !password || password.trim() === "") {
    return {
      success: false,
      message: "Os campos de texto são obrigatórios.",
    };
  }

  try {
    const [sessionToken, role] = await splitSessionAndRole("sessionToken");

    if (!sessionToken)
      return {
        success: false,
        message: "Apenas utilizadores podem usar esta ação.",
      };

    if (!role || role !== Role.ADMIN)
      return {
        success: false,
        message: "Apenas administradores podem criar utilizadores.",
      };

    const hashedPassword = await hashPassword(password);

    await prisma.moderator.create({
      data: {
        email,
        password: hashedPassword,
        role: newUserRole ?? Role.MODERATOR,
      },
    });

    return {
      success: true,
      message: "Utilizador criado com sucesso!",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        "Ocorreu um erro ao criar novo utilizador. Por favor, tente novamente.",
    };
  }
};
