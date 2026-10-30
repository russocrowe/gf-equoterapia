import Image from "next/image";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import type { SiteImage } from "@/lib/public-data";

// Imagem editável pelo painel ("Editar site → Imagens"). Sem imagem
// cadastrada, mostra um bloco "Imagem em breve" no mesmo formato.
export default function SitePhoto({
  image,
  className = "",
  priority = false,
  sizes,
}: {
  image: SiteImage;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!image.url) {
    return <ImagePlaceholder label="Imagem em breve" className={className} />;
  }

  return (
    <Image
      src={image.url}
      alt={image.alt}
      width={1536}
      height={1024}
      priority={priority}
      quality={90}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}
