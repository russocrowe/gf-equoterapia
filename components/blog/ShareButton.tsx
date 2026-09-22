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
        // user cancelled or share failed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do silently
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full rounded-full border border-tinta/15 px-5 py-2.5 font-display text-sm font-semibold text-tinta transition-colors hover:border-azul hover:text-azul"
    >
      {copied ? "Link copiado!" : "↗ Compartilhar artigo"}
    </button>
  );
}
