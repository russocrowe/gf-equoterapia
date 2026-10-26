import Link from "next/link";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { formatDate } from "@/lib/format";
import { requireAdminPage } from "@/lib/auth";
import { getAllPostsAdmin } from "@/lib/posts";

const notices: Record<string, string> = {
  publicada: "Matéria publicada. Ela já aparece no site.",
  salva: "Matéria salva.",
  rascunho: "Matéria voltou a rascunho e saiu do site.",
};

type Props = {
  searchParams: Promise<{ aviso?: string }>;
};

export default async function AdminPostsPage({ searchParams }: Props) {
  await requireAdminPage("/admin/materias");
  const [{ aviso }, posts] = await Promise.all([searchParams, getAllPostsAdmin()]);
  const notice = aviso ? notices[aviso] : undefined;

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

      {notice && (
        <p
          role="status"
          className="mt-8 rounded-xl border border-forest/30 bg-sage-soft px-5 py-3 text-sm font-medium text-forest"
        >
          {notice}
        </p>
      )}

      <ul className="mt-10 flex flex-col gap-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="card flex flex-wrap items-center gap-5 p-5 md:px-6"
          >
            {post.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_image}
                alt=""
                className="aspect-video h-[72px] w-32 shrink-0 rounded-lg border border-rule object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex aspect-video h-[72px] w-32 shrink-0 items-center justify-center rounded-lg border border-dashed border-sand bg-sand-soft text-[11px] text-muted"
              >
                Sem capa
              </span>
            )}

            <div className="min-w-0 flex-1">
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
                {post.category && (
                  <span className="text-muted">
                    {post.category}
                    {post.show_category === false ? " (oculta no site)" : ""}
                  </span>
                )}
                {post.published_at && (
                  <span className="text-muted">
                    · {formatDate(post.published_at)}
                  </span>
                )}
              </div>
              <p className="mt-2 font-display text-[1.1rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
                {post.title}
              </p>
              <p className="mt-1 truncate text-xs text-muted">/blog/{post.slug}</p>
              {post.tags?.length > 0 && (
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tag-chip !px-2.5 !py-0.5 !text-[11.5px]">
                      {tag}
                    </span>
                  ))}
                </p>
              )}
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
