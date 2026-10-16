// Só aceita caminhos internos (evita open redirect via ?next=).
export function safeNext(
  value: string | null | undefined,
  fallback = "/perfil",
): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.includes("\\")) return fallback;
  if (/[\u0000-\u001f]/.test(value)) return fallback;
  return value;
}
