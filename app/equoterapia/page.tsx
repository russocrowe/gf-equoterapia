import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
import T from "@/components/editor/T";
import { formatDate } from "@/lib/format";
import { getFeaturedPost, getPublishedPosts } from "@/lib/posts";
import { getSiteImages } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Equoterapia",
  description:
    "Matérias sobre equoterapia, cuidado, acolhimento e os vínculos que fazem parte desse caminho.",
};

const container = "mx-auto max-w-[1240px] px-6 md:px-10";

export default async function EquoterapiaPage() {
  const [posts, featured, images] = await Promise.all([
    getPublishedPosts(),
    getFeaturedPost(),
    getSiteImages(),
  ]);
  const fallbackCover = images.materia_padrao.url;
  const featuredCover = featured?.cover_image || fallbackCover;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-48 h-[30rem] w-[30rem] rounded-full bg-sand-soft blur-3xl"
        />
        <div className={`${container} relative pb-12 pt-14 md:pt-20`}>
          <T k="equo.eyebrow" as="p" className="eyebrow" />
          <T k="equo.title" as="h1" className="my-6" />
          <T k="equo.intro" as="p" className="lead max-w-xl" />
        </div>
      </section>

      {featured && (
        <section className={`${container} pb-16 pt-4`}>
          <Reveal>
            <article className="grid overflow-hidden rounded-3xl bg-sage-soft shadow-[var(--shadow-md)] lg:grid-cols-[1.1fr_1fr]">
              <Link
                href={`/blog/${featured.slug}`}
                aria-label={featured.title}
                className="block overflow-hidden"
              >
                {featuredCover ? (
                  <Image
                    src={featuredCover}
                    alt={`Imagem da matéria: ${featured.title}`}
                    width={1200}
                    height={800}
                    priority
                    className="aspect-[3/2] h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                ) : (
                  <ImagePlaceholder
                    label="Imagem em breve"
                    className="aspect-[3/2] h-full w-full !rounded-none !border-0"
                  />
                )}
              </Link>
              <div className="flex flex-col justify-center p-8 lg:p-14">
                <p className="flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-forest">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
                  Leitura em destaque · {featured.category}
                </p>
                <h2 className="mb-4 mt-4 text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] leading-[1.18]">
                  {featured.title}
                </h2>
                <p className="max-w-md text-[16px] leading-relaxed text-body">
                  {featured.excerpt}
                </p>
                <p className="mt-3 text-[13px] text-muted">
                  {formatDate(featured.published_at)}
                </p>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="btn btn-primary mt-7 self-start"
                >
                  Ler matéria <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          </Reveal>
        </section>
      )}

      <section className={`${container} pb-24`}>
        <T k="equo.all.title" as="h2" className="mb-10 text-[1.9rem]" />
        {posts.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 90} className="h-full">
                <PostCard post={post} fallbackCover={fallbackCover} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-[15px] text-muted">
            Em breve, novas matérias por aqui.
          </p>
        )}
      </section>
    </div>
  );
}
