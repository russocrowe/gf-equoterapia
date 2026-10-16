import Link from "next/link";
import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import EditablePhoto from "@/components/editor/EditablePhoto";
import T from "@/components/editor/T";
import { getSiteImages } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Um olhar atento, um cuidado por inteiro: conheça o que orienta o cuidado no Centro de Equoterapia GF.",
};

const container = "mx-auto max-w-[1240px] px-6 md:px-10";

const principles = [1, 2, 3] as const;

export default async function SobrePage() {
  const images = await getSiteImages();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-48 h-[30rem] w-[30rem] rounded-full bg-sage-soft blur-3xl"
        />
        <div className={`${container} relative pb-12 pt-14 md:pt-20`}>
          <T k="sobre.eyebrow" as="p" className="eyebrow" />
          <T k="sobre.title" as="h1" className="my-6 max-w-3xl" />
          <T k="sobre.intro" as="p" className="lead max-w-2xl" />
        </div>
      </section>

      <section
        className={`${container} grid items-start gap-14 pb-20 pt-6 lg:grid-cols-2 lg:gap-16`}
      >
        <figure className="relative">
          <div
            aria-hidden
            className="absolute -bottom-4 -left-4 h-full w-full rounded-2xl bg-sage-soft md:-bottom-5 md:-left-5"
          />
          <EditablePhoto
            imageKey="sobre"
            image={images.sobre}
            sizes="(min-width: 1024px) 600px, 100vw"
            className="relative aspect-[600/480] w-full rounded-2xl shadow-[0_30px_60px_-30px_rgb(0_2_89/0.4)]"
          />
        </figure>

        <div className="lg:pt-4">
          <T k="sobre.principles.title" as="h2" className="mb-8 text-[1.9rem]" />
          <ol className="flex flex-col">
            {principles.map((n) => (
              <li
                key={n}
                className="grid grid-cols-[2.75rem_1fr] gap-4 border-t border-rule py-6 first:border-t-2 first:border-gold"
              >
                <span
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft font-display text-sm font-bold text-forest"
                >
                  {String(n).padStart(2, "0")}
                </span>
                <div>
                  <T k={`sobre.principle.${n}.title`} as="h3" className="text-[1.15rem]" />
                  <T
                    k={`sobre.principle.${n}.text`}
                    as="p"
                    className="mt-2 text-[15px] leading-relaxed text-muted"
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${container} pb-24`}>
        <Reveal>
          <div className="on-dark relative grid items-center gap-8 overflow-hidden rounded-3xl bg-navy p-8 text-white md:grid-cols-2 md:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-2xl"
            />
            <T k="sobre.band.title" as="h2" className="relative max-w-sm" />
            <div className="relative">
              <T
                k="sobre.band.text"
                as="p"
                className="max-w-md text-[16px] leading-relaxed text-white/90"
              />
              <Link
                href="/equoterapia"
                className="mt-6 inline-block border-b-2 border-gold pb-1 text-[15px] font-semibold text-white hover:border-white"
              >
                <T k="sobre.band.link" /> <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
