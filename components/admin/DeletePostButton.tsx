"use client";

import { useTransition } from "react";
import { deletePostAction } from "@/app/admin/actions";

export default function DeletePostButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (
          confirm(`Excluir a matéria "${title}"? Essa ação não pode ser desfeita.`)
        ) {
          startTransition(() => deletePostAction(id));
        }
      }}
      className="link-arrow text-red-800 disabled:opacity-50"
    >
      {isPending ? "Excluindo…" : "Excluir"}
    </button>
  );
}
