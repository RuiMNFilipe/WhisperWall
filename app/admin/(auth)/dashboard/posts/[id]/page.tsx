"use server";

import { getPost } from "@/actions/get-post";

async function PostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const post = await getPost(Number(id));
  if (!post) return <div>Post not found.</div>;

  return (
    <div>
      <h1>Post Details</h1>
      <p>Post ID: {id}</p>
      <p>{post.content}</p>
    </div>
  );
}

export default PostDetailPage;
