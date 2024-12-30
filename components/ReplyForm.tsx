"use client";

import React from "react";
import { modReply } from "@/actions/mod-reply";
import { Post } from "@prisma/client";
import { redirect } from "next/navigation";

interface ReplyFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  post: Post;
}

export default function ReplyForm({ post, ...rest }: ReplyFormProps) {
  const handleReply = async (formData: FormData) => {
    const result = await modReply(formData, Number(post.id));

    if (result.success) {
      redirect(result.redirectTo!);
    } else {
      console.error(result.message);
    }
  };

  return (
    <form
      {...rest}
      action={handleReply}
      className="flex flex-col items-center gap-10"
    >
      <textarea
        className="resize-none w-full"
        placeholder="Escreve aqui a tua resposta..."
        name="answer"
        defaultValue={post.answered ? post.answer : ""}
        readOnly={post.answered}
      />
      <button
        type="submit"
        disabled={post.answered}
        className={`${
          post.answered ? "bg-green-300" : "bg-green-500"
        } rounded-md p-2 text-white`}
      >
        Submeter
      </button>
    </form>
  );
}
