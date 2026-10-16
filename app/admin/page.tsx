import Link from "next/link";
import { hasMfa, requireAdminPage } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { getSiteHealth, type HealthTask } from "@/lib/site-health";
import { createClient } from "@/lib/supabase/server";

const canvasPages = [
  {
    href: "/?editar=1",
    title: "Início",
    text: "Abertura, apresentação do centro e destaque das matérias.",
  },
  {
    href: "/sobre?editar=1",
    title: "Sobre nós",
    text: "Princípios de cuidado e a foto da equipe.",
  },
  {
    href: "/equoterapia?editar=1",
    title: "Equoterapia",
    text: "Título e apresentação da página de matérias.",
  },
];

function ProgressRing({ percent }: { percent: number }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative h-[116px] w-[116px] shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--sage-soft)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--forest)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-[1.6rem] font-bold tracking-tight text-ink">
        {percent}%
      </span>
    </div>
  );
}

function TaskRow({ task }: { task: HealthTask }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-4 border-t border-rule py-4 first:border-t-0">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gold-ink">
          {task.group}
        </p>
        <p className="mt-1 font-display text-[1.02rem] font-semibold leading-snug text-ink">
          {task.title}
        </p>
        <p className="mt-0.5 text-[14px] text-muted">{task.hint}</p>
      </div>
      <Link href={task.href} className="btn btn-outline !px-5 !py-2 text-[13.5px]">
        {task.action}
      </Link>
    </li>
  );
}

export default async function AdminOverviewPage() {
  const user = await requireAdminPage("/admin");
  const supabase = await createClient();

  const [health, profile] = await Promise.all([
    getSiteHealth({ mfaEnabled: hasMfa(user) }),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const name =
    profile.data?.full_name?.trim().split(" ")[0] ||
    user.email?.split("@")[0] ||
    "";
  const pending = health.tasks.filter((t) => !t.done);
  const finished = health.tasks.filter((t) => t.done);
  const first = pending[0];

  return (
    <div className="flex flex-col gap-12">
      <header>
        <p className="eyebrow">Painel</p>
        <h1 className="mt-4 text-[clamp(2rem,1.4rem+2vw,2.8rem)]">
          Olá{name ? `, ${name}` : ""}. <em>Vamos cuidar do site?</em>
        </h1>
      </header>

      {/* Situação do site */}
      <section className="card flex flex-col items-start gap-7 p-7 sm:flex-row sm:items-center md:p-9">
        <ProgressRing percent={health.percent} />
        <div className="min-w-0">
          <h2 className="text-[1.5rem]">
            {health.percent === 100
              ? "Seu site está completo."
              : `Seu site está ${health.percent}% pronto.`}
          </h2>
          <p className="mt-2 max-w-xl text-[15.5px] text-muted">
            {pending.length === 0
              ? "Tudo preenchido. Continue publicando matérias e revisando os textos de vez em quando."
              : `Faltam ${pending.length} ${pending.length === 1 ? "passo" : "passos"} para o site passar mais confiança aos visitantes. Comece pelo próximo da lista.`}
          </p>
          {first && (
            <Link href={first.href} className="btn btn-primary mt-5">
              {first.title} <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </section>

      {/* Editor visual */}
      <section aria-labelledby="canvas-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <h2 id="canvas-title" className="text-[1.5rem]">
            Editar direto na página
          </h2>
          <p className="text-[14px] text-muted">
            Clique em qualquer texto ou foto e escreva. O que você vê é o que
            os visitantes verão.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {canvasPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="card card-hover group flex flex-col p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-forest">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
                  <path d="m14 7 3 3" />
                </svg>
              </span>
              <h3 className="mt-5 text-[1.2rem]">{page.title}</h3>
              <p className="mt-2 text-[14.5px] text-muted">{page.text}</p>
              <p className="mt-auto pt-5 text-[13.5px] font-semibold text-navy">
                <span className="underline decoration-gold decoration-2 underline-offset-4">
                  Abrir no editor
                </span>{" "}
                <span aria-hidden>→</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Próximos passos */}
      <section aria-labelledby="steps-title">
        <h2 id="steps-title" className="mb-5 text-[1.5rem]">
          Próximos passos
        </h2>
        {pending.length > 0 ? (
          <ul className="card px-6 py-2 md:px-8">
            {pending.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </ul>
        ) : (
          <p className="card p-6 text-[15px] text-muted">
            Nada pendente por aqui. Bom trabalho!
          </p>
        )}

        {finished.length > 0 && (
          <details className="mt-4 text-[14.5px]">
            <summary className="cursor-pointer font-semibold text-navy">
              {finished.length} {finished.length === 1 ? "item concluído" : "itens concluídos"}
            </summary>
            <ul className="mt-3 flex flex-col gap-2 text-muted">
              {finished.map((task) => (
                <li key={task.id} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="flex h-4 w-4 items-center justify-center rounded-full bg-forest text-white"
                  >
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6.2 5 8.6l4.5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {task.doneTitle}
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      {/* Matérias */}
      <section aria-labelledby="posts-title" className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="card p-6 md:p-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 id="posts-title" className="text-[1.5rem]">
              Últimas matérias
            </h2>
            <Link href="/admin/materias/nova" className="btn btn-outline !px-5 !py-2 text-[13.5px]">
              Nova matéria
            </Link>
          </div>
          {health.recentPosts.length > 0 ? (
            <ul>
              {health.recentPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-t border-rule py-3.5 first:border-t-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-[1rem] font-semibold text-ink">
                      {post.title}
                    </p>
                    <p className="text-[13px] text-muted">
                      {post.published ? "Publicada" : "Rascunho"}
                      {post.published_at ? ` · ${formatDate(post.published_at)}` : ""}
                    </p>
                  </div>
                  <Link href={`/admin/materias/${post.id}`} className="link-arrow !text-[13.5px]">
                    Editar
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[15px] text-muted">Nenhuma matéria ainda.</p>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          {[
            { label: "Publicadas", value: health.published },
            { label: "Rascunhos", value: health.drafts },
            { label: "Textos personalizados", value: health.customizedTexts },
          ].map((stat) => (
            <div key={stat.label} className="card px-5 py-4">
              <dd className="font-display text-[2rem] font-bold leading-none tracking-tight text-ink">
                {stat.value}
              </dd>
              <dt className="mt-1.5 text-[13px] text-muted">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
