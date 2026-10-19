// Tags (etiquetas) das matérias.
export const MAX_TAGS = 8;
export const MAX_TAG_LENGTH = 30;

export function normalizeTag(raw: string): string {
  return raw
    .trim()
    .replace(/^#+/, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TAG_LENGTH);
}

// Chave para comparar/filtrar: sem acento e sem diferença de maiúsculas.
export function tagKey(tag: string): string {
  return tag
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Aceita "a, b, c" ou uma lista; remove repetidas e limita a quantidade.
export function parseTags(value: string | string[] | null | undefined): string[] {
  const parts = Array.isArray(value) ? value : (value ?? "").split(/[,\n]/);
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const part of parts) {
    const tag = normalizeTag(part);
    const key = tagKey(tag);
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    tags.push(tag);
    if (tags.length >= MAX_TAGS) break;
  }
  return tags;
}
