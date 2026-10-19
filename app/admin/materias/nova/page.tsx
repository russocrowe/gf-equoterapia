import Link from "next/link";
import PostForm from "@/components/admin/PostForm";
import { createPostAction } from "@/app/admin/actions";
import { requireAdminPage } from "@/lib/auth";
import { buildSuggestions } from "@/lib/post-suggestions";
import { getAllPostsAdmin } from "@/lib/posts";

export default async function NewPostPage() {
  await requireAdminPage("/admin/materias/nova");
  const suggestions = buildSuggestions(await getAllPostsAdmin());

  return (
    <div>
      <Link href="/admin/materias" className="link-arrow">
        ← Voltar às matérias
      </Link>
      <h1 className="my-6 text-[clamp(2rem,1.4rem+2vw,2.8rem)]">
        Nova <em>matéria</em>
      </h1>
      <PostForm action={createPostAction} suggestions={suggestions} />
    </div>
  );
}
