"use client";

import { Moderator, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import DeleteDialog from "./DeleteDialog";
import { Button } from "./ui/button";
import { ArrowUpDown, Check } from "lucide-react";
import { PiCaretUpDownDuotone } from "react-icons/pi";
import { FaPencil } from "react-icons/fa6";
import DropDownMenu from "./DropDownMenu";

interface AdminColumnsProps {
  editingRowId: number | null;
  setEditingRowId: (id: number | null) => void;
  onConfirmRoleChange: (id: number, newRole: Role) => Promise<void>;
  usersList: Moderator[];
  setUsersList: (updatedUsers: Moderator[]) => void;
}

export const AdminColumns = ({
  editingRowId,
  setEditingRowId,
  onConfirmRoleChange,
  usersList,
  setUsersList,
}: AdminColumnsProps): ColumnDef<Moderator>[] => {
  const roles: Role[] = ["ADMIN", "MODERATOR"];

  const handleRoleChange = (id: number, newRole: Role) => {
    const updatedUsers = usersList.map((user) =>
      user.id === id ? { ...user, role: newRole } : user
    );
    setUsersList(updatedUsers);
  };

  return [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            className="px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tipo conta
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const role = row.getValue("role") as Role;
        const id = row.getValue("id") as number;

        return editingRowId === id ? (
          <DropDownMenu
            label="Escolha o tipo de conta"
            options={roles}
            triggerBtn={
              <span className="flex item-center gap-x-2">
                <PiCaretUpDownDuotone className="h-4 w-4 mt-[2px]" />
                {role}
              </span>
            }
            onSelect={(newRole) => handleRoleChange(id, newRole)}
          />
        ) : (
          <span>{role}</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <p className="text-right">Ações</p>,
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        const id = row.getValue("id") as number;

        return (
          <div className="flex items-center justify-end">
            {editingRowId === id ? (
              <Button
                variant={"ghost"}
                onClick={() => {
                  const updatedUser = usersList.find((user) => user.id === id);

                  if (updatedUser) {
                    onConfirmRoleChange(id, updatedUser.role);
                  }
                  setEditingRowId(null);
                }}
              >
                <Check color="green" />
              </Button>
            ) : (
              <Button
                variant={"ghost"}
                title="Editar utilizador"
                onClick={() => setEditingRowId(row.getValue("id") as number)}
              >
                <FaPencil color="orange" />
              </Button>
            )}
            <DeleteDialog
              triggerElement={
                <Button variant={"ghost"} title="Eliminar utilizador">
                  <FaTrashAlt title="Remover moderador" color="red" />
                </Button>
              }
              title={`Tem a certeza que quer apagar ${email}?`}
              description="Esta ação é irreversível e irá remover este post permanentemente."
              onConfirm={() => {}}
            />
            <Button variant={"ghost"} title="Adicionar utilizador">
              <FaPlus color="green" />
            </Button>
          </div>
        );
      },
    },
  ];
};
