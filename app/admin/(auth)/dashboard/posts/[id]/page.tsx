"use server";

import { getPost } from "@/actions/get-post";
import ReplyForm from "@/components/ReplyForm";
import { Post } from "@prisma/client";
import { toast } from "react-toastify";

async function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const { success, data, message } = await getPost(Number(id));

  if (!success || !data) {
    toast.error(message);
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        ´{message}
      </div>
    );
  }

  return (
    <section className="flex flex-col h-screen w-screen items-center justify-center">
      <h1>Post Details</h1>
      <div className="flex flex-col w-[70%] mx-auto border border-slate-400 rounded-xl bg-slate-600 gap-10 p-10">
        <div className="w-full text-center text-white">
          <p>{(data as Post).content}</p>
        </div>
        <ReplyForm post={data as Post} />
      </div>
    </section>
  );
}

export default PostDetailPage;
