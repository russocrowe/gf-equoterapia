import Image from "next/image";
import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { formatDate } from "@/lib/format";
import { visibleCategory, type Post } from "@/lib/posts";

export default function PostCard({
  post,
  fallbackCover,
}: {
  post: Post;
  fallbackCover?: string;
}) {
  const cover = post.cover_image || fallbackCover;
  const category = visibleCategory(post);

  return (
    <article className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="card card-hover group flex h-full flex-col overflow-hidden"
      >
        <div className="overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={`Imagem da matéria: ${post.title}`}
              width={800}
              height={500}
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <ImagePlaceholder
              label="Imagem em breve"
              className="aspect-[16/10] w-full !rounded-none !border-0"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          {category && (
            <p className="mb-3 flex items-center gap-2 text-[11.5px] font-bold uppercase tracking-[0.14em] text-forest">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
              {category}
            </p>
          )}
          <h3 className="text-[1.2rem] leading-snug">{post.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            {post.excerpt}
          </p>
          <p className="mt-auto pt-6 text-[13px] font-semibold text-navy">
            {formatDate(post.published_at)}
            {post.published_at ? " · " : ""}
            <span className="underline decoration-gold decoration-2 underline-offset-4">
              Ler matéria
            </span>{" "}
            <span aria-hidden>→</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
