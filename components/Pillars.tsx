import type { ReactNode } from "react";
import { HorseMark, PersonIcon, StableIcon, TeamIcon } from "@/components/icons";
import T from "@/components/editor/T";

// Os quatro pilares do cuidado (texto compartilhado entre Início e Sobre nós).
const pillars: { n: 1 | 2 | 3 | 4; icon: ReactNode; tone: string; num: string }[] = [
  { n: 1, icon: <TeamIcon className="h-8 w-8" />, tone: "bg-sage-soft text-forest", num: "text-forest" },
  { n: 2, icon: <PersonIcon className="h-8 w-8" />, tone: "bg-butter text-butter-ink", num: "text-butter-ink" },
  { n: 3, icon: <HorseMark className="h-8 w-12" />, tone: "bg-coral-soft text-coral-ink", num: "text-coral-ink" },
  { n: 4, icon: <StableIcon className="h-8 w-8" />, tone: "bg-sky-soft text-sky-ink", num: "text-sky-ink" },
];

export default function Pillars({ className = "" }: { className?: string }) {
  return (
    <ol className={`border-t-[3px] border-sun ${className}`}>
      {pillars.map(({ n, icon, tone, num }) => (
        <li
          key={n}
          className="pillar-row grid grid-cols-[52px_1fr] gap-4 py-7 md:grid-cols-[64px_1fr] md:gap-5"
        >
          <span
            className={`pillar-ico flex h-[52px] w-[52px] items-center justify-center rounded-full md:h-16 md:w-16 ${tone}`}
          >
            {icon}
          </span>
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <T k={`about.pillar.${n}.title`} as="h3" className="text-[1.3rem]" />
              <span
                aria-hidden
                className={`font-display text-[11px] font-semibold tracking-[0.14em] ${num}`}
              >
                {String(n).padStart(2, "0")}
              </span>
            </div>
            <T
              k={`about.pillar.${n}.text`}
              as="p"
              className="text-[16px] leading-relaxed text-muted"
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
