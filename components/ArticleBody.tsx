import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSlug from "rehype-slug";

// Corpo de uma matéria. Usado no site e na prévia do editor, então os dois
// mostram exatamente a mesma coisa.
//
// - "# " (H1 do texto) vira um título de seção grande. Na página só existe um
//   H1 de verdade, o título da matéria; por isso ele é publicado como <h2>
//   (mais um nível de seção), o que mantém a hierarquia correta para o Google.
// - Imagens só aparecem se estiverem no armazenamento do próprio site.
// - Links externos abrem em outra aba.

const storagePrefix = `${(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim()}/storage/v1/object/public/`;

const components: Components = {
  h1: ({ node, ...props }) => {
    void node;
    return <h2 {...props} className="article-h1" />;
  },
  a: ({ node, href, children }) => {
    void node;
    const external = /^https?:\/\//i.test(href ?? "");
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
  img: ({ node, src, alt }) => {
    void node;
    if (typeof src !== "string" || !src.startsWith(storagePrefix)) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} loading="lazy" />;
  },
};

export default function ArticleBody({ content }: { content: string }) {
  return (
    <div className="prose-article max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeSlug]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
