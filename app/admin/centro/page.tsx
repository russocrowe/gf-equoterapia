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
      <h1 className="text-[2.4rem]">
        Informações do <em>centro</em>
      </h1>
      <p className="mb-9 mt-3 max-w-xl text-[15px]">
        Esses dados aparecem no rodapé, na página de contato, nos botões de
        WhatsApp e nas informações que o Google lê sobre o centro.
      </p>
      <CenterForm initial={initial} />
    </div>
  );
}
