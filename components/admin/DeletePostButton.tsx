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
        if (confirm(`Excluir o artigo "${title}"? Essa ação não pode ser desfeita.`)) {
          startTransition(() => deletePostAction(id));
        }
      }}
      className="font-display font-medium text-red-700 underline decoration-2 underline-offset-4 disabled:opacity-50"
    >
      {isPending ? "Excluindo…" : "Excluir"}
    </button>
  );
}
