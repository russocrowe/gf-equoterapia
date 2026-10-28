export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}


// "27 out 2026" (para etiquetas)
export function formatDateShort(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "America/Sao_Paulo",
    })
    .replace(/\./g, "")
    .replace(/ de /g, " ");
}
