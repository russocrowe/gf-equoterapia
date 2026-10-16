import { contentKeys } from "@/lib/content-defaults";
import { getAllPostsAdmin } from "@/lib/posts";
import {
  centerInfoKeys,
  defaultCenterInfo,
  filledValue,
  type CenterInfo,
} from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";

export type HealthTask = {
  id: string;
  group: "Contato" | "Fotos" | "Matérias" | "Textos";
  title: string;
  doneTitle: string;
  hint: string;
  href: string;
  action: string;
  done: boolean;
};

export type SiteHealth = {
  tasks: HealthTask[];
  done: number;
  total: number;
  percent: number;
  published: number;
  drafts: number;
  customizedTexts: number;
  recentPosts: Awaited<ReturnType<typeof getAllPostsAdmin>>;
};

const centerTasks: {
  key: keyof CenterInfo;
  title: string;
  hint: string;
}[] = [
  {
    key: "whatsapp",
    title: "Adicionar o WhatsApp do centro",
    hint: "É por onde as famílias vão falar com vocês.",
  },
  {
    key: "address",
    title: "Informar o endereço",
    hint: "Aparece no rodapé e ajuda o Google a mostrar o centro no mapa.",
  },
  {
    key: "city",
    title: "Informar cidade e estado",
    hint: "Entra no título do site que aparece no Google.",
  },
  {
    key: "email",
    title: "Adicionar um e-mail de contato",
    hint: "Um segundo canal para quem não usa WhatsApp.",
  },
  {
    key: "instagram",
    title: "Adicionar o Instagram",
    hint: "Mostra que o centro é ativo e dá prova social.",
  },
  {
    key: "hours",
    title: "Informar o horário de atendimento",
    hint: "Evita dúvidas e mensagens fora de hora.",
  },
  {
    key: "cnpj",
    title: "Informar o CNPJ",
    hint: "Transmite credibilidade e formalidade no rodapé.",
  },
];

const centerDone: Record<keyof CenterInfo, string> = {"whatsapp":"WhatsApp informado","address":"Endereço informado","city":"Cidade e estado informados","email":"E-mail de contato informado","instagram":"Instagram informado","hours":"Horário de atendimento informado","cnpj":"CNPJ informado"};

const imageDone: Record<string, string> = {
  hero: "Foto principal enviada",
  sobre: "Foto do Sobre nós enviada",
  materia_padrao: "Capa padrão das matérias definida",
};

const imageTasks: { key: string; title: string; hint: string }[] = [
  {
    key: "hero",
    title: "Enviar a foto principal da página inicial",
    hint: "É a primeira imagem que o visitante vê. Prefira uma foto real do centro.",
  },
  {
    key: "sobre",
    title: "Enviar a foto da página Sobre nós",
    hint: "Fotos reais da equipe e dos cavalos passam mais confiança.",
  },
  {
    key: "materia_padrao",
    title: "Definir a capa padrão das matérias",
    hint: "Aparece nas matérias que ainda não têm uma capa própria.",
  },
];

// Lê tudo direto do banco (sem cache) para o painel refletir o que foi salvo.
export async function getSiteHealth(): Promise<SiteHealth> {
  const supabase = await createClient();

  const [centerRow, contentRow, imageRows, posts] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "center").maybeSingle(),
    supabase.from("site_settings").select("value").eq("key", "content").maybeSingle(),
    supabase.from("site_images").select("key, url"),
    getAllPostsAdmin(),
  ]);

  const storedCenter = (centerRow.data?.value ?? {}) as Record<string, unknown>;
  const center: CenterInfo = { ...defaultCenterInfo };
  for (const key of centerInfoKeys) {
    const value = storedCenter[key];
    if (typeof value === "string") center[key] = value;
  }

  const images = new Map<string, string>();
  for (const row of imageRows.data ?? []) images.set(row.key, row.url ?? "");

  const storedContent = (contentRow.data?.value ?? {}) as Record<string, unknown>;
  const customizedTexts = contentKeys.filter(
    (key) => typeof storedContent[key] === "string",
  ).length;

  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);
  const defaultCover = Boolean(images.get("materia_padrao"));
  const withoutCover = published.filter(
    (p) => !p.cover_image && !defaultCover,
  ).length;

  const tasks: HealthTask[] = [
    ...centerTasks.map<HealthTask>((t) => ({
      id: `centro-${t.key}`,
      group: "Contato",
      title: t.title,
      doneTitle: centerDone[t.key],
      hint: t.hint,
      href: "/admin/centro",
      action: "Preencher",
      done: Boolean(filledValue(center[t.key])),
    })),
    ...imageTasks.map<HealthTask>((t) => ({
      id: `foto-${t.key}`,
      group: "Fotos",
      title: t.title,
      doneTitle: imageDone[t.key],
      hint: t.hint,
      href: "/admin/imagens",
      action: "Enviar foto",
      done: Boolean(images.get(t.key)),
    })),
    {
      id: "materias-publicadas",
      group: "Matérias",
      title:
        published.length === 0
          ? "Publicar a primeira matéria"
          : "Ter pelo menos 3 matérias publicadas",
      doneTitle: "3 ou mais matérias publicadas",
      hint: "Conteúdo novo mantém o site vivo e ajuda o Google a encontrar vocês.",
      href: published.length === 0 ? "/admin/materias/nova" : "/admin/materias",
      action: published.length === 0 ? "Escrever" : "Ver matérias",
      done: published.length >= 3,
    },
    {
      id: "materias-destaque",
      group: "Matérias",
      title: "Escolher uma matéria em destaque",
      doneTitle: "Matéria em destaque escolhida",
      hint: "Ela ganha o maior espaço na página Equoterapia.",
      href: "/admin/materias",
      action: "Escolher",
      done: published.some((p) => p.featured),
    },
    {
      id: "materias-capa",
      group: "Matérias",
      title: `${withoutCover} ${withoutCover === 1 ? "matéria está" : "matérias estão"} sem capa`,
      doneTitle: "Todas as matérias têm capa",
      hint: "Envie uma capa para cada uma ou defina a capa padrão em Imagens.",
      href: "/admin/materias",
      action: "Revisar",
      done: withoutCover === 0,
    },
    {
      id: "textos-revisados",
      group: "Textos",
      title: "Revisar os textos das páginas",
      doneTitle: "Textos revisados no editor visual",
      hint: "Abra cada página no editor visual e ajuste a linguagem com a voz do centro.",
      href: "/?editar=1",
      action: "Abrir editor",
      done: customizedTexts > 0,
    },
  ];

  const done = tasks.filter((t) => t.done).length;
  return {
    tasks,
    done,
    total: tasks.length,
    percent: Math.round((done / tasks.length) * 100),
    published: published.length,
    drafts: drafts.length,
    customizedTexts,
    recentPosts: posts.slice(0, 4),
  };
}
