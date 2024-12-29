import { createPostAction } from "@/actions/create-post";

export default function Home() {
  return (
    <main className="bg-slate-400 h-screen py-8">
      <form
        action={createPostAction}
        className="flex flex-col items-center gap-y-8"
      >
        <textarea name="content" required className="resize-none text-black" />
        <button type="submit" className="rounded-md bg-blue-300 text-white p-2">
          Submeter
        </button>
      </form>
    </main>
  );
}
