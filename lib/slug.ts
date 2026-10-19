// Endereço (slug) de uma matéria: minúsculas, sem acento, só letras, números e
// hífens. Aceita também um endereço colado por inteiro e fica só com o final.
export const MAX_SLUG_LENGTH = 80;

export function slugify(value: string): string {
  let text = value.trim();
  try {
    text = decodeURIComponent(text);
  } catch {
    /* mantém o texto original se vier com % inválido */
  }
  text = text
    .replace(/^https?:\/\/[^/]+/i, "")
    .split(/[?#]/, 1)[0]
    .replace(/\\/g, "/");
  const marker = text.toLowerCase().lastIndexOf("/blog/");
  if (marker >= 0) text = text.slice(marker + 6);

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, "");
}
