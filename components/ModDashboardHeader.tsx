"use client";

import Link from "next/link";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import { logoutModAction } from "@/actions/logout-mod";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";

function ModDashboardHeader() {
  const { pending } = useFormStatus();

  const handleLogout = async () => {
    const result = await logoutModAction();

    if (result.success && result.redirectTo) {
      toast.success("Sessão terminada com sucesso!");
      redirect(result.redirectTo);
    } else {
      toast.error(result.message);
      redirect(result.redirectTo!);
    }
  };

  return (
    <header className="flex justify-between items-center px-10">
      <Link href={"/"}>
        <Image
          alt="Logo"
          src="https://place-hold.it/50"
          width={50}
          height={50}
        />
      </Link>
      <Link href={"/admin/dashboard"}>Dashboard</Link>
      <button onClick={handleLogout} disabled={pending}>
        <FaSignOutAlt />
      </button>
    </header>
  );
}

export default ModDashboardHeader;
