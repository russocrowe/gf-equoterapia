import Link from "next/link";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
import EditablePhoto from "@/components/editor/EditablePhoto";
import T from "@/components/editor/T";
import { getPublishedPosts } from "@/lib/posts";
import { getSiteImages } from "@/lib/public-data";

export const dynamic = "force-dynamic";

const container = "mx-auto max-w-[1240px] px-6 md:px-10";

const pillars = [1, 2, 3, 4] as const;
const trust = [1, 2, 3] as const;

function Check() {
  return (
    <span
      aria-hidden
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-white"
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6.2 5 8.6l4.5-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default async function Home() {
  const [allPosts, images] = await Promise.all([
    getPublishedPosts(),
    getSiteImages(),
  ]);
  const posts = allPosts.slice(0, 3);

  return (
    <div>
      {/* Abertura */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-sand-soft blur-3xl"
        />
        <div
          className={`${container} relative grid items-center gap-14 pb-20 pt-12 md:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16`}
        >
          <div>
            <T k="home.hero.eyebrow" as="p" className="eyebrow" />
            <T k="home.hero.title" as="h1" className="my-6" />
            <T k="home.hero.text" as="p" className="lead max-w-[520px]" />
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/equoterapia" className="btn btn-primary">
                <T k="home.hero.cta" />
                <span aria-hidden>→</span>
              </Link>
            </div>
            <ul className="mt-10 flex flex-col gap-3 text-[15px] font-medium text-body">
              {trust.map((n) => (
                <li key={n} className="flex items-center gap-3">
                  <Check />
                  <T k={`home.trust.${n}`} />
                </li>
              ))}
            </ul>
          </div>

          <figure className="relative">
            {/* Moldura areia atrás da foto, como o painel bege do uniforme */}
            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 h-full w-full rounded-[80px_16px_16px_16px] bg-sand md:-bottom-5 md:-right-5 md:rounded-[150px_16px_16px_16px]"
            />
            <EditablePhoto
              imageKey="hero"
              image={images.hero}
              priority
              sizes="(min-width: 1024px) 640px, 100vw"
              className="relative aspect-[600/520] w-full rounded-[80px_16px_16px_16px] shadow-[0_30px_60px_-30px_rgb(0_2_89/0.45)] md:rounded-[150px_16px_16px_16px]"
            />
          </figure>
        </div>
      </section>

      {/* Sobre o GF */}
      <section className="border-y border-rule bg-surface">
        <div className={`${container} py-20 md:py-24`}>
          <Reveal>
            <T k="home.about.eyebrow" as="p" className="eyebrow" />
            <T k="home.about.title" as="h2" className="mt-4 max-w-[760px]" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((n, index) => (
              <Reveal key={n} delay={index * 80} className="h-full">
                <div className="card h-full bg-paper p-7">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft font-display text-sm font-bold text-forest"
                  >
                    {String(n).padStart(2, "0")}
                  </span>
                  <T
                    k={`home.pillar.${n}.title`}
                    as="h3"
                    className="mb-3 mt-6"
                  />
                  <T
                    k={`home.pillar.${n}.text`}
                    as="p"
                    className="text-[15px] leading-relaxed text-muted"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Matérias */}
      <section className={`${container} py-20 md:py-24`}>
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <T k="home.posts.title" as="h2" />
          <Link href="/equoterapia" className="link-arrow">
            <T k="home.posts.link" /> <span aria-hidden>→</span>
          </Link>
        </Reveal>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.id} delay={index * 90} className="h-full">
              <PostCard post={post} fallbackCover={images.materia_padrao.url} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
