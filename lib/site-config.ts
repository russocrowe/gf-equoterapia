// Dados reais do centro ainda não fornecidos: mantidos como placeholders
// entre colchetes, no mesmo padrão do mockup, até serem substituídos.
export const siteConfig = {
  name: "Centro de Equoterapia GF",
  shortName: "Centro de Equoterapia GF",
  city: "[CIDADE – UF]",
  address: "[ENDEREÇO COMPLETO]",
  addressCity: "[CIDADE – UF]",
  whatsappNumber: "[TELEFONE]", // formato E.164 sem símbolos, ex: 5511999999999
  whatsappDisplay: "[TELEFONE]",
  email: "[E-MAIL]",
  instagram: "[INSTAGRAM]",
  instagramHandle: "@[INSTAGRAM]",
  cnpj: "[00.000.000/0000-00]",
  hours: "[HORÁRIO DE ATENDIMENTO]",
};

const WHATSAPP_DIGITS_PLACEHOLDER = "[TELEFONE]";

export function waLink(message: string): string {
  const digits = siteConfig.whatsappNumber.replace(/\D/g, "");
  const phone = digits || WHATSAPP_DIGITS_PLACEHOLDER;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
