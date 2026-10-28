import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
import WaveTop from "@/components/Wave";
import T from "@/components/editor/T";
import { formatDateShort } from "@/lib/format";
import { getFeaturedPost, getPublishedPosts, visibleCategory } from "@/lib/posts";
import { getSiteImages } from "@/lib/public-data";
import { displayTags, tagKey } from "@/lib/tags";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Equoterapia",
  description:
    "Equoterapia: conhecimento, ciência e cuidado. Conteúdos sobre fundamentos, o papel do cavalo, a atuação interdisciplinar e temas ligados à saúde e ao bem-estar.",
};

const container = "mx-auto max-w-[1160px] px-6 md:px-10";

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function EquoterapiaPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const [allPosts, featuredPost, images] = await Promise.all([
    getPublishedPosts(),
    getFeaturedPost(),
    getSiteImages(),
  ]);

  // Filtro por tag (?tag=...): mostra só as matérias com essa tag.
  const activeKey = tag ? tagKey(tag) : "";
  const posts = activeKey
    ? allPosts.filter((post) => (post.tags ?? []).some((t) => tagKey(t) === activeKey))
    : allPosts;
  const activeLabel = activeKey
    ? (allPosts.flatMap((post) => post.tags ?? []).find((t) => tagKey(t) === activeKey) ??
      tag ??
      "")
    : "";
  const featured = activeKey ? null : featuredPost;

  const fallbackCover = images.materia_padrao.url;
  const featuredCover = featured?.cover_image || fallbackCover;
  const featuredChips = featured
    ? [visibleCategory(featured), ...displayTags(featured.tags, 2)].filter(Boolean).slice(0, 2)
    : [];

  return (
    <div>
      <section className="hero-bg relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-36 -top-44 h-[480px] w-[480px] rounded-full bg-[#f8e2bb]/75 max-md:h-72 max-md:w-72" />
        <div aria-hidden className="pointer-events-none absolute -left-20 bottom-4 h-40 w-40 rounded-full bg-sage-soft" />
        <div aria-hidden className="pointer-events-none absolute right-[34%] top-20 hidden h-14 w-14 rounded-full bg-coral-soft md:block" />
        <div aria-hidden className="pointer-events-none absolute bottom-12 right-[12%] h-[22px] w-[22px] rounded-full bg-sun" />
        <div className={`${container} relative flex flex-col items-start pb-12 pt-14 md:pt-20`}>
          <T k="equo.eyebrow" as="p" className="eyebrow eyebrow-pill pill-horse anim-rise" />
          <T
            k="equo.title"
            as="h1"
            className="hero-title anim-rise my-6 max-w-3xl [animation-delay:.08s]"
          />
          <T
            k="equo.intro"
            as="p"
            className="lead anim-rise max-w-3xl [animation-delay:.16s]"
          />
          {activeKey && (
            <p className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-muted">Mostrando matérias com a tag</span>
              <span className="tag-chip">{activeLabel}</span>
              <Link href="/equoterapia" className="link-arrow">
                Ver todas
              </Link>
            </p>
          )}
        </div>
      </section>

      {featured && (
        <section className={`${container} pb-16 pt-4`}>
          <Reveal>
            <article className="grid overflow-hidden rounded-[28px] border-b-[7px] border-sun bg-white shadow-[0_30px_46px_-34px_rgb(0_2_89/0.55)] lg:grid-cols-[1.1fr_1fr]">
              <Link
                href={`/blog/${featured.slug}`}
                aria-label={featured.title}
                className="relative block overflow-hidden"
              >
                {featuredCover ? (
                  <Image
                    src={featuredCover}
                    alt={`Imagem da matéria: ${featured.title}`}
                    width={1200}
                    height={800}
                    priority
                    className="aspect-[3/2] h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  />
                ) : (
                  <ImagePlaceholder
                    label="Imagem em breve"
                    className="aspect-[3/2] h-full w-full !rounded-none !border-0"
                  />
                )}
                {featured.published_at && (
                  <span className="pc-date tone-0">{formatDateShort(featured.published_at)}</span>
                )}
              </Link>
              <div className="flex flex-col justify-center gap-4 p-8 lg:p-14">
                <p className="inline-flex items-center gap-2 self-start rounded-full bg-coral-soft px-3.5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-coral-ink">
                  <span aria-hidden className="shoe-mark h-4 w-4" />
                  Leitura em destaque
                </p>
                {featuredChips.length > 0 && (
                  <p className="pc-tags tone-2">
                    {featuredChips.map((chip) => (
                      <span key={chip}>{chip}</span>
                    ))}
                  </p>
                )}
                <h2 className="text-[clamp(1.6rem,1.2rem+1.4vw,2.2rem)] leading-[1.18]">
                  {featured.title}
                </h2>
                <p className="max-w-md text-[16.5px] leading-relaxed text-body">
                  {featured.excerpt}
                </p>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="btn btn-primary mt-3 self-start"
                >
                  Ler matéria <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          </Reveal>
        </section>
      )}

      <section className="know-bg relative overflow-hidden">
        <WaveTop />
        <div aria-hidden className="pointer-events-none absolute -left-24 top-28 h-[300px] w-[300px] rounded-full bg-coral-soft/80" />
        <div aria-hidden className="pointer-events-none absolute -right-12 bottom-24 h-[200px] w-[200px] rounded-full bg-sage-soft" />
        <div className={`${container} relative pb-24 pt-[clamp(80px,9vw,120px)]`}>
          <T k="equo.all.title" as="h2" className="mb-10 text-[clamp(1.9rem,1.4rem+1.6vw,2.6rem)]" />
          {posts.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={(index % 3) * 90} className="h-full">
                  <PostCard post={post} tone={index} fallbackCover={fallbackCover} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-[15px] text-muted">
              {activeKey
                ? "Ainda não há matérias com essa tag."
                : "Em breve, novas matérias por aqui."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
