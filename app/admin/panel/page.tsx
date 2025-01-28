"use client";

import { AdminColumns } from "@/lib/columns/AdminColumns";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Moderator } from "@prisma/client";
import { FaSpinner, FaUserPlus } from "react-icons/fa";

import { useAdminPanel } from "@/hooks/useAdminPanel";

const AdminPanelPage = () => {
  const {
    addingUser,
    editingRowId,
    onConfirmRoleChange,
    originalRoleMap,
    setEditingRowId,
    setUsersList,
    tempNewUser,
    updateTempNewUserField,
    usersList,
    handleAddUserRow,
    handleCancelNewUser,
    handleDeleteUser,
    handleSaveNewUser,
  } = useAdminPanel();

  if (!usersList)
    return (
      <div className="flex justify-center items-center">
        <FaSpinner className="animate-spin" size={30} />
      </div>
    );

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
      <div className="w-full overflow-auto">
        <DataTable
          className="min-w-[75%]"
          columns={adminCols}
          data={[
            ...usersList,
            ...(tempNewUser ? [tempNewUser as Moderator] : []),
          ]}
        />
      </div>
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
