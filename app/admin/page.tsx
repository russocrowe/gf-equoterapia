import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";

const shortcuts = [
  {
    href: "/admin/centro",
    title: "Informações do centro",
    text: "Endereço, WhatsApp, e-mail, Instagram, CNPJ e horário.",
  },
  {
    href: "/admin/imagens",
    title: "Imagens do site",
    text: "Troque a foto principal e as imagens do site.",
  },
];

export default async function AdminOverviewPage() {
  await requireAdminPage("/admin");

  return (
    <div>
      <h1 className="text-[2.4rem]">
        Editar <em>site</em>
      </h1>
      <p className="mt-3 max-w-xl text-[15px]">
        Aqui você atualiza o conteúdo que aparece para as famílias. As
        mudanças entram no ar assim que você salva.
      </p>

      <div className="mt-14 grid gap-7 md:grid-cols-2">
        {shortcuts.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group border-t-2 border-sand pt-5"
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
