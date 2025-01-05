"use server";

export const dynamic = "force-dynamic";

import { getAnsweredPostsAction } from "@/actions/get-answered-posts";
import PostForm from "@/components/PostForm";
import PostsList from "@/components/PostsList";
import { Post } from "@prisma/client";

export default async function Home() {
  const result = await getAnsweredPostsAction();

  const getNumberOfColsClass = (length: number) => {
    switch (length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      default:
        return "grid-cols-4";
    }
  };

  const numberOfColsClass = getNumberOfColsClass(
    (result.data as Post[]).length
  );

  return (
    <main className="bg-slate-400 h-screen py-8">
      <PostForm />
      <div className={`grid ${numberOfColsClass} gap-y-10`}>
        <PostsList
          answeredPosts={result.success ? (result.data as Post[]) : []}
        />
      </div>
    </main>
  );
}
