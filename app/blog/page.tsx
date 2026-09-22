import Link from "next/link";
import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getFeaturedPost, getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Um espaço para conversar sobre cuidado, infância e o vínculo que construímos ao caminhar juntos.",
};

export default async function BlogPage() {
  const [posts, featured] = await Promise.all([
    getPublishedPosts(),
    getFeaturedPost(),
  ]);

  const restPosts = featured
    ? posts.filter((post) => post.id !== featured.id)
    : posts;

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <span className="mb-4 inline-block border-t border-ink/40 pt-3 font-display text-xs font-semibold uppercase tracking-widest text-muted">
          Blog GF Equoterapia
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Histórias, encontros
          <br />e novos olhares.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted">
          Um espaço para conversar sobre cuidado, infância e o vínculo que
          construímos ao caminhar juntos.
        </p>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-3xl bg-lime/40 px-8 py-10 sm:px-12">
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-muted">
              Leitura em destaque · {featured.category}
            </span>
            <h2 className="mt-3 max-w-xl font-display text-2xl font-semibold sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-lg text-sm text-muted">
              {featured.excerpt}
            </p>
            <Link
              href={`/blog/${featured.slug}`}
              className="mt-5 inline-flex font-display text-sm font-semibold underline decoration-2 underline-offset-4"
            >
              Ler artigo ↗
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="border-b border-ink/10 pb-6 font-display text-xl font-semibold">
          Para ler com calma
        </h2>
        <div className="flex flex-col">
          {restPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {restPosts.length === 0 && (
            <p className="py-8 text-sm text-muted">
              Novos artigos em breve.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
