import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { getPostBySlug } from "@/lib/posts";

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

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            author: { "@type": "Organization", name: "GF Equoterapia" },
          }),
        }}
      />
      <Link
        href="/blog"
        className="font-display text-sm font-medium text-muted hover:text-ink"
      >
        ← Voltar ao blog
      </Link>
      <span className="mt-6 block font-display text-xs font-semibold uppercase tracking-widest text-green">
        {post.category}
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-base text-muted">{post.excerpt}</p>
      <p className="mt-6 font-display text-xs font-semibold uppercase tracking-widest text-muted">
        Editorial GF Equoterapia · {post.read_minutes} min de leitura
      </p>
      <div className="mt-8">
        <MarkdownRenderer content={post.content} />
      </div>
      <Link
        href="/blog"
        className="mt-10 inline-flex font-display text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4"
      >
        Explore outros artigos ↗
      </Link>
    </article>
  );
}
