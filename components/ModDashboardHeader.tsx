"use client";

import Link from "next/link";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import { useFormStatus } from "react-dom";
import { Role } from "@prisma/client";
import { usePathname } from "next/navigation";

interface ModDashboardHeaderProps {
  userRole: Role | null;
  onLogout: () => void;
}
function ModDashboardHeader({ userRole, onLogout }: ModDashboardHeaderProps) {
  const { pending } = useFormStatus();
  const path = usePathname();

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
      {path === "/admin" ? null : (
        <>
          {userRole === Role.ADMIN && (
            <Link href={"panel"}>Painel Administração</Link>
          )}
          <Link href={"/admin/dashboard"}>Dashboard</Link>
          <button onClick={onLogout} disabled={pending}>
            <FaSignOutAlt />
          </button>
        </>
      )}
    </header>
  );
}

export default ModDashboardHeader;
