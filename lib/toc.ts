import GithubSlugger from "github-slugger";

export type TocItem = { text: string; slug: string };

export function extractHeadings(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const headings: TocItem[] = [];

  for (const line of markdown.split("\n")) {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      const text = match[1].trim();
      headings.push({ text, slug: slugger.slug(text) });
    }
  }

  return headings;
}
