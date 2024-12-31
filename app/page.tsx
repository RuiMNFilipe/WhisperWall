"use server";

import { getAnsweredPostsAction } from "@/actions/get-answered-posts";
import PostForm from "@/components/PostForm";
import PostsList from "@/components/PostsList";
import { toast } from "react-toastify";

export default async function Home() {
  const result = await getAnsweredPostsAction();

  if (!result.success) toast.error(result.message);

  return (
    <main className="bg-slate-400 h-screen py-8">
      <PostForm />
      <PostsList answeredPosts={result.success ? result.data! : []} />
    </main>
  );
}
