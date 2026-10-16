import Image from "next/image";
import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/posts";

export default function PostCard({
  post,
  fallbackCover,
}: {
  post: Post;
  fallbackCover?: string;
}) {
  const cover = post.cover_image || fallbackCover;

  return (
    <article className="border-t border-rule-strong pt-5">
      <Link href={`/blog/${post.slug}`} className="group block">
        {cover ? (
          <Image
            src={cover}
            alt={`Imagem da matéria: ${post.title}`}
            width={800}
            height={430}
            className="aspect-[800/430] w-full rounded-xl object-cover"
          />
        ) : (
          <ImagePlaceholder
            label="Imagem em breve"
            className="aspect-[800/430] w-full"
          />
        )}
        <p className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.5px] text-forest">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gold" />
          {post.category}
        </p>
        <h3 className="mt-2 decoration-1 underline-offset-4 group-hover:underline">
          {post.title}
        </h3>
        <p className="mt-2 text-sm">{post.excerpt}</p>
        <p className="mt-5 text-xs">
          {formatDate(post.published_at)}
          {post.published_at ? " · " : ""}Ler matéria ↗
        </p>
      </Link>
    </article>
  );
}
