"use client";

import { Moderator } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { FaTrashAlt } from "react-icons/fa";
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
    header: "Ações",
    cell: ({ row }) => {
      const email = row.getValue("email") as number;

      return (
        <div className="flex items-center gap-x-5">
          <Button variant={"ghost"}>
            <FaPencil color="green" />
          </Button>
          <DeleteDialog
            triggerElement={
              <Button variant={"ghost"} title="Remover post">
                <FaTrashAlt title="Remover moderador" color="red" />
              </Button>
            }
            title={`Tem a certeza que quer apagar ${email}?`}
            description="Esta ação é irreversível e irá remover este post permanentemente."
            onConfirm={() => {}}
          />
        </div>
      );
    },
  },
];
