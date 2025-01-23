import { authenticateModAction } from "@/actions/authenticate-mod";
import { splitSessionAndRole } from "@/actions/utils";

export async function getAuthCookie(email: string, password: string) {
  const result = await authenticateModAction(email, password);

  if (!result.success) {
    throw new Error(`Authentication failed: ${result.message}`);
  }

  return splitSessionAndRole("sessionToken");
}
