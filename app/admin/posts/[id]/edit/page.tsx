import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getPostByIdAdmin } from "@/lib/posts";
import { updatePostAction } from "@/app/admin/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);

  if (!post) notFound();

  const action = updatePostAction.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Editar artigo</h1>
      <div className="mt-8 max-w-2xl">
        <PostForm post={post} action={action} />
      </div>
    </div>
  );
}
