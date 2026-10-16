"use client";

import { useActionState, useState } from "react";
import { saveCenterInfoAction, type FormState } from "@/app/admin/actions";
import { filledValue, type CenterInfo } from "@/lib/site-config";

const label = "flex flex-col gap-1.5 text-sm font-semibold text-ink";
const hint = "text-xs font-normal text-muted";

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function maskPhone(value: string) {
  const d = digits(value).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCnpj(value: string) {
  const d = digits(value).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function validCnpj(value: string) {
  const d = digits(value);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (length: number) => {
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += Number(d[length - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result;
  };
  return calc(12) === Number(d[12]) && calc(13) === Number(d[13]);
}

// Aceita "@perfil", "perfil" ou o endereço completo do Instagram.
function normalizeInstagram(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/[/?#].*$/, "")
    .replace(/^@/, "");
}

type Fields = {
  address: string;
  city: string;
  whatsapp: string;
  email: string;
  instagram: string;
  cnpj: string;
  hours: string;
};

export default function CenterForm({ initial }: { initial: CenterInfo }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveCenterInfoAction,
    null,
  );

  // Textos entre colchetes ("[TELEFONE]") eram só avisos: o campo começa vazio.
  const [fields, setFields] = useState<Fields>({
    address: filledValue(initial.address),
    city: filledValue(initial.city),
    whatsapp: filledValue(initial.whatsapp),
    email: filledValue(initial.email),
    instagram: filledValue(initial.instagram),
    cnpj: filledValue(initial.cnpj),
    hours: filledValue(initial.hours),
  });
  const set = (key: keyof Fields, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const phoneDigits = digits(fields.whatsapp).length;
  const phoneWarn = fields.whatsapp !== "" && phoneDigits < 10;
  const emailWarn = fields.email !== "" && !/^\S+@\S+\.\S+$/.test(fields.email);
  const cnpjWarn =
    digits(fields.cnpj).length === 14 && !validCnpj(fields.cnpj);

  const preview = [
    [fields.address, fields.city].filter(Boolean).join(" · "),
    fields.whatsapp && `WhatsApp ${fields.whatsapp}`,
    fields.email,
    fields.instagram && `@${normalizeInstagram(fields.instagram)}`,
    fields.hours,
  ].filter(Boolean) as string[];

  return (
    <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
      <form action={formAction} className="flex max-w-2xl flex-col gap-6">
        <label className={label}>
          Endereço completo
          <input
            name="address"
            value={fields.address}
            onChange={(e) => set("address", e.target.value)}
            autoComplete="off"
            placeholder="Rua, número, bairro"
            className="field"
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={label}>
            Cidade – UF
            <input
              name="city"
              value={fields.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Ex.: Campinas – SP"
              className="field"
            />
            <span className={hint}>Aparece no título do site no Google.</span>
          </label>
          <label className={label}>
            WhatsApp
            <input
              name="whatsapp"
              value={fields.whatsapp}
              onChange={(e) => set("whatsapp", maskPhone(e.target.value))}
              placeholder="(11) 99999-0000"
              inputMode="tel"
              className="field"
              aria-invalid={phoneWarn}
            />
            <span className={phoneWarn ? "text-xs text-red-800" : hint}>
              {phoneWarn
                ? "Faltam dígitos: use o DDD + número."
                : "Com DDD. O botão “Falar no WhatsApp” abre esta conversa."}
            </span>
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={label}>
            E-mail
            <input
              name="email"
              value={fields.email}
              onChange={(e) => set("email", e.target.value.trim())}
              inputMode="email"
              autoComplete="off"
              placeholder="contato@seudominio.com.br"
              className="field"
              aria-invalid={emailWarn}
            />
            {emailWarn && (
              <span className="text-xs text-red-800">
                Esse e-mail não parece completo.
              </span>
            )}
          </label>
          <label className={label}>
            Instagram
            <input
              name="instagram"
              value={fields.instagram}
              onChange={(e) => set("instagram", e.target.value)}
              onBlur={(e) => set("instagram", normalizeInstagram(e.target.value))}
              placeholder="nomedoperfil"
              className="field"
            />
            <span className={hint}>
              Pode colar o link do perfil: a gente deixa só o nome.
            </span>
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className={label}>
            CNPJ
            <input
              name="cnpj"
              value={fields.cnpj}
              onChange={(e) => set("cnpj", maskCnpj(e.target.value))}
              placeholder="00.000.000/0000-00"
              inputMode="numeric"
              className="field"
              aria-invalid={cnpjWarn}
            />
            {cnpjWarn && (
              <span className="text-xs text-red-800">
                Esse CNPJ não confere. Revise os números.
              </span>
            )}
          </label>
          <label className={label}>
            Horário de atendimento
            <input
              name="hours"
              value={fields.hours}
              onChange={(e) => set("hours", e.target.value)}
              placeholder="Seg a sex, 8h às 18h"
              className="field"
            />
          </label>
        </div>

        <p className="text-xs text-muted">
          Campos em branco deixam de aparecer no site.
        </p>

        {state && (
          <p
            role={state.ok ? "status" : "alert"}
            className={`rounded-xl border px-4 py-3 text-sm ${
              state.ok
                ? "border-forest/30 bg-sage-soft text-forest"
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

      {/* Como aparece no site */}
      <aside className="on-dark rounded-3xl bg-forest-deep p-7 text-white xl:sticky xl:top-40">
        <p className="eyebrow">Como aparece no rodapé</p>
        <p className="tagline mt-5 text-[1.5rem] leading-none">Cuidando de Vidas</p>
        <div className="mt-5 flex flex-col gap-2 text-[14px] text-white/85">
          {preview.length > 0 ? (
            preview.map((line) => <span key={line}>{line}</span>)
          ) : (
            <span className="text-white/60">
              Preencha os campos e veja aqui o resultado.
            </span>
          )}
        </div>
        {fields.cnpj && (
          <p className="mt-5 border-t border-white/15 pt-4 text-[13px] text-white/75">
            © {new Date().getFullYear()} Centro de Equoterapia GF · CNPJ{" "}
            {fields.cnpj}
          </p>
        )}
      </aside>
    </div>
  );
}
