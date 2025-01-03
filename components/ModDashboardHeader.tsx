"use client";

import Link from "next/link";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import { logoutModAction } from "@/actions/logout-mod";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { getRoleAction } from "@/actions/get-role";
import { Role } from "@prisma/client";

function ModDashboardHeader() {
  const { pending } = useFormStatus();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const result = await getRoleAction();

      if (result.success && result.role) {
        setUserRole(result.role);
      } else {
        console.error(result.message);
        toast.error(result.message);
      }
    };

    fetchUserRole();
  }, [userRole]);

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
      {userRole === Role.ADMIN && (
        <Link href={"panel"}>Painel Administração</Link>
      )}
      <Link href={"/admin/dashboard"}>Dashboard</Link>
      <button onClick={handleLogout} disabled={pending}>
        <FaSignOutAlt />
      </button>
    </header>
  );
}

export default ModDashboardHeader;
