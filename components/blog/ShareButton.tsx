"use client";

import { useState } from "react";

export default function ShareButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // cancelado ou indisponível — cai para copiar o link
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="btn btn-outline w-full justify-center"
    >
      {copied ? "Link copiado!" : "Compartilhar ↗"}
    </button>
  );
}
