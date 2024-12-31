"use server";

import { getAnsweredPosts } from "@/actions/get-answered-posts";
import PostForm from "@/components/PostForm";
import PostsList from "@/components/PostsList";

export default async function Home() {
  const posts = await getAnsweredPosts();

  return (
    <main className="bg-slate-400 h-screen py-8">
      <PostForm />
      <PostsList answeredPosts={posts} />
    </main>
  );
}
