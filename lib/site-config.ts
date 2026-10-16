export const SITE_NAME = "Centro de Equoterapia GF";

export type CenterInfo = {
  address: string;
  city: string;
  whatsapp: string;
  email: string;
  instagram: string;
  cnpj: string;
  hours: string;
};

// Valores de fallback: aparecem enquanto o centro não preencher
// "Editar site → Informações do centro" no painel.
export const defaultCenterInfo: CenterInfo = {
  address: "[ENDEREÇO COMPLETO]",
  city: "[CIDADE – UF]",
  whatsapp: "[TELEFONE]",
  email: "[E-MAIL]",
  instagram: "[INSTAGRAM]",
  cnpj: "[00.000.000/0000-00]",
  hours: "[HORÁRIO DE ATENDIMENTO]",
};

export const centerInfoKeys = Object.keys(defaultCenterInfo) as (keyof CenterInfo)[];

export function instagramHandle(center: Pick<CenterInfo, "instagram">): string {
  const handle = center.instagram.trim().replace(/^@/, "");
  return handle ? `@${handle}` : "";
}

// Números brasileiros digitados sem DDI (10–11 dígitos) ganham o prefixo 55.
export function whatsappDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return digits.length <= 11 ? `55${digits}` : digits;
}

export function waLink(
  center: Pick<CenterInfo, "whatsapp">,
  message: string,
): string {
  return `https://wa.me/${whatsappDigits(center.whatsapp)}?text=${encodeURIComponent(message)}`;
}
