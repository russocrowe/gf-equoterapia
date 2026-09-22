import Link from "next/link";
import type { Metadata } from "next";
import BlogFilters from "@/components/blog/BlogFilters";
import NewsletterForm from "@/components/NewsletterForm";
import { getFeaturedPost, getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artigos claros e revisados pela nossa equipe sobre equoterapia, condições tratadas, desenvolvimento e o dia a dia do centro.",
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
      <section className="bg-azul-claro">
        <div className="mx-auto max-w-6xl px-6 pt-12 pb-10">
          <span className="text-xs text-tinta/50">Início › Blog</span>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Blog de Equoterapia
          </h1>
          <p className="mt-4 max-w-xl text-sm text-tinta/70">
            Artigos claros e revisados pela nossa equipe sobre equoterapia,
            condições tratadas, desenvolvimento e o dia a dia do centro.
          </p>
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-3xl bg-white p-2 shadow-sm ring-1 ring-tinta/10 sm:p-3">
            <div className="rounded-2xl bg-marrom-claro/50 px-6 py-8 sm:px-10">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-azul px-3 py-1 font-display text-xs font-semibold text-white">
                  Em destaque
                </span>
                <span className="rounded-full bg-marrom-claro px-3 py-1 font-display text-xs font-semibold text-marrom">
                  {featured.category}
                </span>
              </div>
              <h2 className="mt-4 max-w-xl font-display text-2xl font-semibold leading-snug sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-lg text-sm text-tinta/70">
                {featured.excerpt}
              </p>
              <Link
                href={`/blog/${featured.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-azul px-6 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Ler artigo →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-8">
        <BlogFilters posts={restPosts} />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-marrom px-8 py-10 text-white sm:px-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">
                Receba novos artigos por e-mail
              </h2>
              <p className="mt-2 max-w-md text-sm text-white/80">
                Um e-mail por mês com os conteúdos mais úteis para famílias e
                profissionais. Sem spam.
              </p>
            </div>
            <div className="w-full sm:max-w-xs">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
