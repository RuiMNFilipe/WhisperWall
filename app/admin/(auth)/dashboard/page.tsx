"use client";

import ModDashboardHeader from "@/components/ModDashboardHeader";
import { DataTable } from "@/components/DataTable";
import { createColumns } from "@/components/headers";
import { useEffect, useState } from "react";
import { getAllPostsAction } from "@/actions/get-all-posts";
import { toast } from "react-toastify";
import { Post } from "@prisma/client";
import { getAvgResponseTimeAction } from "@/actions/getAvgResponseTime";
import { ReplyTime } from "@/types";
import { formatTimeObject } from "@/lib/utils";

function DashboardPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [avgResponseTime, setAvgResponseTime] = useState<ReplyTime | null>(
    null
  );

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

    const fetchAvgReplyTimes = async () => {
      const result = await getAvgResponseTimeAction();

      if (result.success) {
        setAvgResponseTime(result.avgReplyTime as ReplyTime);
      } else {
        console.error(result.message);
      }
    };

    fetchPosts();
    fetchAvgReplyTimes();
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
      <h2>
        Tempo médio de resposta:{" "}
        <span>
          {avgResponseTime
            ? formatTimeObject(avgResponseTime)
            : "A calcular..."}
        </span>
      </h2>
    </section>
  );
}

export default DashboardPage;
