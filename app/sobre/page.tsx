import Link from "next/link";
import type { Metadata } from "next";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SitePhoto from "@/components/SitePhoto";
import { getCenterInfo, getSiteImages } from "@/lib/public-data";
import { waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Um olhar atento, um cuidado por inteiro: conheça os princípios, a equipe e a estrutura do Centro de Equoterapia GF.",
};

const container = "mx-auto max-w-[1320px] px-6 md:px-12";

const principles = [
  {
    title: "A criança no centro",
    description:
      "Olhar para além das expectativas e reconhecer a singularidade, as preferências e os limites de cada criança.",
  },
  {
    title: "Diálogo com a família",
    description:
      "Valorizar quem está presente no dia a dia e abrir espaço para perguntas, escuta e troca de experiências.",
  },
  {
    title: "Respeito em cada encontro",
    description:
      "Cuidar da relação com as pessoas, com os cavalos e com o ambiente, com atenção e responsabilidade.",
  },
];

const values = [
  {
    title: "Missão",
    description:
      "Promover desenvolvimento, autonomia e qualidade de vida por meio da equoterapia, com acolhimento às famílias. [ajustar]",
  },
  {
    title: "Visão",
    description:
      "[Ser referência regional em equoterapia, reconhecida pela seriedade técnica e pelo cuidado humano.]",
  },
  {
    title: "Valores",
    description:
      "Acolhimento · Ética · Respeito ao tempo de cada praticante · Bem-estar animal · Atualização científica",
  },
];

const team = [
  { role: "Fisioterapeuta", registry: "CREFITO [nº]" },
  { role: "Psicóloga", registry: "CRP [nº]" },
  { role: "Fonoaudióloga", registry: "CRFa [nº]" },
  { role: "Equitador", registry: "Formação ANDE-Brasil [confirmar]" },
];

const badges = [
  { title: "Filiação ANDE-Brasil", description: "[confirmar status e nº]" },
  {
    title: "Lei nº 13.830/2019",
    description: "Reconhece a equoterapia como método de reabilitação",
  },
  {
    title: "Atendimento a todas as idades",
    description: "Crianças, jovens, adultos e idosos",
  },
];

export default async function SobrePage() {
  const [center, images] = await Promise.all([
    getCenterInfo(),
    getSiteImages(),
  ]);

  return (
    <div>
      <section className={`${container} pb-10 pt-12 md:pt-[72px]`}>
        <p className="eyebrow">Sobre a GF Equoterapia</p>
        <h1 className="my-6">
          Um olhar atento.
          <br />
          Um cuidado <em>por inteiro.</em>
        </h1>
        <p className="max-w-2xl text-[17px]">
          Acreditamos que acolher começa por conhecer a pessoa, respeitar sua
          história e construir uma relação de confiança com sua família.
        </p>
      </section>

      <section className={`${container} grid items-start gap-12 pb-16 pt-6 lg:grid-cols-2`}>
        <figure className="relative">
          <div
            aria-hidden
            className="absolute -bottom-3 -left-3 h-full w-full rounded-xl bg-sage-soft md:-bottom-4 md:-left-4"
          />
          <SitePhoto
            image={images.sobre}
            sizes="(min-width: 1024px) 640px, 100vw"
            className="relative aspect-[600/480] w-full rounded-xl"
          />
          {images.sobre.caption && (
            <figcaption className="photo-note !mt-6">
              {images.sobre.caption}
            </figcaption>
          )}
        </figure>
        <div>
          <h2 className="mb-6 text-[1.9rem]">O que orienta nosso cuidado</h2>
          <div className="flex flex-col">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="border-t-2 border-sand py-5"
              >
                <h3 className="text-[1.1rem]">{principle.title}</h3>
                <p className="mt-1.5 text-[15px]">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="on-dark bg-forest-deep text-white">
        <div className={`${container} py-16`}>
          <p className="eyebrow">O que nos move</p>
          <div className="mt-8 grid gap-7 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="border-t-2 border-gold pt-[22px]"
              >
                <h3 className="mb-2.5">{value.title}</h3>
                <p className="text-[15px] text-white/85">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${container} py-16`}>
        <p className="eyebrow">Nossa história</p>
        <div className="mt-6 max-w-2xl text-[15px]">
          <p>
            [História do Centro de Equoterapia GF: origem, fundadores, o
            significado de &quot;GF&quot; e o propósito que orienta o trabalho
            da equipe.]
          </p>
          <p className="mt-4">
            [Onde o centro fica, desde quando atende e qual público recebe.]
          </p>
        </div>
      </section>

      <section id="equipe" className={`${container} pb-16`}>
        <p className="eyebrow">Equipe</p>
        <div className="mb-9 mt-3 flex flex-wrap items-end justify-between gap-6">
          <h2>
            Uma equipe <em>multiprofissional</em>
          </h2>
          <p className="max-w-sm text-[15px]">
            Na equoterapia, saúde, educação e equitação trabalham juntas.
          </p>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.role}>
              <ImagePlaceholder
                label="Foto do profissional"
                className="aspect-square w-full"
              />
              <p className="mt-4 text-[15px] font-medium">[Nome]</p>
              <p className="text-[15px]">{member.role}</p>
              <p className="text-[13px]">{member.registry}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="estrutura" className={`${container} pb-16`}>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Estrutura e cavalos</p>
            <h2 className="mb-5 mt-3 text-[2rem] leading-[1.2]">
              Nossos cavalos também são <em>parte da equipe</em>
            </h2>
            <p className="max-w-lg text-[15px]">
              [Como os cavalos são escolhidos (temperamento, andadura),
              treinados e cuidados: rotina, alimentação, descanso e
              acompanhamento veterinário.]
            </p>
            <p className="mt-4 max-w-lg text-[15px]">
              [Estrutura: picadeiro, rampa de acesso, área coberta, sala de
              espera para as famílias.]
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index}>
                <ImagePlaceholder
                  label="Foto do cavalo"
                  className="aspect-square w-full"
                />
                <p className="mt-2 text-[13px]">[Nome do cavalo]</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="border-t-2 border-sage pt-5"
            >
              <p className="font-display text-[1.05rem] font-medium tracking-[-0.02em]">
                {badge.title}
              </p>
              <p className="mt-1 text-[14px]">{badge.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className={`${container} py-16`}>
          <p className="tagline !text-forest text-[1.5rem] leading-none">
            Cuidando de Vidas
          </p>
          <h2 className="mt-3 max-w-xl">
            Conhecimento também <em>é uma forma de cuidar.</em>
          </h2>
          <p className="mb-8 mt-5 max-w-lg text-[15px]">
            Nossas matérias reúnem reflexões sobre acolhimento, família e
            vínculos para tornar essa conversa mais próxima e acessível.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/blog" className="btn btn-primary">
              Explore as matérias de Equoterapia <span aria-hidden>↗</span>
            </Link>
            <a
              href={waLink(center, "Olá! Gostaria de conhecer o centro.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Agendar visita
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
