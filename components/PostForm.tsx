"use client";

import { createPostAction } from "@/actions/create-post";

const PostForm = () => {
  const handleSubmit = async (formData: FormData) => {
    const result = await createPostAction(formData);

    if (result.success) {
      alert("Post submetido com sucesso!");
    } else {
      console.error(result.message);
    }
  };
  return (
    <form
      action={handleSubmit}
      className="flex flex-col items-center gap-y-8 mb-10"
    >
      <textarea
        name="content"
        required
        className="resize-none text-black w-1/2"
        placeholder="Em que estás a pensar?"
      />
      <button type="submit" className="rounded-md bg-blue-300 text-white p-2">
        Submeter
      </button>
    </form>
  );
};

export default PostForm;
