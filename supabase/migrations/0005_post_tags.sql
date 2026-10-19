-- Tags (etiquetas) das matérias.
-- Seguro de rodar mais de uma vez; não altera nem apaga nada que já existe.

alter table public.posts
  add column if not exists tags text[] not null default '{}';

create index if not exists posts_tags_idx on public.posts using gin (tags);
