"use server";

import { getAnsweredPosts } from "@/actions/get-answered-posts";
import Card from "./Card";

const PostsList = async () => {
  const posts = await getAnsweredPosts();

  return (
    <div className="w-[70%] grid grid-cols-3 gap-6 mx-auto justify-center">
      {posts.map((post) => (
        <Card key={post.id} content={post.content} answer={post.answer} />
      ))}
    </div>
  );
};

export default PostsList;
