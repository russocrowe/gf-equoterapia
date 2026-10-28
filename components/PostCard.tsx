import Image from "next/image";
import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { formatDateShort } from "@/lib/format";
import { visibleCategory, type Post } from "@/lib/posts";
import { displayTags } from "@/lib/tags";

// Cartão de matéria: foto com a data em etiqueta, tags coloridas, título e resumo.
// O link do título cobre o cartão inteiro (um só link para teclado e leitor de tela).
export default function PostCard({
  post,
  fallbackCover,
  tone = 0,
}: {
  post: Post;
  fallbackCover?: string;
  // 0 a 3: escolhe a cor do cartão (amarelo, coral, verde e azul).
  tone?: number;
}) {
  const cover = post.cover_image || fallbackCover;
  const category = visibleCategory(post);
  const chips = [category, ...displayTags(post.tags, category ? 1 : 2)].filter(Boolean);

  return (
    <article className={`pc tone-${tone % 4}`}>
      <div className="pc-cover">
        {cover ? (
          <Image
            src={cover}
            alt=""
            width={800}
            height={500}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 84vw"
          />
        ) : (
          <ImagePlaceholder
            label="Imagem em breve"
            className="aspect-[16/10] w-full !rounded-none !border-0"
          />
        )}
        {post.published_at && (
          <span className="pc-date">{formatDateShort(post.published_at)}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-6">
        {chips.length > 0 && (
          <p className="pc-tags">
            {chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </p>
        )}
        <h3 className="clamp-3 text-[1.32rem] leading-[1.22]">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h3>
        <p className="clamp-3 text-[15.5px] leading-[1.55] text-muted">{post.excerpt}</p>
        <span className="link-arrow mt-auto self-start">
          Ler matéria <span aria-hidden>→</span>
        </span>
      </div>
    </article>
  );
}
