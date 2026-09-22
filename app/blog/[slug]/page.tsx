import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PostCard from "@/components/PostCard";
import ShareButton from "@/components/blog/ShareButton";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { extractHeadings } from "@/lib/toc";
import { waLink } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const [related, siteUrl] = await Promise.all([
    getRelatedPosts(post.category, post.id),
    Promise.resolve(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  ]);

  const toc = extractHeadings(post.content);
  const articleUrl = `${siteUrl}/blog/${post.slug}`;

  return (
    <article className="mx-auto max-w-6xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            author: post.author_name
              ? { "@type": "Person", name: post.author_name }
              : { "@type": "Organization", name: "Centro de Equoterapia GF" },
          }),
        }}
      />

      <span className="text-xs text-tinta/50">
        Início · Blog · {post.category} · {post.title}
      </span>
      <span className="mt-4 inline-block rounded-full bg-marrom-claro px-3 py-1 font-display text-xs font-semibold text-marrom">
        {post.category}
      </span>
      <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base text-tinta/70">{post.excerpt}</p>
      <p className="mt-4 text-xs text-tinta/50">
        Por {post.author_name ?? "[Nome]"}, {post.author_role ?? "[profissão]"}
        {" · "}Revisado por {post.reviewed_by ?? "[Nome]"},{" "}
        {post.reviewed_role ?? "[profissão]"}
        {" · "}Atualizado em{" "}
        {new Date(post.updated_at).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
        {" · "}
        {post.read_minutes} min de leitura
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          <MarkdownRenderer content={post.content} />
        </div>

        <aside className="flex flex-col gap-6">
          {toc.length > 0 && (
            <div className="sticky top-24 flex flex-col gap-6">
              <div className="rounded-xl border border-tinta/10 bg-white p-5">
                <p className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
                  Neste artigo
                </p>
                <nav className="mt-3 flex flex-col gap-2 text-sm">
                  {toc.map((item) => (
                    <a
                      key={item.slug}
                      href={`#${item.slug}`}
                      className="text-tinta/70 hover:text-azul"
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="rounded-xl bg-azul p-5 text-white">
                <p className="font-display text-sm font-semibold">
                  Seu filho pode se beneficiar?
                </p>
                <p className="mt-1 text-xs text-white/80">
                  Agende uma avaliação com a nossa equipe.
                </p>
                <a
                  href={waLink("Olá! Gostaria de agendar uma avaliação.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 font-display text-sm font-semibold text-azul transition-opacity hover:opacity-90"
                >
                  Agendar avaliação
                </a>
              </div>

              <ShareButton title={post.title} url={articleUrl} />
            </div>
          )}
        </aside>
      </div>

      <div className="mt-12 flex items-start gap-4 rounded-xl border border-tinta/10 bg-white p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-marrom-claro font-display text-lg text-marrom">
          {(post.author_name ?? "?").charAt(0)}
        </span>
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
            Sobre {post.author_name ? "" : "a autoria"}
          </p>
          <p className="mt-1 font-display text-sm font-semibold">
            {post.author_name ?? "[Nome da profissional]"}
          </p>
          <p className="text-xs text-tinta/60">
            {post.author_role ?? "[Profissão]"} · Equoterapeuta formada pela
            ANDE-Brasil [confirmar]
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="border-b border-tinta/10 pb-4 font-display text-xl font-semibold">
            Leia também
          </h2>
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-3">
            {related.map((relatedPost) => (
              <PostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}

      <Link
        href="/blog"
        className="mt-10 inline-flex font-display text-sm font-semibold text-azul underline decoration-2 underline-offset-4"
      >
        ← Voltar ao blog
      </Link>
    </article>
  );
}
