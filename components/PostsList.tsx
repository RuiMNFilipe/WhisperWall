"use client";

import { Post } from "@prisma/client";
import Card from "./Card";

interface PostsListProps {
  answeredPosts: Post[];
}

const PostsList = ({ answeredPosts }: PostsListProps) => {
  return answeredPosts.length > 0 ? (
    answeredPosts.map((post) => (
      <Card key={post.id} content={post.content} answer={post.answer} />
    ))
  ) : (
    <div>Não existem Posts ainda...</div>
  );
};

export default PostsList;
