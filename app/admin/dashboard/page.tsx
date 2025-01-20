"use client";

import { DataTable } from "@/components/DataTable";
import { ModeratorColumns } from "@/components/ModeratorColumns";
import { useEffect, useState } from "react";
import { getAllPostsAction } from "@/actions/get-all-posts";
import { toast } from "react-toastify";
import { Post } from "@prisma/client";
import { getAvgResponseTimeAction } from "@/actions/getAvgResponseTime";
import { ReplyTime } from "@/types";
import { formatTimeObject } from "@/lib/utils";
import { FaSpinner } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

function DashboardPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [avgResponseTime, setAvgResponseTime] = useState<ReplyTime | null>(
    null
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "unauthorized") {
      toast.error("Apenas administradores podem aceder a essa página.");
    }

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
  }, [searchParams]);

  const handleDelete = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts === null ? null : prevPosts.filter((post) => post.id !== postId)
    );
  };

  if (!posts) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <FaSpinner className="animate-spin" size={30} />
      </div>
    );
  }
  return (
    <section>
      <DataTable columns={ModeratorColumns(handleDelete)} data={posts} />
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
