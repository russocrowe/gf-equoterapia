import type { Metadata } from "next";
import { conditions } from "@/lib/content";
import { waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Condições tratadas",
  description:
    "Condições em que a equoterapia pode ser indicada: TEA, paralisia cerebral, síndrome de Down, TDAH, sequelas de AVC e atrasos do desenvolvimento.",
};

export default function CondicoesPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <span className="text-xs text-tinta/50">Início › Condições tratadas</span>
        <span className="mt-4 block font-display text-xs font-semibold uppercase tracking-widest text-marrom">
          Condições tratadas
        </span>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Para quem a equoterapia pode ser indicada
        </h1>
        <p className="mt-6 max-w-xl text-sm text-tinta/70">
          A indicação depende sempre de avaliação médica e da equipe
          multiprofissional. Cada condição terá, em breve, uma página própria
          com conteúdo aprofundado, revisado pela nossa equipe.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((condition) => (
            <div
              key={condition.slug}
              className="rounded-xl border border-tinta/10 bg-white p-5"
            >
              <span className="inline-block rounded-full bg-marrom-claro px-2.5 py-1 font-display text-[11px] font-semibold text-marrom">
                {condition.cid}
              </span>
              <h2 className="mt-3 font-display text-base font-semibold">
                {condition.title}
              </h2>
              <p className="mt-1 text-sm text-tinta/60">
                {condition.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-azul-claro px-8 py-10 sm:px-12">
          <h2 className="font-display text-2xl font-semibold">
            Não encontrou a condição do seu interesse?
          </h2>
          <p className="mt-2 max-w-lg text-sm text-tinta/70">
            Fale com a nossa equipe pelo WhatsApp — cada caso é avaliado
            individualmente.
          </p>
          <a
            href={waLink("Olá! Gostaria de saber se a equoterapia é indicada para o meu caso.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-azul px-6 py-3 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
