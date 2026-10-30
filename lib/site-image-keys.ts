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

// Moldura de cada foto (a mesma proporção usada na página), para enquadrar ao enviar.
export const siteImageFrames: Record<
  SiteImageKey,
  { aspect: number; shape: "rect" | "arch"; outputWidth: number; hint: string }
> = {
  hero: { aspect: 4 / 5, shape: "arch", outputWidth: 1200, hint: "Foto da abertura (em pé, em arco)" },
  espaco: { aspect: 4 / 3, shape: "rect", outputWidth: 1600, hint: "Foto do nosso espaço (deitada)" },
  sobre: { aspect: 5 / 4, shape: "rect", outputWidth: 1500, hint: "Foto da página Sobre nós" },
  materia_padrao: { aspect: 16 / 10, shape: "rect", outputWidth: 1600, hint: "Capa padrão das matérias" },
};

// Fotos que não passam pelo enquadramento (GIF e SVG seguem como estão).
export function isFramable(file: Blob): boolean {
  return file.type.startsWith("image/") && file.type !== "image/gif" && file.type !== "image/svg+xml";
}
