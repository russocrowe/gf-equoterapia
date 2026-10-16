import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import BlogFilters from "@/components/blog/BlogFilters";
import NewsletterForm from "@/components/NewsletterForm";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { formatDate } from "@/lib/format";
import { getFeaturedPost, getPublishedPosts } from "@/lib/posts";
import { getSiteImages } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Matérias",
  description:
    "Matérias sobre equoterapia, cuidado, acolhimento e os vínculos que fazem parte desse caminho.",
};

const container = "mx-auto max-w-[1320px] px-6 md:px-12";

export default async function BlogPage() {
  const [posts, featured, images] = await Promise.all([
    getPublishedPosts(),
    getFeaturedPost(),
    getSiteImages(),
  ]);
  const fallbackCover = images.materia_padrao.url;

  const restPosts = featured
    ? posts.filter((post) => post.id !== featured.id)
    : posts;

  return (
    <div>
      <section className={`${container} pb-10 pt-12 md:pt-[72px]`}>
        <p className="eyebrow">Matérias</p>
        <h1 className="my-6">
          Tudo sobre <em>Equoterapia.</em>
        </h1>
        <p className="max-w-xl text-[17px]">
          Matérias sobre cuidado, acolhimento e os vínculos que fazem parte
          desse caminho.
        </p>
      </section>

      {featured && (
        <section className={`${container} pb-14 pt-4`}>
          <article className="grid items-center gap-8 border-t-2 border-sand pt-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <Link href={`/blog/${featured.slug}`} aria-label={featured.title}>
              {featured.cover_image || fallbackCover ? (
                <Image
                  src={featured.cover_image || fallbackCover}
                  alt={`Imagem da matéria: ${featured.title}`}
                  width={1200}
                  height={800}
                  priority
                  className="aspect-[3/2] w-full rounded-xl object-cover"
                />
              ) : (
                <ImagePlaceholder
                  label="Imagem em breve"
                  className="aspect-[3/2] w-full"
                />
              )}
            </Link>
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-forest">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
                Leitura em destaque · {featured.category}
              </p>
              <h2 className="mb-4 mt-3 text-[2rem] leading-[1.2]">
                {featured.title}
              </h2>
              <p className="max-w-md text-[15px]">{featured.excerpt}</p>
              <p className="mt-4 text-xs">{formatDate(featured.published_at)}</p>
              <Link
                href={`/blog/${featured.slug}`}
                className="btn btn-primary mt-6"
              >
                Ler matéria <span aria-hidden>↗</span>
              </Link>
            </div>
          </article>
        </section>
      )}

      <section className={`${container} pb-20`}>
        <h2 className="mb-8 border-t border-rule pt-10 text-[1.9rem]">
          Para ler com calma
        </h2>
        <BlogFilters posts={restPosts} fallbackCover={fallbackCover} />
      </section>

      <section className="bg-sand">
        <div
          className={`${container} flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between`}
        >
          <div>
            <p className="tagline !text-forest text-[1.5rem] leading-none">
              Cuidando de Vidas
            </p>
            <h2 className="mt-3">
              Receba novas matérias <em>por e-mail</em>
            </h2>
            <p className="mt-3 max-w-md text-[15px]">
              Um e-mail por mês com os conteúdos mais úteis para famílias e
              profissionais. Sem spam.
            </p>
          </div>
          <div className="w-full lg:max-w-md">
            <NewsletterForm tone="light" />
          </div>
        </div>
      </section>
    </div>
  );
}
