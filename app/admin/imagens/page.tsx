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

  const rows = (data ?? []) as SiteImageRow[];

  return (
    <div>
      <p className="eyebrow">Conteúdo</p>
      <h1 className="mt-4 text-[clamp(2rem,1.4rem+2vw,2.8rem)]">
        Imagens do <em>site</em>
      </h1>
      <p className="mb-10 mt-4 max-w-xl text-[15.5px] text-muted">
        Envie as fotos que aparecem nas páginas. A troca entra no ar assim que
        a imagem é enviada.
      </p>

      <div className="flex flex-col gap-10">
        {rows.map((row) => (
          <SiteImageEditor key={row.key} row={row} />
        ))}
        {rows.length === 0 && (
          <p className="card p-6 text-sm text-muted">
            Nenhuma imagem configurável encontrada. Confira se a migration
            0003 foi aplicada no Supabase.
          </p>
        )}
      </div>
    </div>
  );
}
