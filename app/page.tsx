import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import PostCard from "@/components/PostCard";
import SitePhoto from "@/components/SitePhoto";
import { aboutPillars, conditions, homeFaqs, programs } from "@/lib/content";
import { getPublishedPosts } from "@/lib/posts";
import { getCenterInfo, getSiteImages } from "@/lib/public-data";
import { waLink } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const container = "mx-auto max-w-[1320px] px-6 md:px-12";

const steps = [
  {
    title: "Avaliação inicial",
    description:
      "Conversa com a família, análise de laudos e avaliação da equipe para entender necessidades e objetivos.",
  },
  {
    title: "Plano terapêutico",
    description:
      "Definição do programa, frequência das sessões e metas acompanhadas pela equipe multiprofissional.",
  },
  {
    title: "Sessões e acompanhamento",
    description:
      "Atendimentos com o cavalo, registros de evolução e devolutivas periódicas para a família.",
  },
];

export default async function Home() {
  const [allPosts, center, images] = await Promise.all([
    getPublishedPosts(),
    getCenterInfo(),
    getSiteImages(),
  ]);
  const posts = allPosts.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section
        className={`${container} grid items-center gap-12 pb-16 pt-12 md:pt-[72px] lg:grid-cols-[1fr_1.05fr]`}
      >
        <div>
          <p className="eyebrow">Centro de Equoterapia GF</p>
          <h1 className="my-6">
            Equoterapia que respeita cada pessoa,{" "}
            <em>seu tempo e seu desenvolvimento.</em>
          </h1>
          <p className="max-w-[490px] text-[17px]">
            No Centro de Equoterapia GF, o cavalo é parte de uma abordagem
            terapêutica individualizada, conduzida por uma equipe preparada
            para acompanhar cada praticante com cuidado, segurança e
            acolhimento.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/equoterapia" className="btn btn-primary">
              Saiba mais <span aria-hidden>↗</span>
            </Link>
            <a
              href={waLink(center, "Olá! Gostaria de agendar uma avaliação.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Agendar avaliação
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <li>Equipe multiprofissional</li>
            <li>Método reconhecido pela Lei 13.830/2019</li>
            <li>Todas as idades</li>
          </ul>
        </div>

        <figure className="relative">
          {/* Moldura areia atrás da foto, como o painel bege do uniforme */}
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

      {/* Sobre o GF */}
      <section className={`${container} pb-16 pt-9`}>
        <p className="eyebrow">Sobre o GF</p>
        <h2 className="mb-9 mt-3 max-w-[720px]">
          Um espaço onde o cuidado acontece <em>a passo de cavalo.</em>
        </h2>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {aboutPillars.map((pillar, index) => (
            <div key={pillar.title} className="border-t-2 border-sand pt-[22px]">
              <span className="text-[13px] font-bold text-forest">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-2.5 mt-3.5">{pillar.title}</h3>
              <p className="text-[15px]">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* O que é equoterapia */}
      <section className={`${container} pb-16 pt-9`}>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">O que é equoterapia</p>
            <h2 className="mb-5 mt-3 text-[2rem] leading-[1.2]">
              Um método terapêutico que usa o movimento do cavalo a favor do
              desenvolvimento
            </h2>
            <p className="max-w-lg text-[15px]">
              Ao passo, o cavalo produz um movimento tridimensional — para
              frente e para os lados, para cima e para baixo — semelhante ao da
              marcha humana. Esse estímulo trabalha equilíbrio, postura e
              coordenação.
            </p>
            <p className="mt-4 max-w-lg text-[15px]">
              Ao mesmo tempo, o vínculo com o animal e o ambiente ao ar livre
              favorecem atenção, comunicação, autoconfiança e socialização.
            </p>
            <Link href="/equoterapia" className="link-arrow mt-6">
              Saiba mais sobre a equoterapia ↗
            </Link>
          </div>
          <div>
            <p className="eyebrow">Como funciona</p>
            <div className="mt-6 flex flex-col">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="grid grid-cols-[2rem_1fr] gap-3 border-t border-rule-strong py-5"
                >
                  <span className="pt-1 text-[13px] font-bold text-forest">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-[1.15rem]">{step.title}</h3>
                    <p className="mt-1.5 text-[15px]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Condições tratadas */}
      <section className="bg-sage-soft">
        <div className={`${container} py-16`}>
          <p className="eyebrow">Condições tratadas</p>
          <div className="mb-9 mt-3 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-[720px]">
              Para quem a equoterapia <em>pode ser indicada</em>
            </h2>
            <Link href="/condicoes" className="link-arrow">
              Ver todas as condições ↗
            </Link>
          </div>
          <div className="grid gap-x-7 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {conditions.map((condition) => (
              <div
                key={condition.slug}
                className="border-t-2 border-sage pt-[22px]"
              >
                <span className="text-xs font-bold uppercase tracking-[1.5px] text-forest">
                  {condition.cid}
                </span>
                <h3 className="mb-2 mt-3">{condition.title}</h3>
                <p className="text-[15px]">{condition.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-[13px]">
            A indicação depende sempre de avaliação médica e da equipe. Cada
            condição terá página própria, com conteúdo aprofundado.
          </p>
        </div>
      </section>

      {/* Programas */}
      <section className="on-dark bg-forest-deep text-white">
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
            Seguimos a classificação de programas adotada pela ANDE-Brasil.
          </p>
        </div>
      </section>

      {/* Matérias */}
      <section className={`${container} pb-20 pt-[42px]`}>
        <div className="mb-[30px] mt-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[2.4rem]">
            Tudo sobre <em>EQUOTERAPIA</em>
          </h2>
          <Link href="/blog" className="link-arrow">
            Ver todas as matérias ↗
          </Link>
        </div>
        <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              fallbackCover={images.materia_padrao.url}
            />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-rule">
        <div className={`${container} py-16`}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: homeFaqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
              }),
            }}
          />
          <div>
            <p className="eyebrow">Perguntas frequentes</p>
            <div className="mb-9 mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2>
                Dúvidas comuns de quem <em>está começando</em>
              </h2>
              <a
                href={waLink(center, "Olá! Tenho uma dúvida sobre a equoterapia.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                Falar no WhatsApp
              </a>
            </div>
            <div className="max-w-4xl">
              <FaqAccordion items={homeFaqs} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-sand">
        <div
          className={`${container} flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center`}
        >
          <div>
            <p className="tagline !text-forest text-[1.5rem] leading-none">
              Cuidando de Vidas
            </p>
            <h2 className="mt-3 max-w-lg">
              Vamos conversar sobre o <em>próximo passo?</em>
            </h2>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <a
              href={waLink(center, "Olá! Gostaria de agendar uma avaliação.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Agendar avaliação
            </a>
            <Link href="/contato" className="btn btn-outline">
              Contato
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
