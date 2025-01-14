"use client";

import { getUsersAction } from "@/actions/get-users";
import { AdminColumns } from "@/components/AdminColumns";
import { DataTable } from "@/components/DataTable";
import { Moderator, Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminPanelPage = () => {
  const [usersList, setUsersList] = useState<Moderator[] | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsersList = async () => {
      const result = await getUsersAction();

      if (result.success) {
        setUsersList(result.data as Moderator[]);
      } else {
        toast.error(result.message);
      }
    };

    fetchUsersList();
  }, []);

  const onConfirmRoleChange = async (id: number, newRole: Role) => {
    console.log(`User ${id} role changed to ${newRole}`);
  };

  if (!usersList)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <FaSpinner className="animate-spin" size={30} />
      </div>
    );

  const adminCols = AdminColumns({
    editingRowId,
    setEditingRowId,
    onConfirmRoleChange,
    usersList,
    setUsersList,
  });

  return (
    <section>
      <DataTable columns={adminCols} data={usersList} />
    </section>
  );
};

export default AdminPanelPage;
