-- Author/reviewer bylines for blog posts (used by the article template)
alter table public.posts add column if not exists author_name text;
alter table public.posts add column if not exists author_role text;
alter table public.posts add column if not exists reviewed_by text;
alter table public.posts add column if not exists reviewed_role text;

-- Align the seed articles with the published reference site: same dates and
-- the original article texts for "Família" and "Vínculos".
update public.posts
  set published_at = '2026-09-22 12:00:00-03'
  where slug = 'cada-crianca-tem-seu-tempo';

update public.posts
  set published_at = '2026-09-21 12:00:00-03',
      read_minutes = 2,
      content = E'## Há espaço para suas perguntas\n\nConhecer um novo ambiente pode trazer dúvidas para toda a família. Perguntar sobre a rotina, os profissionais e a organização do atendimento é parte de uma aproximação cuidadosa.\n\n## Compartilhar o cotidiano\n\nAs preferências da criança, suas formas de comunicação e aquilo que costuma deixá-la confortável são informações importantes para compartilhar com a equipe. Cada observação pode ampliar a compreensão sobre ela.\n\n## Construir confiança aos poucos\n\nUma relação de confiança se sustenta em conversas claras e expectativas alinhadas. A família precisa ter espaço para falar, ouvir e compreender as orientações específicas do acompanhamento.\n\n*Este texto propõe reflexões gerais sobre acolhimento. Orientações para cada criança devem ser conversadas com os profissionais responsáveis por seu acompanhamento.*'
  where slug = 'a-familia-tambem-faz-parte';

update public.posts
  set published_at = '2026-09-20 12:00:00-03',
      read_minutes = 2,
      content = E'## Conhecer antes de se aproximar\n\nO cavalo é um ser vivo, com necessidades e limites. Conhecer sua presença e observar o ambiente, com orientação profissional, faz parte de uma relação respeitosa.\n\n## Cuidado com todos os envolvidos\n\nA atenção à criança precisa caminhar junto ao bem-estar do animal e à segurança do ambiente. Aproximações e atividades devem acontecer conforme a orientação da equipe responsável.\n\n## Sem pressa para criar vínculos\n\nCada pessoa pode reagir de uma maneira à presença do cavalo. Curiosidade, receio ou vontade de observar merecem acolhimento, sem forçar interações e sem antecipar resultados.\n\n*Este texto propõe reflexões gerais sobre acolhimento. Orientações para cada criança devem ser conversadas com os profissionais responsáveis por seu acompanhamento.*'
  where slug = 'antes-de-tudo-um-encontro';

-- Newsletter signups from the articles page.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe to the newsletter"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

create policy "Authenticated users can read subscribers"
  on public.newsletter_subscribers for select
  to authenticated
  using (true);
