"use client";

import { getRoleAction } from "@/actions/get-role";
import { logoutModAction } from "@/actions/logout-mod";
import ModDashboardHeader from "@/components/ModDashboardHeader";
import useAuthStore from "@/stores/authStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { login, logout, role } = useAuthStore();

  useEffect(() => {
    const fetchUserRole = async () => {
      const result = await getRoleAction();

      if (result.success && result.role) {
        login(result.role);
      } else {
        console.error(result.message);
        toast.error(result.message);
      }
    };

    fetchUserRole();
  }, [login]);

  const handleLogout = async () => {
    const result = await logoutModAction();

    if (result.success && result.redirectTo) {
      logout();
      toast.success("Sessão terminada com sucesso!");
      redirect(result.redirectTo);
    } else {
      toast.error(result.message);
      redirect(result.redirectTo!);
    }
  };

  return (
    <section>
      <ModDashboardHeader userRole={role} onLogout={handleLogout} />
      {children}
    </section>
  );
}
