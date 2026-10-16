import Link from "next/link";
import type { Metadata } from "next";
import SitePhoto from "@/components/SitePhoto";
import { programs } from "@/lib/content";
import { getCenterInfo, getSiteImages } from "@/lib/public-data";
import { waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Equoterapia",
  description:
    "O que é a equoterapia, como funciona, os programas seguidos pela classificação ANDE-Brasil e os benefícios do método.",
};

const container = "mx-auto max-w-[1320px] px-6 md:px-12";

const benefits = [
  "Equilíbrio, postura e coordenação motora",
  "Tônus muscular e controle corporal",
  "Atenção, comunicação e linguagem",
  "Autoconfiança, socialização e vínculo",
];

export default async function EquoterapiaPage() {
  const [center, images] = await Promise.all([
    getCenterInfo(),
    getSiteImages(),
  ]);

  return (
    <div>
      <section
        className={`${container} grid items-center gap-12 pb-16 pt-12 md:pt-[72px] lg:grid-cols-[1fr_1.05fr]`}
      >
        <div>
          <p className="eyebrow">Equoterapia</p>
          <h1 className="my-6">
            O movimento do cavalo a favor do <em>desenvolvimento.</em>
          </h1>
          <p className="max-w-[490px] text-[17px]">
            Ao passo, o cavalo produz um movimento tridimensional — semelhante
            ao da marcha humana — que estimula equilíbrio, postura e
            coordenação, enquanto o vínculo com o animal favorece comunicação,
            autoconfiança e socialização.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={waLink(center, "Olá! Gostaria de agendar uma avaliação.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Agendar avaliação
            </a>
            <Link href="/condicoes" className="btn btn-outline">
              Condições tratadas
            </Link>
          </div>
        </div>
        <figure className="relative">
          <div
            aria-hidden
            className="absolute -bottom-3 -right-3 h-full w-full rounded-[80px_12px_12px_12px] bg-sand md:-bottom-4 md:-right-4 md:rounded-[140px_12px_12px_12px]"
          />
          <SitePhoto
            image={images.hero}
            priority
            sizes="(min-width: 1024px) 640px, 100vw"
            className="relative aspect-[600/510] w-full rounded-[80px_12px_12px_12px] md:rounded-[140px_12px_12px_12px]"
          />
          {images.hero.caption && (
            <figcaption className="photo-note !mt-6">
              {images.hero.caption}
            </figcaption>
          )}
        </figure>
      </section>

      <section id="programas" className="on-dark bg-forest-deep text-white">
        <div className={`${container} py-16`}>
          <p className="eyebrow">Programas</p>
          <h2 className="mb-9 mt-3 max-w-[720px]">
            Quatro programas, de acordo com o momento de{" "}
            <em className="text-sand">cada praticante.</em>
          </h2>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program) => (
              <div
                key={program.number}
                className="border-t border-white/25 pt-[22px]"
              >
                <span className="text-[13px] font-bold text-gold">
                  {program.number}
                </span>
                <h3 className="mb-2.5 mt-3.5">{program.title}</h3>
                <p className="text-[15px] text-white/85">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[13px] text-white/75">
            Classificação de programas adotada pela ANDE-Brasil (Associação
            Nacional de Equoterapia).
          </p>
        </div>
      </section>

      <section id="beneficios" className={`${container} py-16`}>
        <p className="eyebrow">Benefícios</p>
        <h2 className="mb-9 mt-3 max-w-[720px]">
          O que a equoterapia <em>pode estimular</em>
        </h2>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={benefit}
              className="border-t-2 border-sand pt-[22px]"
            >
              <span className="text-[13px] font-bold text-forest">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3.5 font-display text-[1.15rem] font-medium leading-[1.3] tracking-[-0.02em]">
                {benefit}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-[13px]">
          A equoterapia é complementar e não substitui outros tratamentos. A
          indicação deve partir da avaliação médica e da equipe
          multiprofissional.
        </p>
      </section>

      <section className="bg-sand">
        <div
          className={`${container} flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center`}
        >
          <div>
            <p className="tagline !text-forest text-[1.5rem] leading-none">
              Cuidando de Vidas
            </p>
            <h2 className="mt-3 max-w-lg">
              Tem dúvidas sobre <em>como começar?</em>
            </h2>
          </div>
          <a
            href={waLink(center, "Olá! Gostaria de agendar uma avaliação.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary shrink-0"
          >
            Agendar avaliação
          </a>
        </div>
      </section>
    </div>
  );
}
