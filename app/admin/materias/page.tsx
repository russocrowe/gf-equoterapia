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
        <div>
          <p className="eyebrow">Conteúdo</p>
          <h1 className="mt-4 text-[clamp(2rem,1.4rem+2vw,2.8rem)]">
            <em>Matérias</em>
          </h1>
        </div>
        <Link href="/admin/materias/nova" className="btn btn-primary">
          Nova matéria
        </Link>
      </div>

      <ul className="mt-10 flex flex-col gap-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="card flex flex-wrap items-center justify-between gap-4 p-5 md:px-7"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`rounded-full px-2.5 py-1 font-bold ${
                    post.published
                      ? "bg-forest text-white"
                      : "bg-sand-soft text-gold-ink"
                  }`}
                >
                  {post.published ? "Publicada" : "Rascunho"}
                </span>
                {post.featured && (
                  <span className="rounded-full border border-gold px-2.5 py-1 font-bold text-gold-ink">
                    Destaque
                  </span>
                )}
                <span className="text-muted">{post.category}</span>
                {post.published_at && (
                  <span className="text-muted">
                    · {formatDate(post.published_at)}
                  </span>
                )}
              </div>
              <p className="mt-2.5 font-display text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
                {post.title}
              </p>
              <p className="mt-1 text-xs text-muted">/blog/{post.slug}</p>
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
          </li>
        ))}
        {posts.length === 0 && (
          <li className="card p-7 text-[15px] text-muted">
            Nenhuma matéria ainda. Crie a primeira: matérias novas ajudam o
            site a ser encontrado no Google.
          </li>
        )}
      </ul>
    </div>
  );
}
