import Link from "next/link";
import type { Metadata } from "next";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Cuidado, ciência e o cavalo como parceiro: conheça a equipe, a estrutura e os valores do Centro de Equoterapia GF.",
};

const values = [
  {
    icon: "♥",
    title: "Missão",
    description:
      "Promover desenvolvimento, autonomia e qualidade de vida por meio da equoterapia, com acolhimento às famílias. [ajustar]",
  },
  {
    icon: "◈",
    title: "Visão",
    description:
      "[Ser referência regional em equoterapia, reconhecida pela seriedade técnica e pelo cuidado humano.]",
  },
  {
    icon: "★",
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

const horses = ["[Nome do cavalo]", "[Nome do cavalo]", "[Nome do cavalo]", "[Nome do cavalo]"];

const badges = [
  {
    icon: "★",
    title: "Filiação ANDE-Brasil",
    description: "[confirmar status e nº]",
  },
  {
    icon: "▤",
    title: "Lei nº 13.830/2019",
    description: "Reconhece a equoterapia como método de reabilitação",
  },
  {
    icon: "◎",
    title: "Atendimento a todas as idades",
    description: "Crianças, jovens, adultos e idosos",
  },
];

export default function SobrePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-16 pb-8 sm:grid-cols-2">
        <div>
          <span className="text-xs text-tinta/50">Início › Sobre</span>
          <span className="mt-4 block font-display text-xs font-semibold uppercase tracking-widest text-marrom">
            Sobre nós
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Cuidado, ciência e o cavalo como parceiro
          </h1>
          <p className="mt-6 max-w-md text-sm text-tinta/70">
            [História do Centro de Equoterapia GF: origem, fundadores, o
            significado de &quot;GF&quot; e o propósito que orienta o trabalho
            da equipe.]
          </p>
          <p className="mt-4 max-w-md text-sm text-tinta/70">
            [Onde o centro fica, desde quando atende e qual público recebe.]
          </p>
        </div>
        <ImagePlaceholder
          label="Foto: fundadores / equipe com os cavalos"
          className="aspect-[4/5] w-full"
        />
      </section>

      <section className="bg-azul-claro">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold">
            O que nos move
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-azul-claro text-azul">
                  {value.icon}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-tinta/60">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="equipe" className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
              Equipe
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              Uma equipe multiprofissional
            </h2>
          </div>
          <p className="max-w-sm text-sm text-tinta/60">
            Na equoterapia, saúde, educação e equitação trabalham juntas.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.role}>
              <ImagePlaceholder
                label="Foto do profissional"
                className="aspect-square w-full"
              />
              <p className="mt-3 font-display text-sm font-semibold">
                [Nome]
              </p>
              <p className="text-sm text-tinta/70">{member.role}</p>
              <p className="text-xs text-tinta/50">{member.registry}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="estrutura" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div>
            <span className="font-display text-xs font-semibold uppercase tracking-widest text-marrom">
              Estrutura e cavalos
            </span>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-snug">
              Nossos cavalos também são parte da equipe
            </h2>
            <p className="mt-4 text-sm text-tinta/70">
              [Como os cavalos são escolhidos (temperamento, andadura),
              treinados e cuidados: rotina, alimentação, descanso e
              acompanhamento veterinário.]
            </p>
            <p className="mt-4 text-sm text-tinta/70">
              [Estrutura: picadeiro, rampa de acesso, área coberta, sala de
              espera para as famílias.]
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {horses.map((name, index) => (
              <div key={index}>
                <ImagePlaceholder
                  label="Foto do cavalo"
                  tone={index % 2 === 0 ? "marrom" : "azul"}
                  className="aspect-square w-full"
                />
                <p className="mt-2 text-xs text-tinta/60">{name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex items-start gap-3 rounded-xl border border-tinta/10 bg-white p-5"
            >
              <span className="text-lg text-marrom">{badge.icon}</span>
              <div>
                <p className="font-display text-sm font-semibold">
                  {badge.title}
                </p>
                <p className="text-xs text-tinta/60">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-azul-escuro">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 text-white sm:flex-row sm:items-center">
          <h2 className="max-w-md font-display text-3xl font-semibold leading-snug">
            Venha conhecer o centro pessoalmente
          </h2>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display text-sm font-semibold text-azul-escuro transition-opacity hover:opacity-90"
            >
              Agendar visita
            </Link>
            <a
              href={waLink("Olá! Gostaria de conhecer o centro.")}
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
