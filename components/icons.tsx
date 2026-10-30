import type { SVGProps } from "react";

// Ícones do site em traço fino. O cavalo da marca (HorseMark) vem do desenho da
// logo, em /marca-cavalo.svg.
const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

type IconProps = SVGProps<SVGSVGElement>;

export function TeamIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="16" r="5.2" />
      <path d="M14 39c.6-6.2 4.6-10.3 10-10.3S33.4 32.8 34 39" />
      <circle cx="9.5" cy="20" r="3.6" />
      <path d="M3.4 37c.4-4.5 2.9-7.3 6.1-7.3" />
      <circle cx="38.5" cy="20" r="3.6" />
      <path d="M44.6 37c-.4-4.5-2.9-7.3-6.1-7.3" />
    </svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="19" r="5.2" />
      <path d="M14 36c1.6-5.2 5.2-7.8 10-7.8s8.4 2.6 10 7.8" />
    </svg>
  );
}

export function LawIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 7v34M14 41h20M9 14h30" />
      <path d="M9 14 4 26a5 5 0 0 0 10 0L9 14zM39 14l-5 12a5 5 0 0 0 10 0l-5-12z" />
    </svg>
  );
}

export function StableIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 43V19L24 7l19 12v24" />
      <path d="M15 43V27c0-5 4-8 9-8s9 3 9 8v16" />
      <path d="M24 19v24M15 33h18" />
      <path d="M2 43h44" />
    </svg>
  );
}

export function ShoeHeartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 8C8.6 22 10.6 36 24 42c13.4-6 15.4-20 12-34" />
      <path d="M19 8C17 20 18 30 24 35c6-5 7-15 5-27" />
      <path d="M12 8h7M29 8h7" />
      <path d="M24 29.4c-2.8-1.9-4.2-3.5-4.2-5.2a2.2 2.2 0 0 1 4.2-1 2.2 2.2 0 0 1 4.2 1c0 1.7-1.4 3.3-4.2 5.2z" />
    </svg>
  );
}

// Cavalo da logo (cabeça e lombo), pintado com a cor do texto.
export function HorseMark({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`horse-mark ${className}`} />;
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} viewBox="0 0 24 24" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
