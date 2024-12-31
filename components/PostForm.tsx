"use client";

import { createPostAction } from "@/actions/create-post";
import { toast } from "react-toastify";

const PostForm = () => {
  const handleSubmit = async (formData: FormData) => {
    const result = await createPostAction(formData);

    if (result.success) {
      toast.success(result.message);
    } else {
      console.error(result.message);
      toast.error(result.message);
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
