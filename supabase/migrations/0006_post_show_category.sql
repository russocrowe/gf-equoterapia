-- Permite esconder a categoria de uma matéria no site.
-- Seguro de rodar mais de uma vez. As matérias que já existem continuam
-- mostrando a categoria (valor padrão: verdadeiro); nada é apagado.

alter table public.posts
  add column if not exists show_category boolean not null default true;
