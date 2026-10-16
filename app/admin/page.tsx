import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function countRows(
  table: "posts" | "newsletter_subscribers",
  filter?: { column: string; value: boolean },
) {
  const supabase = await createClient();
  let query = supabase.from(table).select("id", { count: "exact", head: true });
  if (filter) query = query.eq(filter.column, filter.value);
  const { count } = await query;
  return count ?? 0;
}

const shortcuts = [
  {
    href: "/admin/materias",
    title: "Matérias",
    text: "Escreva, edite e publique as matérias do site.",
  },
  {
    href: "/admin/centro",
    title: "Informações do centro",
    text: "Endereço, WhatsApp, e-mail, Instagram, CNPJ e horário.",
  },
  {
    href: "/admin/imagens",
    title: "Imagens do site",
    text: "Troque a foto principal e as imagens padrão do site.",
  },
];

export default async function AdminOverviewPage() {
  await requireAdminPage("/admin");

  const [published, drafts, subscribers] = await Promise.all([
    countRows("posts", { column: "published", value: true }),
    countRows("posts", { column: "published", value: false }),
    countRows("newsletter_subscribers"),
  ]);

  const stats = [
    { label: "Matérias publicadas", value: published },
    { label: "Rascunhos", value: drafts },
    { label: "Inscritos na newsletter", value: subscribers },
  ];

  return (
    <div>
      <h1 className="text-[2.4rem]">
        Editar <em>site</em>
      </h1>
      <p className="mt-3 max-w-xl text-[15px]">
        Aqui você atualiza o conteúdo que aparece para as famílias. As
        mudanças entram no ar assim que você salva.
      </p>

      <div className="mt-10 grid gap-7 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border-t border-rule-strong pt-5">
            <p className="font-display text-[2.2rem] font-medium leading-none tracking-[-0.03em]">
              {stat.value}
            </p>
            <p className="mt-2 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-7 md:grid-cols-3">
        {shortcuts.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group border-t border-rule-strong pt-5"
          >
            <h2 className="text-[1.3rem] decoration-1 underline-offset-4 group-hover:underline">
              {item.title}
            </h2>
            <p className="mt-2 text-sm">{item.text}</p>
            <p className="mt-4 text-sm">Abrir ↗</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
