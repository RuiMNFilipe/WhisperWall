"use client";

import { Moderator } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import DeleteDialog from "./DeleteDialog";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";
import { FaPencil } from "react-icons/fa6";

export const AdminColumns = (): ColumnDef<Moderator>[] => [
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
  },
  {
    id: "actions",
    header: () => <p className="text-right">Ações</p>,
    cell: ({ row }) => {
      const email = row.getValue("email") as number;

      return (
        <div className="flex items-center justify-end">
          <Button variant={"ghost"} title="Editar utilizador">
            <FaPencil color="orange" />
          </Button>
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
