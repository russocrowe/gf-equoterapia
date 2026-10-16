import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import PostCard from "@/components/PostCard";
import ShareButton from "@/components/blog/ShareButton";
import { formatDate } from "@/lib/format";
import { getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { getCenterInfo, getSiteImages } from "@/lib/public-data";
import { waLink } from "@/lib/site-config";
import { extractHeadings } from "@/lib/toc";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const container = "mx-auto max-w-[1320px] px-6 md:px-12";

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
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const [related, center, images] = await Promise.all([
    getRelatedPosts(post.category, post.id),
    getCenterInfo(),
    getSiteImages(),
  ]);
  const cover = post.cover_image || images.materia_padrao.url;
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).trim();

  const toc = extractHeadings(post.content);
  const articleUrl = `${siteUrl}/blog/${post.slug}`;

  return (
    <article>
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

      <header className={`${container} pb-10 pt-10 md:pt-14`}>
        <Link href="/blog" className="link-arrow">
          ← Voltar para matérias
        </Link>
        <p className="eyebrow mt-10">{post.category}</p>
        <h1 className="my-5 max-w-4xl">{post.title}</h1>
        <p className="max-w-2xl text-[17px]">{post.excerpt}</p>
        <p className="mt-5 text-xs">
          {formatDate(post.published_at)} · {post.read_minutes} min de leitura
          {" · "}Por {post.author_name ?? "[Nome]"},{" "}
          {post.author_role ?? "[profissão]"}
          {" · "}Revisado por {post.reviewed_by ?? "[Nome]"},{" "}
          {post.reviewed_role ?? "[profissão]"}
        </p>
      </header>

      {cover && (
        <div className={container}>
          <Image
            src={cover}
            alt={`Imagem da matéria: ${post.title}`}
            width={1536}
            height={1024}
            priority
            className="aspect-[16/8] w-full rounded-xl object-cover"
          />
          {!post.cover_image && images.materia_padrao.caption && (
            <p className="photo-note">{images.materia_padrao.caption}</p>
          )}
        </div>
      )}

      <div
        className={`${container} grid gap-12 pb-16 pt-12 lg:grid-cols-[minmax(0,1fr)_300px]`}
      >
        <div className="max-w-3xl text-[17px]">
          <MarkdownRenderer content={post.content} />
        </div>

        <aside className="lg:pt-2">
          <div className="flex flex-col gap-6 lg:sticky lg:top-8">
            {toc.length > 0 && (
              <div className="border-t-2 border-sand pt-5">
                <p className="text-xs font-bold uppercase tracking-[2px] text-forest">
                  Neste artigo
                </p>
                <nav className="mt-4 flex flex-col gap-2.5 text-sm">
                  {toc.map((item) => (
                    <a
                      key={item.slug}
                      href={`#${item.slug}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            <div className="on-dark rounded-xl border-t-4 border-gold bg-forest-deep p-6 text-white">
              <p className="font-display text-lg font-medium tracking-[-0.02em]">
                Seu filho pode se beneficiar?
              </p>
              <p className="mt-1.5 text-sm text-white/85">
                Agende uma avaliação com a nossa equipe.
              </p>
              <a
                href={waLink(center, "Olá! Gostaria de agendar uma avaliação.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold mt-5 w-full justify-center"
              >
                Agendar avaliação
              </a>
            </div>

            <ShareButton title={post.title} url={articleUrl} />
          </div>
        </aside>
      </div>

      <div className={`${container} pb-16`}>
        <div className="max-w-3xl border-t border-rule-strong pt-6">
          <p className="text-xs font-bold uppercase tracking-[2px]">
            Sobre {post.author_name ? "o(a) autor(a)" : "a autoria"}
          </p>
          <p className="mt-2 text-[17px] font-medium">
            {post.author_name ?? "[Nome da profissional]"}
          </p>
          <p className="text-sm">
            {post.author_role ?? "[Profissão]"} · Equoterapeuta formada pela
            ANDE-Brasil [confirmar]
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-rule">
          <div className={`${container} py-16`}>
            <h2 className="mb-9 text-[2rem]">
              Leia <em>também</em>
            </h2>
            <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedPost) => (
                <PostCard
                  key={relatedPost.id}
                  post={relatedPost}
                  fallbackCover={images.materia_padrao.url}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
