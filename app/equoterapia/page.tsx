import Link from "next/link";
import type { Metadata } from "next";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { programs } from "@/lib/content";
import { waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Equoterapia",
  description:
    "O que é a equoterapia, como funciona, os programas seguidos pela classificação ANDE-Brasil e os benefícios do método.",
};

const benefits = [
  "Equilíbrio, postura e coordenação motora",
  "Tônus muscular e controle corporal",
  "Atenção, comunicação e linguagem",
  "Autoconfiança, socialização e vínculo",
];

export default function EquoterapiaPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-16 pb-8 sm:grid-cols-2">
        <div>
          <span className="text-xs text-tinta/50">Início › Equoterapia</span>
          <span className="mt-4 block font-display text-xs font-semibold uppercase tracking-widest text-marrom">
            O que é equoterapia
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            O movimento do cavalo a favor do desenvolvimento
          </h1>
          <p className="mt-6 max-w-md text-sm text-tinta/70">
            Ao passo, o cavalo produz um movimento tridimensional —
            semelhante ao da marcha humana — que estimula equilíbrio,
            postura e coordenação, enquanto o vínculo com o animal favorece
            comunicação, autoconfiança e socialização.
          </p>
          <a
            href={waLink("Olá! Gostaria de agendar uma avaliação.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-azul px-6 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Agendar avaliação
          </a>
        </div>
        <ImagePlaceholder
          label="Foto: sessão de equoterapia"
          className="aspect-[4/5] w-full"
        />
      </section>

      <section id="programas" className="bg-azul-claro">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
            Programas
          </span>
          <h2 className="mt-4 max-w-xl font-display text-3xl font-semibold leading-snug">
            Quatro programas, de acordo com o momento de cada praticante
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {programs.map((program) => (
              <div key={program.number} className="rounded-xl bg-white p-6">
                <span className="font-display text-2xl font-semibold text-azul-natural">
                  {program.number}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold">
                  {program.title}
                </h3>
                <p className="mt-2 text-sm text-tinta/60">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-tinta/50">
            Classificação de programas adotada pela ANDE-Brasil (Associação
            Nacional de Equoterapia).
          </p>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-6xl px-6 py-16">
        <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
          Benefícios
        </span>
        <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold leading-snug">
          O que a equoterapia pode estimular
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-start gap-3 rounded-xl border border-tinta/10 bg-white p-5"
            >
              <span className="mt-0.5 text-azul">✓</span>
              <p className="text-sm text-tinta/70">{benefit}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-2xl text-xs text-tinta/50">
          A equoterapia é complementar e não substitui outros tratamentos. A
          indicação deve partir da avaliação médica e da equipe
          multiprofissional.
        </p>
        <Link
          href="/condicoes"
          className="mt-6 inline-flex font-display text-sm font-semibold text-azul underline decoration-2 underline-offset-4"
        >
          Ver condições tratadas →
        </Link>
      </section>

      <section className="bg-azul-escuro">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 text-white sm:flex-row sm:items-center">
          <h2 className="max-w-md font-display text-3xl font-semibold leading-snug">
            Tem dúvidas sobre como começar?
          </h2>
          <a
            href={waLink("Olá! Gostaria de agendar uma avaliação.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 font-display text-sm font-semibold text-azul-escuro transition-opacity hover:opacity-90"
          >
            Agendar avaliação
          </a>
        </div>
      </section>
    </div>
  );
}
