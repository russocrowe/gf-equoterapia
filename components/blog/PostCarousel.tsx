"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const GAP = 26;

type View = {
  first: number;
  last: number;
  total: number;
  atStart: boolean;
  atEnd: boolean;
  progress: number;
};

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

// Carrossel de matérias: rolagem horizontal com setas, contador e a ferradura
// que "caminha" conforme o visitante avança. Cada cartão vem pronto do servidor
// (children), dentro de um elemento com data-slide.
export default function PostCarousel({
  head,
  cta,
  children,
}: {
  head: ReactNode;
  cta: ReactNode;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({
    first: 1,
    last: 1,
    total: 0,
    atStart: true,
    atEnd: false,
    progress: 0,
  });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.querySelectorAll<HTMLElement>("[data-slide]");
    const total = slides.length;
    const max = track.scrollWidth - track.clientWidth;
    const step = slides[0] ? slides[0].getBoundingClientRect().width + GAP : track.clientWidth;
    const first = Math.min(total, Math.round(track.scrollLeft / step) + 1);
    const visible = Math.max(1, Math.floor((track.clientWidth + 8) / step));
    setView({
      first,
      last: Math.min(total, first + visible - 1),
      total,
      atStart: track.scrollLeft <= 2,
      atEnd: track.scrollLeft >= max - 2,
      progress: max > 0 ? Math.min(1, Math.max(0, track.scrollLeft / max)) : 0,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(() => measure());
    observer.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [measure]);

  function go(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelector<HTMLElement>("[data-slide]");
    const step = slide ? slide.getBoundingClientRect().width + GAP : track.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  }

  const counter =
    view.first === view.last
      ? `${view.first} de ${view.total}`
      : `${view.first}–${view.last} de ${view.total}`;
  const scrollable = !(view.total > 0 && view.atStart && view.atEnd);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-7">
        <div className="grid max-w-[42rem] gap-5">{head}</div>
        {scrollable && (
          <div
            role="group"
            aria-label="Navegar pelas matérias"
            className="flex items-center gap-3.5"
          >
            {view.total > 0 && (
              <span
                aria-live="polite"
                className="mr-2 hidden min-w-[7.5ch] text-right font-display text-[12px] font-bold uppercase tracking-[0.12em] text-navy md:block"
              >
                {counter}
              </span>
            )}
            <button
              type="button"
              className="rail-nav"
              aria-label="Matérias anteriores"
              disabled={view.atStart}
              onClick={() => go(-1)}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className="rail-nav"
              aria-label="Próximas matérias"
              disabled={view.atEnd}
              onClick={() => go(1)}
            >
              <Chevron direction="right" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className="rail-track"
        role="region"
        aria-label="Matérias do blog"
        tabIndex={0}
        onScroll={measure}
      >
        {children}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-8">
        <div className="rail-progress" aria-hidden>
          <span
            className="rail-shoe"
            style={{ left: `calc((100% - 34px) * ${view.progress})` }}
          >
            <span />
          </span>
        </div>
        {cta}
      </div>
    </div>
  );
}
