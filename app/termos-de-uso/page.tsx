import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de uso",
};

export default function TermosDeUsoPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-6 pb-20 pt-12 md:px-12 md:pt-[72px]">
      <p className="eyebrow">Legal</p>
      <h1 className="my-6">Termos de uso</h1>
      <p className="max-w-2xl rounded-xl border border-dashed border-sand bg-sand-soft p-6 text-[15px]">
        [Conteúdo em elaboração. Esta página deve descrever as condições de
        uso do site, isenções de responsabilidade sobre o conteúdo
        informativo (que não substitui avaliação médica) e demais termos.
        Recomendamos revisão jurídica antes da publicação final.]
      </p>
    </div>
  );
}
