"use client";

import { getRoleAction } from "@/actions/get-role";
import { logoutModAction } from "@/actions/logout-mod";
import ModDashboardHeader from "@/components/ModDashboardHeader";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<Role | null>(null);

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
  }, []);

  const handleLogout = async () => {
    const result = await logoutModAction();

    if (result.success && result.redirectTo) {
      setUserRole(null);
      toast.success("Sessão terminada com sucesso!");
      redirect(result.redirectTo);
    } else {
      toast.error(result.message);
      redirect(result.redirectTo!);
    }
  };

  return (
    <section>
      <ModDashboardHeader userRole={userRole} onLogout={handleLogout} />
      {children}
    </section>
  );
}
