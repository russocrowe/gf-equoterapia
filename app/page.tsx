import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import PostCard from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const values = [
  {
    icon: "♡",
    title: "Acolhimento de verdade",
    description: "Um olhar para cada história.",
  },
  {
    icon: "◎",
    title: "Respeito à individualidade",
    description: "Cada criança tem seu próprio tempo.",
  },
  {
    icon: "⌁",
    title: "Família por perto",
    description: "Escuta e diálogo em cada etapa.",
  },
];

export default async function Home() {
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <span className="mb-4 inline-block border-t border-ink/40 pt-3 font-display text-xs font-semibold uppercase tracking-widest text-muted">
          Cuidado · Vínculo · Acolhimento
        </span>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Pequenos passos.
          <br />
          Grandes <em className="text-green font-medium italic">possibilidades.</em>
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted">
          Entre o carinho, a natureza e a presença do cavalo, um espaço para
          acolher cada criança e respeitar seu tempo.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            href="/sobre"
            className="inline-flex items-center gap-2 rounded-full bg-green px-6 py-3 font-display text-sm font-semibold text-paper transition-opacity hover:opacity-90"
          >
            Conheça a GF ↗
          </Link>
          <Link
            href="/blog"
            className="font-display text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4"
          >
            Explore nosso blog
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="relative">
          <ImagePlaceholder
            label="Imagem ilustrativa"
            className="aspect-[16/10] w-full"
          />
          <div className="mt-4 max-w-xs rounded-xl bg-paper px-5 py-4 shadow-sm ring-1 ring-ink/10 sm:absolute sm:bottom-6 sm:left-6 sm:mt-0">
            <span className="text-lime">♡</span>
            <p className="mt-1 font-display text-sm font-semibold">
              O cuidado começa
              <br />
              com uma conexão.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-3">
        {values.map((value) => (
          <div key={value.title} className="flex flex-col gap-2">
            <span className="text-2xl text-green">{value.icon}</span>
            <h3 className="font-display text-base font-semibold">
              {value.title}
            </h3>
            <p className="text-sm text-muted">{value.description}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-2 border-b border-ink/10 pb-8">
          <span className="font-display text-xs font-semibold uppercase tracking-widest text-muted">
            Nosso blog
          </span>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold">
              Informação que acolhe.
            </h2>
            <Link
              href="/blog"
              className="font-display text-sm font-medium underline decoration-lime decoration-2 underline-offset-4"
            >
              Ver todos os artigos ↗
            </Link>
          </div>
          <p className="max-w-lg text-sm text-muted">
            Reflexões para acompanhar esse caminho com você.
          </p>
        </div>
        <div className="flex flex-col">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-green px-8 py-14 text-paper sm:px-16">
          <h2 className="max-w-lg font-display text-3xl font-semibold leading-snug sm:text-4xl">
            Cuidar é enxergar
            <br />a pessoa por inteiro.
          </h2>
          <p className="mt-4 max-w-md text-sm text-paper/80">
            Na GF Equoterapia, acreditamos no valor da escuta, no respeito às
            diferenças e na construção de vínculos. Porque cada história
            merece atenção.
          </p>
          <Link
            href="/sobre"
            className="mt-6 inline-flex font-display text-sm font-semibold underline decoration-lime decoration-2 underline-offset-4"
          >
            Conheça nosso propósito ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
