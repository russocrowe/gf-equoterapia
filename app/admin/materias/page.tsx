import Link from "next/link";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { formatDate } from "@/lib/format";
import { requireAdminPage } from "@/lib/auth";
import { getAllPostsAdmin } from "@/lib/posts";

export default async function AdminPostsPage() {
  await requireAdminPage("/admin/materias");
  const posts = await getAllPostsAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[2.4rem]">
          <em>Matérias</em>
        </h1>
        <Link href="/admin/materias/nova" className="btn btn-primary">
          Nova matéria
        </Link>
      </div>

      <div className="mt-8 flex flex-col">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-wrap items-center justify-between gap-4 border-t border-rule-strong py-5"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`rounded-full px-2.5 py-0.5 font-medium ${
                    post.published ? "bg-navy text-white" : "bg-mist"
                  }`}
                >
                  {post.published ? "Publicada" : "Rascunho"}
                </span>
                {post.featured && (
                  <span className="rounded-full border border-rule-strong px-2.5 py-0.5 font-medium">
                    Destaque
                  </span>
                )}
                <span>{post.category}</span>
                {post.published_at && <span>· {formatDate(post.published_at)}</span>}
              </div>
              <p className="mt-2 font-display text-[1.15rem] font-medium leading-snug tracking-[-0.02em]">
                {post.title}
              </p>
              <p className="mt-1 text-xs">/blog/{post.slug}</p>
            </div>
            <div className="flex shrink-0 items-center gap-5 text-sm">
              {post.published && (
                <Link href={`/blog/${post.slug}`} className="link-arrow">
                  Ver ↗
                </Link>
              )}
              <Link href={`/admin/materias/${post.id}`} className="link-arrow">
                Editar
              </Link>
              <DeletePostButton id={post.id} title={post.title} />
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="border-t border-rule-strong pt-5 text-sm">
            Nenhuma matéria ainda. Crie a primeira.
          </p>
        )}
      </div>
    </div>
  );
}
