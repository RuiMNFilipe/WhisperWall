"use client";

import ModDashboardHeader from "@/components/ModDashboardHeader";
import { DataTable } from "@/components/DataTable";
import { createColumns } from "@/components/headers";
import { useEffect, useState } from "react";
import { getAllPostsAction } from "@/actions/get-all-posts";
import { toast } from "react-toastify";
import { Post } from "@prisma/client";

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

  const handleDelete = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts === null ? null : prevPosts.filter((post) => post.id !== postId)
    );
  };

  if (!posts) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }
  return (
    <section>
      <ModDashboardHeader />
      <DataTable columns={createColumns(handleDelete)} data={posts} />
    </section>
  );
}

export default DashboardPage;
