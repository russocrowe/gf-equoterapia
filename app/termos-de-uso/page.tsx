import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de uso",
};

export default function TermosDeUsoPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">Termos de uso</h1>
      <p className="mt-6 rounded-xl border border-dashed border-tinta/20 bg-azul-claro p-5 text-sm text-tinta/70">
        [Conteúdo em elaboração. Esta página deve descrever as condições de
        uso do site, isenções de responsabilidade sobre o conteúdo
        informativo (que não substitui avaliação médica) e demais termos.
        Recomendamos revisão jurídica antes da publicação final.]
      </p>
    </div>
  );
}
