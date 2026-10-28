import Link from "next/link";
import KnowledgeBand from "@/components/KnowledgeBand";
import Pillars from "@/components/Pillars";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";
import Trail from "@/components/Trail";
import WaveTop from "@/components/Wave";
import PostCarousel from "@/components/blog/PostCarousel";
import EditablePhoto from "@/components/editor/EditablePhoto";
import T from "@/components/editor/T";
import { HorseMark, LawIcon, ShoeHeartIcon, TeamIcon } from "@/components/icons";
import { getPublishedPosts } from "@/lib/posts";
import { getSiteContent, getSiteImages } from "@/lib/public-data";
import { plainText } from "@/lib/rich-text";

export const dynamic = "force-dynamic";

const container = "mx-auto max-w-[1160px] px-6 md:px-10";

const trust = [
  { n: 1, Icon: TeamIcon, tone: "bg-sage-soft text-forest" },
  { n: 2, Icon: LawIcon, tone: "bg-butter text-butter-ink" },
  { n: 3, Icon: ShoeHeartIcon, tone: "bg-coral-soft text-coral-ink" },
] as const;

const CAROUSEL_SIZE = 6;

export default async function Home() {
  const [allPosts, images, content] = await Promise.all([
    getPublishedPosts(),
    getSiteImages(),
    getSiteContent(),
  ]);
  const posts = allPosts.slice(0, CAROUSEL_SIZE);

  return (
    <div>
      {/* Abertura */}
      <section className="hero-bg relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-36 -top-48 h-[560px] w-[560px] rounded-full bg-[#f8e2bb]/75 max-md:h-80 max-md:w-80" />
        <div aria-hidden className="pointer-events-none absolute -left-16 bottom-8 h-48 w-48 rounded-full bg-sage-soft" />
        <div aria-hidden className="pointer-events-none absolute right-[46%] top-16 hidden h-16 w-16 rounded-full bg-coral-soft md:block" />
        <div aria-hidden className="pointer-events-none absolute bottom-24 right-[8%] h-[26px] w-[26px] rounded-full bg-sun" />

        <div
          className={`${container} relative grid items-center gap-14 pb-14 pt-12 md:pt-20 lg:grid-cols-[1fr_1fr] lg:gap-16`}
        >
          <div className="flex flex-col items-start">
            <T k="home.hero.eyebrow" as="p" className="eyebrow eyebrow-pill pill-shoe anim-rise" />
            <T
              k="home.hero.headline"
              as="h1"
              className="hero-title anim-rise my-6 [animation-delay:.08s]"
            />
            <T
              k="home.hero.text"
              as="p"
              className="lead anim-rise max-w-[540px] [animation-delay:.16s]"
            />
            <div className="anim-rise mt-9 flex flex-wrap items-center gap-7 [animation-delay:.24s]">
              <Link href="/sobre" className="btn btn-primary">
                <T k="home.hero.cta" />
                <span aria-hidden>→</span>
              </Link>
              <Link href="/equoterapia" className="link-arrow">
                <T k="home.hero.cta2" />
              </Link>
            </div>
          </div>

          <figure className="arch-frame anim-rise [animation-delay:.12s]">
            <EditablePhoto
              imageKey="hero"
              image={images.hero}
              priority
              showCaption={false}
              sizes="(min-width: 1024px) 510px, 100vw"
              className="relative aspect-[4/5] w-full rounded-[999px_999px_26px_26px]"
            />
            <div className="anim-float absolute -left-7 bottom-9 z-[2] flex max-w-[280px] items-center gap-3.5 rounded-2xl border border-rule bg-white py-3.5 pl-3.5 pr-[18px] shadow-[0_18px_34px_-20px_rgb(0_2_89/0.45)] max-md:left-2">
              <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-coral-soft text-coral-ink">
                <LawIcon className="h-6 w-6" />
              </span>
              <span className="font-display text-[12.5px] font-semibold leading-snug text-navy">
                {plainText(content["home.trust.2"])}
              </span>
            </div>
          </figure>
        </div>

        {/* Selos de confiança, logo abaixo da abertura */}
        <div className={`${container} relative pb-16`}>
          <ul className="grid overflow-hidden rounded-2xl border border-rule bg-white shadow-[var(--shadow-md)] sm:grid-cols-3">
            {trust.map(({ n, Icon, tone }) => (
              <li
                key={n}
                className="chip-wiggle flex items-center gap-4 border-t border-rule px-6 py-6 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0"
              >
                <span
                  className={`flex h-[62px] w-[62px] flex-none items-center justify-center rounded-full ${tone}`}
                >
                  <Icon className="h-[34px] w-[34px]" />
                </span>
                <T
                  k={`home.trust.${n}`}
                  as="p"
                  className="font-display text-[13.5px] font-semibold leading-snug text-navy"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-4">
        <Trail />
      </div>

      {/* Sobre o GF */}
      <section id="sobre">
        <div
          className={`${container} grid items-start gap-12 py-20 md:py-28 lg:grid-cols-[.9fr_1.1fr] lg:gap-24`}
        >
          <div className="grid gap-5 lg:sticky lg:top-36">
            <T
              k="home.about.eyebrow"
              as="p"
              className="eyebrow eyebrow-pill pill-stable justify-self-start"
            />
            <T k="about.title" as="h2" className="max-w-[640px]" />
            <T
              k="about.text"
              as="p"
              className="max-w-[33rem] text-[16.5px] leading-relaxed text-body"
            />
            <figure className="photo-frame mt-4">
              <EditablePhoto
                imageKey="espaco"
                image={images.espaco}
                showCaption={false}
                sizes="(min-width: 1024px) 480px, 100vw"
                className="aspect-[4/3] w-full rounded-none"
              />
            </figure>
          </div>
          <Pillars />
        </div>
      </section>

      {/* Matérias */}
      <section id="blog" className="know-bg relative overflow-hidden">
        <WaveTop />
        <div aria-hidden className="pointer-events-none absolute -left-28 top-24 h-[340px] w-[340px] rounded-full bg-coral-soft/80" />
        <div aria-hidden className="pointer-events-none absolute -right-14 bottom-28 h-[220px] w-[220px] rounded-full bg-sage-soft" />
        <div aria-hidden className="pointer-events-none absolute right-[22%] top-32 h-[34px] w-[34px] rounded-full bg-sun" />
        <HorseMark className="pointer-events-none absolute right-[3%] top-[70px] hidden h-[300px] w-[420px] text-forest/[.07] md:block" />

        <div
          className={`${container} relative pb-[clamp(72px,8vw,110px)] pt-[clamp(96px,11vw,150px)]`}
        >
          {posts.length > 0 ? (
            <PostCarousel
              head={
                <>
                  <T
                    k="home.posts.eyebrow"
                    as="p"
                    className="eyebrow eyebrow-pill pill-horse pill-white justify-self-start"
                  />
                  <T
                    k="home.posts.title"
                    as="h2"
                    className="text-[clamp(2.1rem,1.4rem+2.6vw,3.3rem)]"
                  />
                  <T
                    k="home.posts.text"
                    as="p"
                    className="text-[17.5px] leading-relaxed text-body"
                  />
                </>
              }
              cta={
                <Link href="/equoterapia" className="btn btn-primary">
                  <T k="home.posts.link" />
                  <span aria-hidden>→</span>
                </Link>
              }
            >
              {posts.map((post, index) => (
                <div key={post.id} data-slide className="rail-slide">
                  <PostCard
                    post={post}
                    tone={index}
                    fallbackCover={images.materia_padrao.url}
                  />
                </div>
              ))}
            </PostCarousel>
          ) : (
            <Reveal>
              <T k="home.posts.title" as="h2" />
              <p className="mt-5 text-[16px] text-muted">Em breve, novas matérias por aqui.</p>
            </Reveal>
          )}
        </div>
      </section>

      <KnowledgeBand />
    </div>
  );
}
