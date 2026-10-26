// Fotos do site que o painel sabe gerenciar. A linha no banco é criada na
// primeira vez que a foto é enviada, então não precisa de migration.

export const siteImageMeta = {
  hero: {
    label: "Foto principal (início e Equoterapia)",
    description: "Aparece no topo da página inicial e da página Equoterapia.",
  },
  espaco: {
    label: "Foto do nosso espaço (início)",
    description: 'Aparece na seção "Sobre o GF" da página inicial.',
  },
  sobre: {
    label: "Foto da página Sobre nós",
    description: "Aparece ao lado dos quatro pilares do cuidado.",
  },
  materia_padrao: {
    label: "Capa padrão das matérias",
    description: "Usada nas matérias que ainda não têm uma capa própria.",
  },
} as const;

export type SiteImageKey = keyof typeof siteImageMeta;

export const siteImageKeys = Object.keys(siteImageMeta) as SiteImageKey[];

export function isSiteImageKey(key: string): key is SiteImageKey {
  return key in siteImageMeta;
}
