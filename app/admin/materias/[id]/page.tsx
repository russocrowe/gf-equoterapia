import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { updatePostAction } from "@/app/admin/actions";
import { requireAdminPage } from "@/lib/auth";
import { getPostByIdAdmin } from "@/lib/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  await requireAdminPage(`/admin/materias/${id}`);
  const post = await getPostByIdAdmin(id);

  if (!post) notFound();

  const action = updatePostAction.bind(null, id);

  return (
    <div>
      <Link href="/admin/materias" className="link-arrow">
        ← Voltar às matérias
      </Link>
      <h1 className="my-6 text-[2.4rem]">
        Editar <em>matéria</em>
      </h1>
      <div className="max-w-2xl">
        <PostForm post={post} action={action} />
      </div>
    </div>
  );
}
