import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { updatePostAction } from "@/app/admin/actions";
import { requireAdminPage } from "@/lib/auth";
import { buildSuggestions } from "@/lib/post-suggestions";
import { getAllPostsAdmin, getPostByIdAdmin } from "@/lib/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  await requireAdminPage(`/admin/materias/${id}`);
  const [post, all] = await Promise.all([getPostByIdAdmin(id), getAllPostsAdmin()]);

  if (!post) notFound();

  const action = updatePostAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/materias" className="link-arrow">
        ← Voltar às matérias
      </Link>
      <h1 className="my-6 text-[clamp(2rem,1.4rem+2vw,2.8rem)]">
        Editar <em>matéria</em>
      </h1>
      <PostForm post={post} action={action} suggestions={buildSuggestions(all)} />
    </div>
  );
}
