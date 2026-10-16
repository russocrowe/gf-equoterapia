import SiteImageEditor, {
  type SiteImageRow,
} from "@/components/admin/SiteImageEditor";
import { requireAdminPage } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminImagesPage() {
  await requireAdminPage("/admin/imagens");

  const supabase = await createClient();
  const { data } = await supabase
    .from("site_images")
    .select("key, label, description, url, alt, caption")
    .order("key");

  // A capa padrão das matérias fica oculta: o site não tem mais a página de matérias.
  const rows = ((data ?? []) as SiteImageRow[]).filter(
    (row) => row.key !== "materia_padrao",
  );

  return (
    <div>
      <h1 className="text-[2.4rem]">
        Imagens do <em>site</em>
      </h1>
      <p className="mb-9 mt-3 max-w-xl text-[15px]">
        Envie as fotos que aparecem nas páginas. A troca entra no ar assim que
        a imagem é enviada.
      </p>

      <div className="flex flex-col gap-10">
        {rows.map((row) => (
          <SiteImageEditor key={row.key} row={row} />
        ))}
        {rows.length === 0 && (
          <p className="border-t border-rule-strong pt-5 text-sm">
            Nenhuma imagem configurável encontrada. Confira se a migration
            0003 foi aplicada no Supabase.
          </p>
        )}
      </div>
    </div>
  );
}
