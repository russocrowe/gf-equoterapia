import type { Metadata } from "next";
import { getCenterInfo } from "@/lib/public-data";
import { instagramHandle, SITE_NAME, waLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contato",
  description: `Agende uma avaliação ou tire suas dúvidas com o ${SITE_NAME}.`,
};

const container = "mx-auto max-w-[1320px] px-6 md:px-12";

export default async function ContatoPage() {
  const center = await getCenterInfo();

  const details = [
    {
      label: "Endereço",
      value: [center.address, center.city].filter(Boolean).join(" — "),
    },
    { label: "WhatsApp", value: center.whatsapp },
    { label: "E-mail", value: center.email },
    { label: "Instagram", value: instagramHandle(center) },
    { label: "Horário de atendimento", value: center.hours },
  ].filter((item) => item.value);

  return (
    <div>
      <section className={`${container} pb-10 pt-12 md:pt-[72px]`}>
        <p className="eyebrow">Contato</p>
        <h1 className="my-6 max-w-3xl">
          Vamos conversar sobre o <em>próximo passo?</em>
        </h1>
        <p className="max-w-2xl text-[17px]">
          Agende uma avaliação inicial e conheça o centro, a equipe e os
          cavalos.
        </p>
        <a
          href={waLink(center, "Olá! Gostaria de agendar uma avaliação.")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-8"
        >
          Agendar pelo WhatsApp <span aria-hidden>↗</span>
        </a>
      </section>

      <section className={`${container} grid gap-12 py-16 lg:grid-cols-2`}>
        <div>
          <h2 className="mb-6 text-[1.9rem]">Como chegar</h2>
          <dl className="flex flex-col">
            {details.map((item) => (
              <div
                key={item.label}
                className="border-t-2 border-sand py-4"
              >
                <dt className="text-xs font-bold uppercase tracking-[1.5px] text-forest">
                  {item.label}
                </dt>
                <dd className="mt-1 text-[15px]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-sage bg-sage-soft px-6 text-center text-sm">
          Mapa será exibido aqui assim que o endereço completo for confirmado.
        </div>
      </section>
    </div>
  );
}
