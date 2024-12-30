"use server";

import { getAnsweredPosts } from "@/actions/get-answered-posts";

const PostsList = async () => {
  const posts = await getAnsweredPosts();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.content}</li>
      ))}
    </ul>
  );
};

export default PostsList;
