"use client";

import Link from "next/link";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import { logoutModAction } from "@/actions/logout-mod";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";

function ModDashboardHeader() {
  const { pending } = useFormStatus();

  const handleLogout = async () => {
    try {
      await logoutModAction();
      redirect("/admin");
    } catch (error) {
      console.error(error);
      throw error;
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
      <button onClick={handleLogout} disabled={pending}>
        <FaSignOutAlt />
      </button>
    </header>
  );
}

export default ModDashboardHeader;
