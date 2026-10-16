import {
  centerInfoKeys,
  defaultCenterInfo,
  type CenterInfo,
} from "@/lib/site-config";

import {
  contentDefaults,
  contentKeys,
  type ContentKey,
} from "@/lib/content-defaults";
import { sanitizeRich } from "@/lib/rich-text";

export const SITE_CONFIG_TAG = "site-config";
export const SITE_IMAGES_TAG = "site-images";
export const SITE_CONTENT_TAG = "site-content";

// Leitura pública sem cookies: mantém as páginas estáticas e cacheadas.
// Se o Supabase falhar (ou a migration ainda não foi aplicada), o site usa os
// valores de fallback em vez de quebrar.
async function publicRest<T>(path: string, tag: string): Promise<T | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;

  try {
    const res = await fetch(`${url}/rest/v1/${path}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { tags: [tag], revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getCenterInfo(): Promise<CenterInfo> {
  const rows = await publicRest<{ value: Record<string, unknown> }[]>(
    "site_settings?key=eq.center&select=value",
    SITE_CONFIG_TAG,
  );
  const stored = rows?.[0]?.value ?? {};
  const info = { ...defaultCenterInfo };
  for (const key of centerInfoKeys) {
    const value = stored[key];
    if (typeof value === "string") info[key] = value;
  }
  return info;
}

export type SiteContent = Record<ContentKey, string>;

// Textos editáveis das páginas: o que está no banco vence o padrão do código.
export async function getSiteContent(): Promise<SiteContent> {
  const rows = await publicRest<{ value: Record<string, unknown> }[]>(
    "site_settings?key=eq.content&select=value",
    SITE_CONTENT_TAG,
  );
  const stored = rows?.[0]?.value ?? {};
  const content = { ...contentDefaults } as Record<ContentKey, string>;
  for (const key of contentKeys) {
    const value = stored[key];
    if (typeof value === "string" && value.trim()) {
      content[key] = sanitizeRich(value);
    }
  }
  return content;
}

export type SiteImage = { url: string; alt: string; caption: string };
export type SiteImages = {
  hero: SiteImage;
  sobre: SiteImage;
  materia_padrao: SiteImage;
};

const emptyImages: SiteImages = {
  hero: {
    url: "",
    alt: "Cena ilustrativa de uma criança de capacete ao lado de um cavalo, acompanhada por uma adulta",
    caption: "Imagem ilustrativa",
  },
  sobre: {
    url: "",
    alt: "Cena ilustrativa de aproximação entre criança e cavalo com acompanhamento",
    caption: "Imagem ilustrativa",
  },
  materia_padrao: {
    url: "",
    alt: "Imagem ilustrativa de aproximação entre criança e cavalo",
    caption: "",
  },
};

export async function getSiteImages(): Promise<SiteImages> {
  const rows = await publicRest<
    { key: string; url: string; alt: string; caption: string }[]
  >(
    "site_images?select=key,url,alt,caption",
    SITE_IMAGES_TAG,
  );
  const images: SiteImages = {
    hero: { ...emptyImages.hero },
    sobre: { ...emptyImages.sobre },
    materia_padrao: { ...emptyImages.materia_padrao },
  };
  for (const row of rows ?? []) {
    if (row.key in images) {
      const key = row.key as keyof SiteImages;
      images[key] = {
        url: row.url ?? "",
        alt: row.alt || emptyImages[key].alt,
        caption: row.caption ?? "",
      };
    }
  }
  return images;
}
