import Editable from "@/components/editor/Editable";
import type { ContentKey } from "@/lib/content-defaults";
import { getSiteContent } from "@/lib/public-data";

// Texto do site: vem do banco (ou do padrão do código) e, para o
// administrador, pode ser editado direto na página.
export default async function T({
  k,
  as,
  className,
}: {
  k: ContentKey;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div" | "li";
  className?: string;
}) {
  const content = await getSiteContent();
  return <Editable k={k} value={content[k]} as={as} className={className} />;
}
