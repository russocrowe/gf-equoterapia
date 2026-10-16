import Image from "next/image";
import Link from "next/link";

const LOGO = { width: 1028, height: 654 };

export default function Brand({
  size = 132,
  tone = "light",
}: {
  size?: number;
  // "dark" = usado sobre fundo escuro (logo e texto brancos).
  tone?: "light" | "dark";
}) {
  const onDark = tone === "dark";

  return (
    <Link
      href="/"
      aria-label="Centro de Equoterapia GF — início"
      className="flex items-center gap-4"
    >
      <Image
        src={onDark ? "/logo-gf-white.png" : "/logo-gf-transparent.png"}
        alt="Haras GF — logo oficial"
        width={LOGO.width}
        height={LOGO.height}
        priority
        style={{ width: size, height: "auto" }}
      />
      <span
        className={`max-w-[7.5rem] font-display text-[17px] font-semibold leading-[1.4] tracking-[-0.02em] ${
          onDark ? "text-white" : ""
        }`}
      >
        Centro de Equoterapia GF
      </span>
    </Link>
  );
}
