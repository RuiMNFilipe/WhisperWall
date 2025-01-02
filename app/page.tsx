"use server";

import { getAnsweredPostsAction } from "@/actions/get-answered-posts";
import PostForm from "@/components/PostForm";
import PostsList from "@/components/PostsList";
import { Post } from "@prisma/client";
import { toast } from "react-toastify";

export default async function Home() {
  const result = await getAnsweredPostsAction();

  if (!result.success) toast.error(result.message);

  return (
    <main className="bg-slate-400 h-screen py-8">
      <PostForm />
      <div className="grid grid-cols-4 gap-y-10">
        <PostsList
          answeredPosts={result.success ? (result.data as Post[]) : []}
        />
      </div>
    </main>
  );
}
