import PostForm from "@/components/admin/PostForm";
import { createPostAction } from "@/app/admin/actions";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Novo artigo</h1>
      <div className="mt-8 max-w-2xl">
        <PostForm action={createPostAction} />
      </div>
    </div>
  );
}
