-- Blog posts table for GF Equoterapia
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  read_minutes integer not null default 1,
  cover_image text,
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx on public.posts (published, published_at desc);
create index if not exists posts_slug_idx on public.posts (slug);

alter table public.posts enable row level security;

-- Anyone can read published posts.
create policy "Public can read published posts"
  on public.posts for select
  using (published = true);

-- Only authenticated users (the admin) can manage posts.
create policy "Authenticated users can insert posts"
  on public.posts for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update posts"
  on public.posts for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete posts"
  on public.posts for delete
  to authenticated
  using (true);

-- Also allow authenticated users to read drafts (not just published).
create policy "Authenticated users can read all posts"
  on public.posts for select
  to authenticated
  using (true);

-- Storage bucket for cover images uploaded from the admin panel.
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Public can read post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Authenticated users can upload post images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

create policy "Authenticated users can update post images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images');

create policy "Authenticated users can delete post images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');

-- Seed with the three articles already published on the reference site.
insert into public.posts
  (slug, title, excerpt, content, category, read_minutes, featured, published, published_at)
values
(
  'cada-crianca-tem-seu-tempo',
  'Cada criança tem seu tempo. E esse tempo merece respeito.',
  'Um olhar atento para os pequenos passos, as descobertas e a singularidade de cada criança.',
  E'## O começo é a escuta\n\nAntes de qualquer expectativa, existe uma criança com sua própria maneira de sentir, se comunicar e conhecer o mundo. Acolher é dar espaço a essa individualidade e ouvir também quem compartilha sua rotina.\n\n## Pequenos passos também contam\n\nObservar o ambiente, aproximar-se com curiosidade ou expressar um limite são experiências que merecem atenção. Comparar percursos pode tirar o foco do que realmente importa: compreender a experiência daquela criança.\n\n## Uma conversa que continua em casa\n\nFamília e profissionais podem trocar observações sobre preferências, dúvidas e situações do cotidiano. Essa conversa ajuda a construir um acompanhamento atento, sem transformar cada encontro em uma cobrança por resultados.\n\n## Respeitar é caminhar junto\n\nO cuidado se revela na forma de convidar, esperar e acolher. Reconhecer o tempo de cada criança significa manter expectativas responsáveis e valorizar sua participação, com respeito e dignidade.\n\n*Este texto propõe reflexões gerais sobre acolhimento. Orientações para cada criança devem ser conversadas com os profissionais responsáveis por seu acompanhamento.*',
  'Acolhimento',
  3,
  true,
  true,
  now() - interval '3 days'
),
(
  'a-familia-tambem-faz-parte',
  'A família também faz parte desse caminho.',
  'Escuta, diálogo e presença para construir uma relação de confiança.',
  E'## Um lugar à mesa\n\nA família não observa de fora: ela caminha junto. Suas percepções sobre a rotina, as preferências e os pequenos avanços da criança são parte essencial do cuidado construído a cada encontro.\n\n## Perguntar também é cuidar\n\nDúvidas fazem parte do processo. Um espaço aberto para perguntas, trocas e observações fortalece a confiança entre família e equipe, e torna o acompanhamento mais completo.\n\n## Presença, não perfeição\n\nNão existe um jeito certo de acompanhar. Existe presença, disponibilidade para aprender junto e respeito pelo tempo de cada família se adaptar a essa nova rotina.\n\n## Uma rede de cuidado\n\nQuando a família se sente ouvida, a criança sente esse reflexo. Por isso, cada conversa é também uma oportunidade de fortalecer essa rede que sustenta o cuidado.\n\n*Este texto propõe reflexões gerais sobre o papel da família. Orientações específicas devem ser conversadas com os profissionais responsáveis pelo acompanhamento.*',
  'Família',
  2,
  false,
  true,
  now() - interval '7 days'
),
(
  'antes-de-tudo-um-encontro',
  'Antes de tudo, um encontro.',
  'A aproximação com o cavalo começa pelo respeito e pelo cuidado.',
  E'## Um primeiro olhar\n\nAntes de qualquer atividade, existe um encontro: entre a criança e o cavalo, entre o novo e o familiar. Esse momento inicial pede tempo, calma e respeito ao ritmo de cada um.\n\n## O cavalo como parceiro\n\nO cavalo participa desse processo como um parceiro sensível, que responde à presença e à confiança que se constrói aos poucos. Não há pressa: o vínculo se forma na repetição gentil dos encontros.\n\n## Segurança que acolhe\n\nCada aproximação é conduzida com atenção aos sinais da criança e do animal, priorizando sempre a segurança e o conforto de ambos antes de qualquer avanço.\n\n## Um vínculo que se constrói\n\nCom o tempo, a relação entre criança e cavalo se aprofunda, e esse vínculo se torna parte do que sustenta cada sessão: confiança mútua, presença e cuidado.\n\n*Este texto propõe reflexões gerais sobre o vínculo com o cavalo. Orientações específicas devem ser conversadas com os profissionais responsáveis pelo acompanhamento.*',
  'Vínculos',
  2,
  false,
  true,
  now() - interval '10 days'
)
on conflict (slug) do nothing;
