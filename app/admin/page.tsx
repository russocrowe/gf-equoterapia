import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/posts";
import DeletePostButton from "@/components/admin/DeletePostButton";

export default async function AdminDashboardPage() {
  const posts = await getAllPostsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">
          Artigos do blog
        </h1>
        <Link
          href="/admin/posts/new"
          className="rounded-full bg-green px-5 py-2.5 font-display text-sm font-semibold text-paper transition-opacity hover:opacity-90"
        >
          + Novo artigo
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white px-5 py-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    post.published
                      ? "bg-green/10 text-green"
                      : "bg-muted/10 text-muted"
                  }`}
                >
                  {post.published ? "Publicado" : "Rascunho"}
                </span>
                {post.featured && (
                  <span className="rounded-full bg-lime/50 px-2 py-0.5 text-xs font-medium text-ink">
                    Destaque
                  </span>
                )}
                <span className="text-xs text-muted">{post.category}</span>
              </div>
              <p className="mt-1 font-display text-base font-semibold">
                {post.title}
              </p>
              <p className="text-xs text-muted">/blog/{post.slug}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-sm">
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="font-display font-medium underline decoration-lime decoration-2 underline-offset-4"
              >
                Editar
              </Link>
              <DeletePostButton id={post.id} title={post.title} />
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-muted">
            Nenhum artigo ainda. Crie o primeiro.
          </p>
        )}
      </div>
    </div>
  );
}
