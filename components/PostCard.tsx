import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col gap-3 border-b border-tinta/10 py-8 first:pt-0">
      <span className="inline-block w-fit rounded-full bg-marrom-claro px-2.5 py-1 font-display text-xs font-semibold text-marrom">
        {post.category}
      </span>
      <h3 className="font-display text-xl font-semibold leading-snug">
        {post.title}
      </h3>
      <p className="text-sm text-tinta/60">{post.excerpt}</p>
      <Link
        href={`/blog/${post.slug}`}
        className="font-display text-sm font-medium text-azul underline decoration-2 underline-offset-4"
      >
        {post.read_minutes} min de leitura &middot; Ler artigo →
      </Link>
    </article>
  );
}
