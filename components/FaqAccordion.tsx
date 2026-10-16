"use client";

import { useState } from "react";

export type FaqItem = { question: string; answer: string };

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y divide-rule-strong border-y border-rule-strong">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg font-medium tracking-[-0.02em]"
            >
              {item.question}
              <span aria-hidden className="shrink-0 text-xl text-forest">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && <p className="max-w-3xl pb-5 text-[15px]">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
