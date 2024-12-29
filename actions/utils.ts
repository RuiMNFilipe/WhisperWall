import bcrypt from "bcrypt";

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
