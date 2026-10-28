import type { Metadata } from "next";
import KnowledgeBand from "@/components/KnowledgeBand";
import Pillars from "@/components/Pillars";
import Trail from "@/components/Trail";
import EditablePhoto from "@/components/editor/EditablePhoto";
import T from "@/components/editor/T";
import { getSiteImages } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Conheça o Centro de Equoterapia GF: equipe interdisciplinar, atendimento individualizado, cavalos preparados e um ambiente acolhedor.",
};

const container = "mx-auto max-w-[1160px] px-6 md:px-10";

export default async function SobrePage() {
  const images = await getSiteImages();

  return (
    <div>
      <section className="hero-bg relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -left-36 -top-44 h-[480px] w-[480px] rounded-full bg-sage-soft max-md:h-72 max-md:w-72" />
        <div aria-hidden className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#f8e2bb]/75 max-md:hidden" />
        <div aria-hidden className="pointer-events-none absolute right-[18%] top-24 hidden h-14 w-14 rounded-full bg-coral-soft md:block" />
        <div aria-hidden className="pointer-events-none absolute bottom-10 right-[30%] h-[22px] w-[22px] rounded-full bg-sun" />
        <div className={`${container} relative flex flex-col items-start pb-14 pt-14 md:pt-20`}>
          <T k="sobre.eyebrow" as="p" className="eyebrow eyebrow-pill pill-stable anim-rise" />
          <T
            k="about.title"
            as="h1"
            className="anim-rise my-6 max-w-3xl [animation-delay:.08s]"
          />
          <T
            k="about.text"
            as="p"
            className="lead anim-rise max-w-3xl [animation-delay:.16s]"
          />
        </div>
      </section>

      <section
        className={`${container} grid items-start gap-14 pb-20 pt-8 lg:grid-cols-2 lg:gap-24`}
      >
        <figure className="photo-frame lg:sticky lg:top-36">
          <EditablePhoto
            imageKey="sobre"
            image={images.sobre}
            showCaption={false}
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-[600/480] w-full rounded-none"
          />
        </figure>
        <Pillars />
      </section>

      <div className="pb-14">
        <Trail />
      </div>

      <KnowledgeBand />
    </div>
  );
}
