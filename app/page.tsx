"use server";

import { getAnsweredPostsAction } from "@/actions/get-answered-posts";
import PostForm from "@/components/PostForm";
import PostsList from "@/components/PostsList";
import { Post } from "@prisma/client";

export default async function Home() {
  const result = await getAnsweredPostsAction();

  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  const colLength = (result.data as Post[]).length;
  const numberOfColsClass =
    colClasses[(Math.min(colLength), 4)] || "grid-cols-4";

  return (
    <main className="bg-slate-400 h-screen py-8 overflow-y-scroll">
      <PostForm />
      <div
        className={`grid grid-cols-1 md:grid-cols-2 xl:${numberOfColsClass} gap-y-10`}
      >
        <PostsList
          answeredPosts={result.success ? (result.data as Post[]) : []}
        />
      </div>
    </main>
  );
}
