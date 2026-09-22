import Link from "next/link";
import type { Metadata } from "next";
import ImagePlaceholder from "@/components/ImagePlaceholder";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Acreditamos que acolher começa por conhecer a pessoa, respeitar sua história e construir uma relação de confiança com sua família.",
};

const pillars = [
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

export default function SobrePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <span className="mb-4 inline-block border-t border-ink/40 pt-3 font-display text-xs font-semibold uppercase tracking-widest text-muted">
          Sobre a GF Equoterapia
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Um olhar atento.
          <br />
          Um cuidado por inteiro.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted">
          Acreditamos que acolher começa por conhecer a pessoa, respeitar sua
          história e construir uma relação de confiança com sua família.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <ImagePlaceholder
          label="Imagem ilustrativa"
          className="aspect-[16/9] w-full"
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold">
          O que orienta nosso cuidado
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col gap-2">
              <h3 className="font-display text-base font-semibold">
                {pillar.title}
              </h3>
              <p className="text-sm text-muted">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-green px-8 py-14 text-paper sm:px-16">
          <h2 className="max-w-lg font-display text-3xl font-semibold leading-snug sm:text-4xl">
            Conhecimento também
            <br />é uma forma de cuidar.
          </h2>
          <p className="mt-4 max-w-md text-sm text-paper/80">
            Nosso blog reúne reflexões sobre acolhimento, família e vínculos
            para tornar essa conversa mais próxima e acessível.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex font-display text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4"
          >
            Conheça nosso blog ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
