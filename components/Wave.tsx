// Borda ondulada no topo de uma seção (a cor é a da seção de cima).
export default function WaveTop({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 70"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute left-0 top-[-1px] block h-[clamp(34px,5vw,70px)] w-full fill-paper ${className}`}
    >
      <path d="M0 0H1440V34C1130 78 820 6 500 34S130 70 0 30Z" />
    </svg>
  );
}
