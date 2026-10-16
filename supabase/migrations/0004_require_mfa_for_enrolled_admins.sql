-- Verificação em duas etapas (TOTP) para administradores.
--
-- Quem já ativou o aplicativo autenticador só é considerado admin quando a
-- sessão passou pelo código de 6 dígitos (aal2). Assim, mesmo que alguém
-- descubra a senha de um admin, o banco recusa edições sem o código, ainda
-- que o código do site fosse contornado.
--
-- Quem ainda NÃO ativou continua como antes: nada muda para essas contas até
-- elas ativarem (o site avisa no painel). Quando todos tiverem ativado, dá para
-- tornar obrigatório removendo a linha "or not exists (...)" abaixo.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
    and (
      coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
      or not exists (
        select 1 from auth.mfa_factors
        where user_id = auth.uid() and status = 'verified'
      )
    );
$$;

grant execute on function public.is_admin() to anon, authenticated;
