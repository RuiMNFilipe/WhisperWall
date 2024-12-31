"use client";

import { Post } from "@prisma/client";
import Card from "./Card";

interface PostsListProps {
  answeredPosts: Post[];
}

const PostsList = ({ answeredPosts }: PostsListProps) => {
  return (
    <div className="w-[70%] grid grid-cols-3 gap-6 mx-auto justify-center">
      {answeredPosts.map((post) => (
        <Card key={post.id} content={post.content} answer={post.answer} />
      ))}
    </div>
  );
};

export default PostsList;
