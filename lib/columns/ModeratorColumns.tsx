"use client";

import { setLocaleDateAndTime } from "@/lib/utils";
import { Post } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { FaCheck, FaReply, FaTrashAlt } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import DeleteDialog from "../../components/DeleteDialog";
import { modDeletePostAction } from "@/actions/mod-delete-post";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const ModeratorColumns = (
  onDelete: (id: number) => void
): ColumnDef<Post>[] => [
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
    accessorKey: "content",
    header: "Conteúdo",
  },
  {
    accessorKey: "answered",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Respondido
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const answeredStatus = row.getValue("answered") as boolean;
      if (answeredStatus) {
        return <FaCheck color="green" />;
      } else {
        return <FaX color="red" />;
      }
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data Criação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdTime = row.getValue("created_at") as Date;

      return setLocaleDateAndTime(createdTime);
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const postId = row.getValue("id") as number;

      const handleConfirm = async (postId: number) => {
        const result = await modDeletePostAction(postId);

        if (result.success) {
          toast.success(result.message);
          onDelete(postId);
        } else {
          toast.error(result.message);
        }
      };

      return (
        <div className="flex items-center gap-x-5">
          <Button title="Responder" variant={"ghost"}>
            <Link href={`dashboard/posts/${postId}`}>
              <FaReply color="green" />
            </Link>
          </Button>
          <DeleteDialog
            triggerElement={
              <Button title="Apagar" variant={"ghost"}>
                <FaTrashAlt color="red" />
              </Button>
            }
            title={`Tem a certeza que quer apagar o Post com ID ${postId}?`}
            description="Esta ação é irreversível e irá remover este post permanentemente."
            onConfirm={async () => await handleConfirm(postId)}
          />
        </div>
      );
    },
  },
];
