"use client";

import ModDashboardHeader from "@/components/ModDashboardHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <ModDashboardHeader />
      {children}
    </section>
  );
}
