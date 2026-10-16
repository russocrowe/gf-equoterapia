// Dados estruturados (JSON-LD) vão dentro de um <script>. JSON.stringify não
// escapa "<", então um texto com "</script>" fecharia a tag e abriria espaço
// para injeção de código. Escapar "<" e os separadores de linha do Unicode
// deixa o JSON idêntico para o Google e inofensivo para o navegador.
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .split(LINE_SEPARATOR)
    .join("\\u2028")
    .split(PARAGRAPH_SEPARATOR)
    .join("\\u2029");
}
