import Image from "next/image";
import Link from "next/link";

const LOGO = { width: 600, height: 434 };

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
        src={onDark ? "/logo-centro-gf-branco.png" : "/logo-centro-gf.png"}
        alt=""
        width={LOGO.width}
        height={LOGO.height}
        priority
        style={{ width: size, height: "auto" }}
      />
      <span
        className={`max-w-[8.5rem] font-display text-[13.5px] font-semibold leading-[1.4] tracking-[0.01em] ${
          onDark ? "text-white" : ""
        }`}
      >
        Centro de Equoterapia GF
      </span>
    </Link>
  );
}
