-- Login, perfis, papéis (admin), informações do centro e imagens do site.
-- Rode DEPOIS da 0001 e da 0002.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Perfis (um por usuário)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Perfis para quem já existia antes desta migration.
insert into public.profiles (user_id, full_name)
select id, coalesce(raw_user_meta_data ->> 'full_name', '')
from auth.users
on conflict (user_id) do nothing;

-- ---------------------------------------------------------------------------
-- Papéis: quem é admin pode editar o site
-- ---------------------------------------------------------------------------
create table if not exists public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

alter table public.user_roles enable row level security;

drop policy if exists "Users read own roles" on public.user_roles;
create policy "Users read own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Contas que já existem (hoje só a do responsável pelo site) viram admin.
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Fecha a brecha: só admin escreve em matérias e imagens de capa
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated users can insert posts" on public.posts;
drop policy if exists "Authenticated users can update posts" on public.posts;
drop policy if exists "Authenticated users can delete posts" on public.posts;
drop policy if exists "Authenticated users can read all posts" on public.posts;
drop policy if exists "Admins can insert posts" on public.posts;
drop policy if exists "Admins can update posts" on public.posts;
drop policy if exists "Admins can delete posts" on public.posts;
drop policy if exists "Admins can read all posts" on public.posts;

create policy "Admins can insert posts"
  on public.posts for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update posts"
  on public.posts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete posts"
  on public.posts for delete
  to authenticated
  using (public.is_admin());

create policy "Admins can read all posts"
  on public.posts for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Authenticated users can upload post images" on storage.objects;
drop policy if exists "Authenticated users can update post images" on storage.objects;
drop policy if exists "Authenticated users can delete post images" on storage.objects;
drop policy if exists "Admins can upload post images" on storage.objects;
drop policy if exists "Admins can update post images" on storage.objects;
drop policy if exists "Admins can delete post images" on storage.objects;

create policy "Admins can upload post images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images' and public.is_admin());

create policy "Admins can update post images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images' and public.is_admin());

create policy "Admins can delete post images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images' and public.is_admin());

do $$
begin
  if to_regclass('public.newsletter_subscribers') is not null then
    drop policy if exists "Authenticated users can read subscribers" on public.newsletter_subscribers;
    drop policy if exists "Admins can read subscribers" on public.newsletter_subscribers;
    create policy "Admins can read subscribers"
      on public.newsletter_subscribers for select
      to authenticated
      using (public.is_admin());
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Informações do centro (endereço, WhatsApp, etc.)
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings"
  on public.site_settings for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
  on public.site_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete site settings" on public.site_settings;
create policy "Admins can delete site settings"
  on public.site_settings for delete
  to authenticated
  using (public.is_admin());

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (key, value)
values (
  'center',
  jsonb_build_object(
    'address', '[ENDEREÇO COMPLETO]',
    'city', '[CIDADE – UF]',
    'whatsapp', '[TELEFONE]',
    'email', '[E-MAIL]',
    'instagram', '[INSTAGRAM]',
    'cnpj', '[00.000.000/0000-00]',
    'hours', '[HORÁRIO DE ATENDIMENTO]'
  )
)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Imagens do site (trocadas pelo painel)
-- ---------------------------------------------------------------------------
create table if not exists public.site_images (
  key text primary key,
  label text not null,
  description text,
  url text not null default '',
  alt text not null default '',
  caption text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_images enable row level security;

drop policy if exists "Public can read site images" on public.site_images;
create policy "Public can read site images"
  on public.site_images for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert site images" on public.site_images;
create policy "Admins can insert site images"
  on public.site_images for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update site images" on public.site_images;
create policy "Admins can update site images"
  on public.site_images for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete site images" on public.site_images;
create policy "Admins can delete site images"
  on public.site_images for delete
  to authenticated
  using (public.is_admin());

drop trigger if exists set_site_images_updated_at on public.site_images;
create trigger set_site_images_updated_at
  before update on public.site_images
  for each row execute function public.set_updated_at();

insert into public.site_images (key, label, description, alt, caption)
values
  (
    'hero',
    'Foto principal (início e Equoterapia)',
    'Aparece no topo da página inicial e da página Equoterapia.',
    'Cena ilustrativa de uma criança de capacete ao lado de um cavalo, acompanhada por uma adulta',
    'Imagem ilustrativa'
  ),
  (
    'sobre',
    'Foto da página Sobre nós',
    'Aparece ao lado de "O que orienta nosso cuidado".',
    'Cena ilustrativa de aproximação entre criança e cavalo com acompanhamento',
    'Imagem ilustrativa'
  ),
  (
    'materia_padrao',
    'Capa padrão das matérias',
    'Usada quando uma matéria não tem imagem de capa própria.',
    'Imagem ilustrativa de aproximação entre criança e cavalo',
    ''
  )
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Buckets de arquivos: fotos de perfil e imagens do site
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('site-images', 'site-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read avatars" on storage.objects;
create policy "Public can read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Public can read site images files" on storage.objects;
create policy "Public can read site images files"
  on storage.objects for select
  using (bucket_id = 'site-images');

drop policy if exists "Admins upload site images files" on storage.objects;
create policy "Admins upload site images files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins update site images files" on storage.objects;
create policy "Admins update site images files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());

drop policy if exists "Admins delete site images files" on storage.objects;
create policy "Admins delete site images files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-images' and public.is_admin());
