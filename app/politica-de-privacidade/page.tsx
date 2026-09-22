import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidade",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">
        Política de privacidade
      </h1>
      <p className="mt-6 rounded-xl border border-dashed border-tinta/20 bg-azul-claro p-5 text-sm text-tinta/70">
        [Conteúdo em elaboração. Esta página deve descrever quais dados são
        coletados no site (ex: formulários, cookies), como são usados e
        armazenados, e os direitos do titular conforme a LGPD. Recomendamos
        revisão jurídica antes da publicação final.]
      </p>
    </div>
  );
}
