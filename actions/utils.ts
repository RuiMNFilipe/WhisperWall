import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  inputPassword: string,
  storedPasswordHash: string
) {
  return await bcrypt.compare(inputPassword, storedPasswordHash);
}

export const splitSessionAndRole = async (cookieName: string) => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(cookieName)?.value;

    return sessionCookie
      ? (sessionCookie.split("|") as [string, Role])
      : [null, null];
  } catch (error) {
    throw error;
  }
};
