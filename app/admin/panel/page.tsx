"use client";

import { getUsersAction } from "@/actions/get-users";
import { updateUserRoleAction } from "@/actions/update-user-role";
import { AdminColumns } from "@/components/AdminColumns";
import { DataTable } from "@/components/DataTable";
import { Moderator, Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminPanelPage = () => {
  const [usersList, setUsersList] = useState<Moderator[] | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [originalRoleMap, setOriginalRoleMap] = useState<Record<number, Role>>(
    {}
  );

  useEffect(() => {
    const fetchUsersList = async () => {
      const result = await getUsersAction();

      if (result.success) {
        setUsersList(result.data as Moderator[]);
        const initialRoleMap = (
          result.data as {
            id: number;
            email: string;
            password: string;
            sessionToken: string | null;
            role: Role;
          }[]
        )?.reduce((acc, user) => {
          acc[user.id] = user.role;
          return acc;
        }, {} as Record<number, Role>);

        setOriginalRoleMap(initialRoleMap);
      } else {
        toast.error(result.message);
      }
    };

    fetchUsersList();
  }, []);

  const onConfirmRoleChange = async (id: number, newRole: Role) => {
    const result = await updateUserRoleAction(id, newRole);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
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
    originalRoleMap,
  });

  return (
    <section>
      <DataTable columns={adminCols} data={usersList} />
    </section>
  );
};

export default AdminPanelPage;
