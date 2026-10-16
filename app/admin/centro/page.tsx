import CenterForm from "@/components/admin/CenterForm";
import { requireAdminPage } from "@/lib/auth";
import {
  centerInfoKeys,
  defaultCenterInfo,
  type CenterInfo,
} from "@/lib/site-config";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCenterPage() {
  await requireAdminPage("/admin/centro");

  // Lê direto do banco (sem cache) para o formulário mostrar o valor salvo.
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "center")
    .maybeSingle();

  const stored = (data?.value ?? {}) as Record<string, unknown>;
  const initial: CenterInfo = { ...defaultCenterInfo };
  for (const key of centerInfoKeys) {
    const value = stored[key];
    if (typeof value === "string") initial[key] = value;
  }

  return (
    <div>
      <p className="eyebrow">Configurações</p>
      <h1 className="mt-4 text-[clamp(2rem,1.4rem+2vw,2.8rem)]">
        Informações do <em>centro</em>
      </h1>
      <p className="mb-10 mt-4 max-w-xl text-[15.5px] text-muted">
        Esses dados aparecem no rodapé, nos botões de WhatsApp e nas
        informações que o Google lê sobre o centro. Campos em branco ficam
        escondidos.
      </p>
      <CenterForm initial={initial} />
    </div>
  );
}
