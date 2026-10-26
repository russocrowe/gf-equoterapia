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

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

// Equipe
function TeamIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5c.4-3 2.7-5 5.5-5s5.1 2 5.5 5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16.2 14.4c2.5-.3 4.4 1.3 4.8 4.1" />
    </svg>
  );
}

// Balança: método reconhecido por lei
function LawIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 4v16M7.5 20h9M5 7h14" />
      <path d="M5 7 2 14a3 3 0 0 0 6 0L5 7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7z" />
    </svg>
  );
}

// Coração na mão: cuidado individualizado
function CareIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 12.6c-3.1-1.8-4.7-3.7-4.7-5.5a2.5 2.5 0 0 1 4.7-1.1 2.5 2.5 0 0 1 4.7 1.1c0 1.8-1.6 3.7-4.7 5.5z" />
      <path d="M2.5 15.5h3l3.2 1.8h4.3a1.3 1.3 0 0 1 0 2.6H9.6M12.6 19.6l5.4-2.2a1.5 1.5 0 0 1 1.6 2.5L15.5 22h-7L6 20.5H2.5" />
    </svg>
  );
}

const trust = [
  { n: 1, Icon: TeamIcon },
  { n: 2, Icon: LawIcon },
  { n: 3, Icon: CareIcon },
] as const;

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
          className={`${container} relative grid items-center gap-14 pb-14 pt-12 md:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16`}
        >
          <div>
            <T k="home.hero.eyebrow" as="p" className="eyebrow" />
            <T k="home.hero.headline" as="h1" className="my-6" />
            <T k="home.hero.text" as="p" className="lead max-w-[540px]" />
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/equoterapia" className="btn btn-primary">
                <T k="home.hero.cta" />
                <span aria-hidden>→</span>
              </Link>
            </div>
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

        {/* Selos de confiança, logo abaixo da abertura */}
        <div className={`${container} relative pb-20`}>
          <ul className="grid overflow-hidden rounded-2xl border border-rule bg-surface shadow-[var(--shadow-md)] sm:grid-cols-3">
            {trust.map(({ n, Icon }) => (
              <li
                key={n}
                className="flex flex-col items-center gap-3 border-t border-rule px-6 py-6 text-center first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-soft text-forest">
                  <Icon />
                </span>
                <T
                  k={`home.trust.${n}`}
                  as="p"
                  className="max-w-[16rem] text-[15px] font-semibold leading-snug text-navy"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sobre o GF */}
      <section className="border-y border-rule bg-surface">
        <div
          className={`${container} grid items-center gap-12 py-20 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16`}
        >
          <figure className="relative">
            <div
              aria-hidden
              className="absolute -bottom-4 -left-4 h-full w-full rounded-2xl bg-sage-soft md:-bottom-5 md:-left-5"
            />
            <EditablePhoto
              imageKey="espaco"
              image={images.espaco}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="relative aspect-[4/3] w-full rounded-2xl shadow-[0_30px_60px_-30px_rgb(0_2_89/0.4)] lg:aspect-[4/5]"
            />
          </figure>

          <Reveal>
            <T k="home.about.eyebrow" as="p" className="eyebrow" />
            <T k="about.title" as="h2" className="mt-4 max-w-[640px]" />
            <T
              k="about.text"
              as="p"
              className="mt-5 max-w-[620px] text-[16px] leading-relaxed text-body"
            />
            <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {pillars.map((n) => (
                <li key={n} className="border-t-2 border-gold/70 pt-4">
                  <span
                    aria-hidden
                    className="font-display text-sm font-bold tracking-wide text-forest"
                  >
                    {String(n).padStart(2, "0")}
                  </span>
                  <T
                    k={`about.pillar.${n}.title`}
                    as="h3"
                    className="mb-2 mt-2 text-[1.1rem]"
                  />
                  <T
                    k={`about.pillar.${n}.text`}
                    as="p"
                    className="text-[15px] leading-relaxed text-muted"
                  />
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Matérias */}
      <section className={`${container} py-20 md:py-24`}>
        <Reveal className="mb-12 max-w-[760px]">
          <T k="home.posts.title" as="h2" />
          <T
            k="home.posts.text"
            as="p"
            className="mt-5 text-[16px] leading-relaxed text-body"
          />
        </Reveal>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.id} delay={index * 90} className="h-full">
              <PostCard post={post} fallbackCover={images.materia_padrao.url} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/equoterapia" className="btn btn-primary">
            <T k="home.posts.link" />
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
