"use client";

import { useActionState } from "react";
import { saveCenterInfoAction, type FormState } from "@/app/admin/actions";
import type { CenterInfo } from "@/lib/site-config";

const label = "flex flex-col gap-1.5 text-sm font-medium";
const hint = "text-xs font-normal";

export default function CenterForm({ initial }: { initial: CenterInfo }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveCenterInfoAction,
    null,
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <label className={label}>
        Endereço completo
        <input
          name="address"
          defaultValue={initial.address}
          autoComplete="off"
          className="field"
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          Cidade – UF
          <input
            name="city"
            defaultValue={initial.city}
            placeholder="Ex.: Campinas – SP"
            className="field"
          />
          <span className={hint}>Aparece no título do site no Google.</span>
        </label>
        <label className={label}>
          WhatsApp
          <input
            name="whatsapp"
            defaultValue={initial.whatsapp}
            placeholder="(11) 99999-0000"
            inputMode="tel"
            className="field"
          />
          <span className={hint}>
            Com DDD. Os botões &ldquo;Agendar avaliação&rdquo; abrem esta conversa.
          </span>
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          E-mail
          <input
            name="email"
            defaultValue={initial.email}
            inputMode="email"
            className="field"
          />
        </label>
        <label className={label}>
          Instagram
          <input
            name="instagram"
            defaultValue={initial.instagram}
            placeholder="nomedoperfil"
            className="field"
          />
          <span className={hint}>Só o nome do perfil, sem o @.</span>
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className={label}>
          CNPJ
          <input
            name="cnpj"
            defaultValue={initial.cnpj}
            placeholder="00.000.000/0000-00"
            className="field"
          />
        </label>
        <label className={label}>
          Horário de atendimento
          <input
            name="hours"
            defaultValue={initial.hours}
            placeholder="Seg a sex, 8h às 18h"
            className="field"
          />
        </label>
      </div>

      <p className="text-xs">
        Campos que ficarem em branco deixam de aparecer no site. Textos entre
        colchetes, como [TELEFONE], são avisos de que ainda falta preencher.
      </p>

      {state && (
        <p
          role={state.ok ? "status" : "alert"}
          className={`rounded-md border px-4 py-3 text-sm ${
            state.ok
              ? "border-rule-strong bg-mist"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primary self-start disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Salvar informações"}
      </button>
    </form>
  );
}
