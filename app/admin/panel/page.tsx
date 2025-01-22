"use client";

import { adminAddModAction } from "@/actions/admin-add-mod";
import { getUsersAction } from "@/actions/get-users";
import { updateUserRoleAction } from "@/actions/update-user-role";
import { AdminColumns } from "@/lib/columns/AdminColumns";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Moderator, Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { FaSpinner, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTempNewUser } from "@/hooks/useTempNewUser";
import { adminDeleteUserAction } from "@/actions/admin-delete-user";

const AdminPanelPage = () => {
  const [usersList, setUsersList] = useState<Moderator[] | null>(null);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [originalRoleMap, setOriginalRoleMap] = useState<Record<number, Role>>(
    {}
  );
  const [addingUser, setAddingUser] = useState<boolean>(false);
  const {
    resetTempNewUser,
    setTempNewUser,
    tempNewUser,
    updateTempNewUserField,
  } = useTempNewUser();

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

  const handleAddUserRow = () => {
    if (!addingUser) {
      const newEmptyUser: Partial<Moderator> = {
        id: -1,
        email: "",
        password: "",
        role: Role.MODERATOR, // default value
      };
      setTempNewUser(newEmptyUser as Moderator);
      setAddingUser(true);
    }
  };

  const handleSaveNewUser = async () => {
    if (!tempNewUser?.email || !tempNewUser?.role) {
      return;
    }

    const formData = new FormData();
    formData.append("email", tempNewUser.email);
    formData.append("role", tempNewUser.role);
    formData.append("password", "test");

    const result = await adminAddModAction(formData);

    if (result.success) {
      toast.success(result.message);
      const updatedUsersResult = await getUsersAction();

      if (updatedUsersResult.success) {
        setUsersList(updatedUsersResult.data as Moderator[]);
      }

      resetTempNewUser();
      setAddingUser(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleCancelNewUser = () => {
    resetTempNewUser();
    setAddingUser(false);
  };

  const handleDeleteUser = async (id: number) => {
    const result = await adminDeleteUserAction(id);

    if (result.success) {
      toast.success(result.message);
      const updatedUsersResult = await getUsersAction();

      if (updatedUsersResult.success) {
        setUsersList(updatedUsersResult.data as Moderator[]);
      }
    } else {
      toast.error(result.message);
    }
  };

  const adminCols = AdminColumns({
    editingRowId,
    setEditingRowId,
    onConfirmRoleChange,
    usersList: [
      ...usersList,
      ...(tempNewUser ? [tempNewUser as Moderator] : []),
    ],
    setUsersList,
    originalRoleMap,
    updateTempNewUserField,
    handleDeleteUser,
  });

  return (
    <section className="flex flex-col items-center">
      <h1>Painel de Administração</h1>
      <Button
        variant={"outline"}
        className="bg-green-500 hover:bg-green-600"
        title="Adicionar utilizador"
        onClick={handleAddUserRow}
      >
        <FaUserPlus color="white" />
        <p className="text-white">Adicionar utilizador</p>
      </Button>
      <DataTable
        className="min-w-[75%]"
        columns={adminCols}
        data={[
          ...usersList,
          ...(tempNewUser ? [tempNewUser as Moderator] : []),
        ]}
      />
      {addingUser && (
        <div className="mt-4 flex justify-center gap-4">
          <Button
            variant={"outline"}
            className="bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
            onClick={() => handleSaveNewUser()}
          >
            Guardar
          </Button>
          <Button
            variant={"outline"}
            className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
            onClick={handleCancelNewUser}
          >
            Cancelar
          </Button>
        </div>
      )}
    </section>
  );
};

export default AdminPanelPage;
