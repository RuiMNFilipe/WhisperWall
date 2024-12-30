import { createPostAction } from "@/actions/create-post";
import PostsList from "@/components/PostsList";

export default function Home() {
  return (
    <main className="bg-slate-400 h-screen py-8">
      <form
        action={createPostAction}
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

      <PostsList />
    </main>
  );
}
