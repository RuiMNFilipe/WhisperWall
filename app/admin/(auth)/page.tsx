"use client";

import { authenticateModAction } from "@/actions/authenticate-mod";
import FormButton from "@/components/Button";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function AdminLoginPage() {
  const { pending } = useFormStatus();

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    const result = await authenticateModAction(
      email as string,
      password as string
    );

    if (result.success) {
      toast.success(result.message);
      redirect("/admin/dashboard/");
    } else {
      console.error(result.message);
      toast.error(result.message);
    }
  };

  return (
    <section className="w-screen h-screen flex flex-col justify-center items-center">
      <h2>Aceder ao painel de moderação</h2>
      <form
        className="flex flex-col items-stretch gap-y-5 bg-slate-300 p-8 rounded-xl"
        action={handleSubmit}
      >
        <div className="flex">
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Example@email.com"
            className="text-black flex-1"
          />
        </div>
        <div className="flex">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Tua senha"
            className="text-black flex-1"
          />
        </div>
        <FormButton
          type="submit"
          className={`rounded-md p-2 text-white ${
            pending ? "bg-green-300" : "bg-green-500"
          } flex justify-center items-center`}
        >
          {pending ? <FaSpinner /> : "Entrar"}
        </FormButton>
      </form>
    </section>
  );
}
