"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Entrada suave ao rolar a página. O conteúdo já vem visível do servidor; só
// o que está abaixo da dobra é escondido e revelado, então sem JavaScript (ou
// com "reduzir movimento") nada fica oculto.
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("is-editing")) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        el.style.transitionDelay = `${delay}ms`;
        el.classList.remove("reveal-pending");
        el.classList.add("reveal-in");
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
