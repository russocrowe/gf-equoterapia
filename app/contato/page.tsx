import type { Metadata } from "next";
import { siteConfig, waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contato",
  description: `Agende uma avaliação ou tire suas dúvidas com o ${siteConfig.name} em ${siteConfig.city}.`,
};

export default function ContatoPage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <span className="text-xs text-tinta/50">Início › Contato</span>
        <span className="mt-4 block font-display text-xs font-semibold uppercase tracking-widest text-marrom">
          Contato
        </span>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Vamos conversar sobre o próximo passo?
        </h1>
        <p className="mt-6 max-w-xl text-sm text-tinta/70">
          Agende uma avaliação inicial e conheça o centro, a equipe e os
          cavalos.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="rounded-3xl bg-azul px-8 py-12 text-white sm:px-12">
          <h2 className="font-display text-2xl font-semibold">
            Agendar avaliação
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/80">
            Fale diretamente com a nossa equipe pelo WhatsApp para agendar a
            primeira avaliação.
          </p>
          <a
            href={waLink("Olá! Gostaria de agendar uma avaliação.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display text-sm font-semibold text-azul transition-opacity hover:opacity-90"
          >
            Agendar pelo WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-semibold">
            Como chegar
          </h2>
          <dl className="mt-6 flex flex-col gap-4 text-sm">
            <div>
              <dt className="font-display font-semibold">Endereço</dt>
              <dd className="text-tinta/70">
                {siteConfig.address}
                <br />
                {siteConfig.city}
              </dd>
            </div>
            <div>
              <dt className="font-display font-semibold">WhatsApp</dt>
              <dd className="text-tinta/70">{siteConfig.whatsappDisplay}</dd>
            </div>
            <div>
              <dt className="font-display font-semibold">E-mail</dt>
              <dd className="text-tinta/70">{siteConfig.email}</dd>
            </div>
            <div>
              <dt className="font-display font-semibold">Instagram</dt>
              <dd className="text-tinta/70">{siteConfig.instagramHandle}</dd>
            </div>
            <div>
              <dt className="font-display font-semibold">
                Horário de atendimento
              </dt>
              <dd className="text-tinta/70">{siteConfig.hours}</dd>
            </div>
          </dl>
        </div>

        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-tinta/20 bg-azul-claro text-center text-sm text-tinta/50">
          Mapa será exibido aqui assim que o endereço completo for
          confirmado.
        </div>
      </section>
    </div>
  );
}
