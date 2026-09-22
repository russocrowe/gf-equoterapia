-- Author/reviewer bylines for blog posts (used by the new article template)
alter table public.posts add column if not exists author_name text;
alter table public.posts add column if not exists author_role text;
alter table public.posts add column if not exists reviewed_by text;
alter table public.posts add column if not exists reviewed_role text;

-- Re-tag the existing seed posts into the categories used by the new blog design.
update public.posts set category = 'Guia para famílias' where slug = 'cada-crianca-tem-seu-tempo';
update public.posts set category = 'Bastidores do centro' where slug = 'a-familia-tambem-faz-parte';
update public.posts set category = 'Equoterapia' where slug = 'antes-de-tudo-um-encontro';

-- Newsletter signups from the blog page.
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
