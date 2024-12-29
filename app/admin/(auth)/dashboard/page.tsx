"use server";

import { FaPencil, FaX } from "react-icons/fa6";
import { FaCheck, FaTrashAlt } from "react-icons/fa";

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
import { getAllPosts } from "@/actions/get-all-posts";
import { trimContentSize } from "@/lib/utils";

async function DashboardPage() {
  const posts = await getAllPosts();

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
                <FaPencil color="green" />
                <FaTrashAlt color="red" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export default DashboardPage;
