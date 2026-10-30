// Textos do site que podem ser editados direto na página (modo "canvas").
// O que o painel salva no banco sobrescreve estes valores; o que não foi
// editado continua vindo daqui. Use *<em>…</em>* para o trecho em itálico.

export const contentDefaults = {
  // Início
  "home.hero.eyebrow": "Centro de Equoterapia GF",
  // Chave nova: a antiga (home.hero.title) tinha um texto salvo sem as cores.
  "home.hero.headline":
    "Equoterapia: <em>onde o cuidado encontra a força do cavalo.</em>",
  "home.hero.text":
    "No Centro de Equoterapia GF, cada praticante é acolhido em sua individualidade. Com uma equipe interdisciplinar, o cavalo participa de um trabalho terapêutico que valoriza o desenvolvimento, os vínculos e as possibilidades de cada pessoa.",
  "home.hero.cta": "Saiba mais",
  "home.hero.cta2": "Ler os artigos",
  "home.trust.1": "Equipe interdisciplinar especializada",
  "home.trust.2": "Método reconhecido pela Lei nº 13.830/2019",
  "home.trust.3": "Cuidado individualizado em todas as idades",

  "home.about.eyebrow": "Sobre o GF",

  // Texto compartilhado: aparece em "Sobre o GF" (início) e na página Sobre nós.
  "about.title": "Um espaço onde o cuidado acontece <em>a passo de cavalo.</em>",
  "about.text":
    "No Centro de Equoterapia GF, o cuidado vai além de cada sessão. Está na atenção aos detalhes, no respeito à individualidade e na construção de vínculos entre praticantes, profissionais e cavalos. Cada pessoa é acolhida com sua própria história, suas necessidades e possibilidades, em um ambiente que valoriza o desenvolvimento humano, a segurança e o bem-estar.",
  "about.pillar.1.title": "Equipe interdisciplinar",
  "about.pillar.1.text":
    "Profissionais de diferentes áreas que atuam de forma integrada, unindo conhecimentos para um acompanhamento responsável e individualizado.",
  "about.pillar.2.title": "Atendimento individualizado",
  "about.pillar.2.text":
    "Cada praticante possui sua própria história, necessidades e objetivos. Por isso, as sessões são planejadas respeitando seu ritmo e suas possibilidades.",
  "about.pillar.3.title": "Cavalos preparados",
  "about.pillar.3.text":
    "Cavalos selecionados, treinados e acompanhados para participar das sessões, com atenção à segurança, ao manejo adequado e ao bem-estar animal.",
  "about.pillar.4.title": "Ambiente acolhedor",
  "about.pillar.4.text":
    "Um espaço de cuidado, convivência e conexão com a natureza, onde praticantes e famílias são recebidos com respeito, atenção e sensibilidade.",

  "home.posts.eyebrow": "Blog",
  "home.posts.title": "Conhecimento que aproxima pessoas <em>da Equoterapia</em>",
  "home.posts.text":
    "Um espaço dedicado à informação e ao conhecimento sobre Equoterapia. Conheça seus fundamentos, como funciona, o papel do cavalo e os diferentes temas relacionados à saúde, ao desenvolvimento humano e ao bem-estar, por meio de conteúdos educativos, acessíveis e responsáveis.",
  "home.posts.link": "Ver todos os artigos",

  // Sobre nós
  "sobre.eyebrow": "Sobre a GF Equoterapia",
  "sobre.band.title": "Conhecimento também <em>é uma forma de cuidar.</em>",
  "sobre.band.text":
    "Conheça conteúdos sobre Equoterapia, seus fundamentos, o papel do cavalo e temas relacionados à saúde, ao desenvolvimento humano e ao bem-estar, apresentados de forma acessível e responsável.",
  "sobre.band.link": "Explore nosso Blog",

  // Equoterapia
  "equo.eyebrow": "Blog",
  "equo.title": "Equoterapia: <em>conhecimento, ciência e cuidado.</em>",
  "equo.intro":
    "Um espaço dedicado a ampliar o conhecimento sobre Equoterapia. Explore conteúdos sobre seus fundamentos, o papel do cavalo, a atuação interdisciplinar e temas relacionados à saúde, à reabilitação, ao desenvolvimento humano e ao bem-estar. Informações acessíveis e responsáveis para aproximar a sociedade dessa abordagem terapêutica.",
  "equo.all.title": "Explore nossos artigos",

  // Rodapé (aparece em todas as páginas)
  "footer.slogan": "Cuidando de Vidas",
  "footer.partners": "Filiações e parcerias",
  "footer.tagline": "Cuidado, segurança e acolhimento a cada passo.",
} as const;

export type ContentKey = keyof typeof contentDefaults;

export const contentKeys = Object.keys(contentDefaults) as ContentKey[];

export function isContentKey(key: string): key is ContentKey {
  return key in contentDefaults;
}

export const MAX_CONTENT_LENGTH = 700;

// Páginas que o modo canvas sabe editar (rota -> rótulo).
export const editablePages = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/equoterapia", label: "Equoterapia" },
] as const;
