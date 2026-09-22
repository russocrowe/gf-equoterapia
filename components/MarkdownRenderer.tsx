import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-article max-w-none">
      <ReactMarkdown rehypePlugins={[rehypeSlug]}>{content}</ReactMarkdown>
    </div>
  );
}
