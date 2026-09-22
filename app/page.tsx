import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import PostCard from "@/components/PostCard";
import FaqAccordion from "@/components/FaqAccordion";
import { getPublishedPosts } from "@/lib/posts";
import { programs, conditions, homeFaqs } from "@/lib/content";
import { siteConfig, waLink } from "@/lib/site-config";

export const dynamic = "force-dynamic";

const steps = [
  {
    number: "1",
    title: "Avaliação inicial",
    description:
      "Conversa com a família, análise de laudos e avaliação da equipe para entender necessidades e objetivos.",
  },
  {
    number: "2",
    title: "Plano terapêutico",
    description:
      "Definição do programa, frequência das sessões e metas acompanhadas pela equipe multiprofissional.",
  },
  {
    number: "3",
    title: "Sessões e acompanhamento",
    description:
      "Atendimentos com o cavalo, registros de evolução e devolutivas periódicas para a família.",
  },
];

const aboutBullets = [
  "Equipe com fisioterapia, psicologia, fonoaudiologia e equitação",
  "Cavalos selecionados, treinados e acompanhados por veterinário",
  "Estrutura acessível e segura para praticantes e famílias",
];

export default async function Home() {
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-14 pb-16 sm:grid-cols-2">
          <div>
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
              Equoterapia em {siteConfig.city}
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Desenvolvimento, autonomia e bem-estar{" "}
              <em className="italic text-azul">a passo de cavalo</em>
            </h1>
            <p className="mt-6 max-w-md text-base text-tinta/70">
              No {siteConfig.name}, o cavalo é parceiro de uma equipe de
              saúde e educação. Cada praticante recebe um plano terapêutico
              pensado para a sua história.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={waLink("Olá! Gostaria de agendar uma avaliação.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-azul px-6 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Agendar avaliação
              </a>
              <Link
                href="/equoterapia"
                className="inline-flex items-center gap-2 rounded-full border border-tinta/20 px-6 py-3 font-display text-sm font-semibold text-tinta transition-colors hover:border-azul hover:text-azul"
              >
                Entenda a equoterapia
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-tinta/60">
              <span>Equipe multiprofissional</span>
              <span>Método reconhecido pela Lei 13.830/2019</span>
              <span>Todas as idades</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-t-[999px] bg-marrom-claro/70" />
            <ImagePlaceholder
              label="Foto: praticante em sessão com o cavalo e terapeuta"
              className="aspect-[4/5] w-full"
            />
            <div className="absolute -bottom-6 left-4 max-w-[220px] rounded-xl bg-white px-4 py-3 text-xs shadow-md ring-1 ring-tinta/10 sm:left-6">
              Tire suas dúvidas
              <br />
              <a
                href={waLink("Olá! Tenho uma dúvida sobre a equoterapia.")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display font-semibold text-azul"
              >
                WhatsApp {siteConfig.whatsappDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* O que é equoterapia */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
          O que é equoterapia
        </span>
        <div className="mt-4 grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold leading-snug">
              Um método terapêutico que usa o movimento do cavalo a favor do
              desenvolvimento
            </h2>
            <p className="mt-4 text-sm text-tinta/70">
              Ao passo, o cavalo produz um movimento tridimensional — para
              frente e para os lados, para cima e para baixo — semelhante ao
              da marcha humana. Esse estímulo trabalha equilíbrio, postura e
              coordenação.
            </p>
            <p className="mt-4 text-sm text-tinta/70">
              Ao mesmo tempo, o vínculo com o animal e o ambiente ao ar livre
              favorecem atenção, comunicação, autoconfiança e socialização.
            </p>
            <Link
              href="/equoterapia"
              className="mt-4 inline-flex font-display text-sm font-semibold text-azul underline decoration-2 underline-offset-4"
            >
              Saiba mais sobre a equoterapia →
            </Link>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-tinta/60">
              Como funciona
            </h3>
            <div className="mt-4 flex flex-col gap-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-azul font-display text-sm font-semibold text-white">
                    {step.number}
                  </span>
                  <div>
                    <h4 className="font-display text-base font-semibold">
                      {step.title}
                    </h4>
                    <p className="mt-1 text-sm text-tinta/70">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Condições tratadas */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
          Condições tratadas
        </span>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-lg font-display text-3xl font-semibold leading-snug">
            Para quem a equoterapia pode ser indicada
          </h2>
          <p className="max-w-sm text-sm text-tinta/60">
            A indicação depende sempre de avaliação médica e da equipe. Cada
            condição terá página própria, com conteúdo aprofundado.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((condition) => (
            <div
              key={condition.slug}
              className="rounded-xl border border-tinta/10 bg-white p-5"
            >
              <span className="inline-block rounded-full bg-marrom-claro px-2.5 py-1 font-display text-[11px] font-semibold text-marrom">
                {condition.cid}
              </span>
              <h3 className="mt-3 font-display text-base font-semibold">
                {condition.title}
              </h3>
              <p className="mt-1 text-sm text-tinta/60">
                {condition.description}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/condicoes"
          className="mt-8 inline-flex font-display text-sm font-semibold text-azul underline decoration-2 underline-offset-4"
        >
          Ver todas as condições →
        </Link>
      </section>

      {/* Programas */}
      <section className="bg-azul-claro">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
            Programas
          </span>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-snug">
            Quatro programas, de acordo com o momento de cada praticante
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program) => (
              <div key={program.number} className="rounded-xl bg-white p-5">
                <span className="font-display text-2xl font-semibold text-azul-natural">
                  {program.number}
                </span>
                <h3 className="mt-2 font-display text-base font-semibold">
                  {program.title}
                </h3>
                <p className="mt-1 text-sm text-tinta/60">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-tinta/50">
            Seguimos a classificação de programas adotada pela ANDE-Brasil.
          </p>
        </div>
      </section>

      {/* Blog */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
              Blog
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              Conteúdo para famílias e profissionais
            </h2>
          </div>
          <Link
            href="/blog"
            className="font-display text-sm font-medium text-azul underline decoration-2 underline-offset-4"
          >
            Ver todos os artigos ↗
          </Link>
        </div>
        <div className="mt-8 flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Sobre o centro */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <ImagePlaceholder
              label="Foto: equipe"
              tone="marrom"
              className="col-span-2 aspect-[16/9]"
            />
            <ImagePlaceholder
              label="Foto: cavalos no pasto"
              tone="azul"
              className="aspect-square"
            />
            <ImagePlaceholder
              label="Foto: picadeiro / estrutura"
              tone="marrom"
              className="aspect-square"
            />
          </div>
          <div>
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
              Sobre o centro
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-snug">
              Um lugar pensado para acolher
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {aboutBullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm text-tinta/70">
                  <span className="mt-0.5 text-azul">✓</span>
                  {bullet}
                </li>
              ))}
            </ul>
            <Link
              href="/sobre"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-tinta/20 px-6 py-3 font-display text-sm font-semibold text-tinta transition-colors hover:border-azul hover:text-azul"
            >
              Conheça o centro →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: homeFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
        <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
          Perguntas frequentes
        </span>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold">
            Dúvidas comuns de quem está começando
          </h2>
          <a
            href={waLink("Olá! Tenho uma dúvida sobre a equoterapia.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Falar no WhatsApp
          </a>
        </div>
        <div className="mt-6">
          <FaqAccordion items={homeFaqs} />
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-azul-escuro">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 text-white sm:flex-row sm:items-center">
          <h2 className="max-w-lg font-display text-3xl font-semibold leading-snug">
            Vamos conversar sobre o próximo passo?
          </h2>
          <div className="flex shrink-0 flex-wrap gap-4">
            <a
              href={waLink("Olá! Gostaria de agendar uma avaliação.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display text-sm font-semibold text-azul-escuro transition-opacity hover:opacity-90"
            >
              Agendar avaliação
            </a>
            <a
              href={waLink("Olá! Gostaria de tirar uma dúvida.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 font-display text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
