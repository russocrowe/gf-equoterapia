import type { Metadata } from "next";
import { conditions } from "@/lib/content";
import { getCenterInfo } from "@/lib/public-data";
import { waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Condições tratadas",
  description:
    "Condições em que a equoterapia pode ser indicada: TEA, paralisia cerebral, síndrome de Down, TDAH, sequelas de AVC e atrasos do desenvolvimento.",
};

const container = "mx-auto max-w-[1320px] px-6 md:px-12";

export default async function CondicoesPage() {
  const center = await getCenterInfo();

  return (
    <div>
      <section className={`${container} pb-10 pt-12 md:pt-[72px]`}>
        <p className="eyebrow">Condições tratadas</p>
        <h1 className="my-6 max-w-3xl">
          Para quem a equoterapia <em>pode ser indicada.</em>
        </h1>
        <p className="max-w-2xl text-[17px]">
          A indicação depende sempre de avaliação médica e da equipe
          multiprofissional. Cada condição terá, em breve, uma página própria
          com conteúdo aprofundado, revisado pela nossa equipe.
        </p>
      </section>

      <section className={`${container} py-10`}>
        <div className="grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((condition) => (
            <div
              key={condition.slug}
              className="border-t-2 border-sage pt-[22px]"
            >
              <span className="text-xs font-bold uppercase tracking-[1.5px] text-forest">
                {condition.cid}
              </span>
              <h2 className="mb-2 mt-3 text-[1.4rem] leading-[1.25]">
                {condition.title}
              </h2>
              <p className="text-[15px]">{condition.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sage-soft">
        <div
          className={`${container} flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center`}
        >
          <div>
            <h2 className="max-w-lg">
              Não encontrou a <em>condição do seu interesse?</em>
            </h2>
            <p className="mt-3 max-w-lg text-[15px]">
              Fale com a nossa equipe pelo WhatsApp — cada caso é avaliado
              individualmente.
            </p>
          </div>
          <a
            href={waLink(
              center,
              "Olá! Gostaria de saber se a equoterapia é indicada para o meu caso.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary shrink-0"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
