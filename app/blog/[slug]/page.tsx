import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { formatDate } from "@/lib/format";
import { getPostBySlug, visibleCategory } from "@/lib/posts";
import { jsonLd } from "@/lib/json-ld";
import { getSiteImages } from "@/lib/public-data";

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

  const images = await getSiteImages();
  const cover = post.cover_image || images.materia_padrao.url;

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
            author: post.author_name
              ? { "@type": "Person", name: post.author_name }
              : { "@type": "Organization", name: "Centro de Equoterapia GF" },
          }),
        }}
      />

      <div className={`${container}`}>
        <div className="mx-auto max-w-3xl">
          <header className="pb-10 pt-10 md:pt-14">
            <Link href="/equoterapia" className="link-arrow">
              ← Voltar para Equoterapia
            </Link>
            {visibleCategory(post) ? (
              <p className="eyebrow mt-10">{visibleCategory(post)}</p>
            ) : null}
            <h1 className={visibleCategory(post) ? "my-5" : "mb-5 mt-10"}>
              {post.title}
            </h1>
            <p className="text-[1.1rem] leading-relaxed text-[#111]">
              {post.excerpt}
            </p>
            <p className="mt-5 text-xs text-muted">
              {formatDate(post.published_at)}
            </p>
            {post.tags?.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags da matéria">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/equoterapia?tag=${encodeURIComponent(tag)}`}
                      className="tag-chip"
                    >
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </header>

          {cover && (
            <figure>
              <Image
                src={cover}
                alt={`Imagem da matéria: ${post.title}`}
                width={1536}
                height={1024}
                priority
                className="aspect-[16/9] w-full rounded-xl object-cover"
              />
              {!post.cover_image && images.materia_padrao.caption && (
                <figcaption className="photo-note">
                  {images.materia_padrao.caption}
                </figcaption>
              )}
            </figure>
          )}

          <div className="pb-20 pt-10">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>
      </div>
    </article>
  );
}
