// Texto editável do site: só aceita itálico (<em>) e quebra de linha (<br>).
// Todo o resto é escapado, então nada de script/HTML solto chega à página.

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

function decode(text: string) {
  return text
    .replace(/&(amp|lt|gt|quot|nbsp|#39);/g, (m) => ENTITIES[m] ?? m)
    .replace(/ /g, " ");
}

function escape(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const TAG = /<\/?(?:em|i)\s*>|<br\s*\/?>/gi;

export function sanitizeRich(input: string): string {
  let out = "";
  let last = 0;
  let depth = 0; // mantém as tags sempre balanceadas (itálico aninhado vira um só)
  for (const match of input.matchAll(TAG)) {
    out += escape(decode(input.slice(last, match.index)));
    const tag = match[0].toLowerCase();
    if (tag.startsWith("<br")) {
      out += "<br>";
    } else if (tag.startsWith("</")) {
      if (depth > 0 && --depth === 0) out += "</em>";
    } else if (depth++ === 0) {
      out += "<em>";
    }
    last = (match.index ?? 0) + match[0].length;
  }
  out += escape(decode(input.slice(last)));
  if (depth > 0) out += "</em>";

  return out
    .replace(/<em><\/em>/g, "")
    .replace(/<\/em>(\s*)<em>/g, "$1")
    .trim();
}

// Versão sem marcação, para título da aba, descrições etc.
export function plainText(rich: string): string {
  return decode(rich.replace(/<br>/g, " ").replace(/<[^>]+>/g, "")).trim();
}

// Lê o conteúdo de um elemento editável e devolve o texto limpo.
export function serializeEditable(root: Node): string {
  let out = "";
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += escape(node.textContent ?? "");
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = (node as Element).tagName;
      const inner = serializeEditable(node);
      if (tag === "EM" || tag === "I") out += `<em>${inner}</em>`;
      else if (tag === "BR") out += "<br>";
      else out += inner;
    }
  });
  return sanitizeRich(out);
}
