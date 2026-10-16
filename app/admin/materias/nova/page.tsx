import Link from "next/link";
import PostForm from "@/components/admin/PostForm";
import { createPostAction } from "@/app/admin/actions";
import { requireAdminPage } from "@/lib/auth";

export default async function NewPostPage() {
  await requireAdminPage("/admin/materias/nova");

  return (
    <div>
      <Link href="/admin/materias" className="link-arrow">
        ← Voltar às matérias
      </Link>
      <h1 className="my-6 text-[2.4rem]">
        Nova <em>matéria</em>
      </h1>
      <div className="max-w-2xl">
        <PostForm action={createPostAction} />
      </div>
    </div>
  );
}
