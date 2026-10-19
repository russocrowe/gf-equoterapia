import ArticleBody from "@/components/ArticleBody";

export default function MarkdownRenderer({ content }: { content: string }) {
  return <ArticleBody content={content} />;
}
