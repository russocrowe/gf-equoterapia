// Textos do site que podem ser editados direto na página (modo "canvas").
// O que o painel salva no banco sobrescreve estes valores; o que não foi
// editado continua vindo daqui. Use *<em>…</em>* para o trecho em itálico.

export const contentDefaults = {
  // Início
  "home.hero.eyebrow": "Centro de Equoterapia GF",
  "home.hero.title":
    "Equoterapia que respeita cada pessoa, <em>seu tempo e seu desenvolvimento.</em>",
  "home.hero.text":
    "No Centro de Equoterapia GF, o cavalo é parte de uma abordagem terapêutica individualizada, conduzida por uma equipe preparada para acompanhar cada praticante com cuidado, segurança e acolhimento.",
  "home.hero.cta": "Saiba mais",
  "home.trust.1": "Equipe multiprofissional",
  "home.trust.2": "Método reconhecido pela Lei nº 13.830/2019",
  "home.trust.3": "Atendimento para todas as idades",

  "home.about.eyebrow": "Sobre o GF",
  "home.about.title":
    "Um espaço onde o cuidado acontece <em>a passo de cavalo.</em>",
  "home.pillar.1.title": "Equipe multiprofissional",
  "home.pillar.1.text": "Profissionais preparados para atuar de forma integrada.",
  "home.pillar.2.title": "Atendimento individualizado",
  "home.pillar.2.text":
    "Cada praticante possui necessidades, objetivos e características próprias.",
  "home.pillar.3.title": "Cavalos preparados",
  "home.pillar.3.text":
    "Animais selecionados e acompanhados para fazer parte do processo terapêutico.",
  "home.pillar.4.title": "Ambiente acolhedor",
  "home.pillar.4.text": "Um espaço pensado para praticantes e famílias.",

  "home.posts.title": "Tudo sobre <em>EQUOTERAPIA</em>",
  "home.posts.link": "Ver todas as matérias",

  // Sobre nós
  "sobre.eyebrow": "Sobre a GF Equoterapia",
  "sobre.title": "Um olhar atento.<br>Um cuidado <em>por inteiro.</em>",
  "sobre.intro":
    "Acreditamos que acolher começa por conhecer a pessoa, respeitar sua história e construir uma relação de confiança com sua família.",
  "sobre.principles.title": "O que orienta nosso cuidado",
  "sobre.principle.1.title": "A criança no centro",
  "sobre.principle.1.text":
    "Olhar para além das expectativas e reconhecer a singularidade, as preferências e os limites de cada criança.",
  "sobre.principle.2.title": "Diálogo com a família",
  "sobre.principle.2.text":
    "Valorizar quem está presente no dia a dia e abrir espaço para perguntas, escuta e troca de experiências.",
  "sobre.principle.3.title": "Respeito em cada encontro",
  "sobre.principle.3.text":
    "Cuidar da relação com as pessoas, com os cavalos e com o ambiente, com atenção e responsabilidade.",
  "sobre.band.title": "Conhecimento também <em>é uma forma de cuidar.</em>",
  "sobre.band.text":
    "Nosso blog reúne reflexões sobre acolhimento, família e vínculos para tornar essa conversa mais próxima e acessível.",
  "sobre.band.link": "Explore as matérias de Equoterapia",

  // Equoterapia
  "equo.eyebrow": "Equoterapia",
  "equo.title": "Tudo sobre <em>Equoterapia.</em>",
  "equo.intro":
    "Matérias sobre cuidado, acolhimento e os vínculos que fazem parte desse caminho.",
  "equo.all.title": "Para ler com calma",

  // Rodapé (aparece em todas as páginas)
  "footer.slogan": "Cuidando de Vidas",
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
