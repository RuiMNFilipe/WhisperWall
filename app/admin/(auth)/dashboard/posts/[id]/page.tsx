"use server";

import { getPost } from "@/actions/get-post";
import ReplyForm from "@/components/ReplyForm";

async function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const post = await getPost(Number(id));
  if (!post) return <div>Post not found.</div>;

  return (
    <section className="flex flex-col h-screen w-screen items-center justify-center">
      <h1>Post Details</h1>
      <div className="flex flex-col w-[70%] mx-auto border border-slate-400 rounded-xl bg-slate-600 gap-10 p-10">
        <div className="w-full text-center text-white">
          <p>{post.content}</p>
        </div>
        <ReplyForm post={post} />
      </div>
    </section>
  );
}

export default PostDetailPage;
