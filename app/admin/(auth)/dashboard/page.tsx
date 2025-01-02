"use client";

import { FaX } from "react-icons/fa6";
import { FaCheck, FaReply, FaTrashAlt } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ModDashboardHeader from "@/components/ModDashboardHeader";
import { getAllPostsAction } from "@/actions/get-all-posts";
import Link from "next/link";
import { trimContentSize } from "@/lib/utils";
import DeleteDialog from "@/components/DeleteDialog";
import { modDeletePostAction } from "@/actions/mod-delete-post";
import { Post } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function DashboardPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getAllPostsAction();

      if (result.success) {
        setPosts(result.data as Post[]);
      } else {
        console.error(result.message);
        toast.error(result.message);
      }
    };

    fetchPosts();
  }, []);

  const handleConfirm = async (post: Post) => {
    const result = await modDeletePostAction(post.id);

    if (result.success) {
      toast.success(result.message);
      setPosts((prevPosts) =>
        prevPosts === null
          ? null
          : prevPosts.filter((postToDelete) => postToDelete.id !== post.id)
      );
    } else {
      toast.error(result.message);
    }
  };

  if (posts === null) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <section>
      <ModDashboardHeader />
      <Table className="max-w-7xl mx-auto">
        <TableCaption>Lista de todos os posts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Conteúdo</TableHead>
            <TableHead>Respondido</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.id}</TableCell>
              <TableCell>{trimContentSize(post.content, 20)}</TableCell>
              <TableCell>
                {post.answered ? (
                  <FaCheck color="green" />
                ) : (
                  <FaX color="red" />
                )}
              </TableCell>
              <TableCell className="flex items-center gap-x-5">
                <Link href={`dashboard/posts/${post.id}/`}>
                  <FaReply title="Responder" color="green" />
                </Link>
                <DeleteDialog
                  triggerElement={
                    <button title="Remover post">
                      <FaTrashAlt title="Remover post" color="red" />
                    </button>
                  }
                  title={`Tem a certeza que quer apagar o Post com ID ${post.id}?`}
                  description="Esta ação é irreversível e irá remover este post permanentemente."
                  onConfirm={async () => await handleConfirm(post)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export default DashboardPage;
