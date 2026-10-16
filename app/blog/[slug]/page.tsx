import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { formatDate } from "@/lib/format";
import { getPostBySlug } from "@/lib/posts";
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

      <div className={`${container}`}>
        <div className="mx-auto max-w-3xl">
          <header className="pb-10 pt-10 md:pt-14">
            <Link href="/equoterapia" className="link-arrow">
              ← Voltar para Equoterapia
            </Link>
            <p className="eyebrow mt-10">{post.category}</p>
            <h1 className="my-5">{post.title}</h1>
            <p className="text-[17px]">{post.excerpt}</p>
            <p className="mt-5 text-xs">{formatDate(post.published_at)}</p>
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

          <div className="pb-20 pt-10 text-[17px]">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>
      </div>
    </article>
  );
}
