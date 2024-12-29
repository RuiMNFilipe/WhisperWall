"use client";

import { authenticateModAction } from "@/actions/authenticate-mod";
import Button from "@/components/Button";
import { useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa6";

export default function AdminLoginPage() {
  const { pending } = useFormStatus();

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await authenticateModAction(email as string, password as string);
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT")
        alert(
          error.message ||
            "Um erro inesperado ocorreu. Por favor, tente outra vez."
        );
    }
  };

  return (
    <section>
      <form
        className="flex flex-col items-center gap-y-5"
        action={handleSubmit}
      >
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Example@email.com"
            className="text-black"
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Tua senha"
            className="text-black"
          />
        </div>
        <Button
          type="submit"
          className="rounded-md p-2 text-white bg-green-300"
        >
          {pending ? <FaSpinner /> : "Entrar"}
        </Button>
      </form>
    </section>
  );
}
