import Link from "next/link";
import Reveal from "@/components/Reveal";
import T from "@/components/editor/T";

// Faixa azul que leva ao blog ("Conhecimento também é uma forma de cuidar").
export default function KnowledgeBand() {
  return (
    <section className="on-dark relative overflow-hidden bg-navy text-white">
      <i aria-hidden className="absolute -top-9 left-[5%] h-20 w-20 rounded-full bg-coral md:h-24 md:w-24" />
      <i aria-hidden className="absolute bottom-6 right-[12%] h-11 w-11 rounded-full bg-sun" />
      <i aria-hidden className="absolute -bottom-16 left-[44%] hidden h-[150px] w-[150px] rounded-full border-2 border-white/20 md:block" />
      <span
        aria-hidden
        className="shoe-mark absolute -right-10 top-1/2 h-[300px] w-[300px] -translate-y-1/2 -rotate-[14deg] text-white/[.07] md:right-[4%]"
      />
      <Reveal>
        <div className="relative mx-auto grid max-w-[1160px] items-center gap-8 px-6 py-16 md:grid-cols-2 md:gap-10 md:px-10 md:py-24">
          <T k="sobre.band.title" as="h2" className="max-w-sm" />
          <div>
            <T
              k="sobre.band.text"
              as="p"
              className="mb-7 max-w-[30rem] text-[16.5px] leading-relaxed text-white/90"
            />
            <Link href="/equoterapia" className="btn btn-light">
              <T k="sobre.band.link" /> <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
