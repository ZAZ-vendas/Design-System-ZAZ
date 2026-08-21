#!/usr/bin/env node
/**
 * build-tokens.mjs — transforma tokens/zaz.tokens.json nos arquivos que o
 * navegador realmente lê.
 *
 *   node scripts/build-tokens.mjs           # escreve
 *   node scripts/build-tokens.mjs --check   # não escreve; sai com erro se estiver defasado (CI)
 *
 * Ele produz DOIS destinos:
 *
 *   1. css/tokens.css     — só o miolo, entre as marcas GERADO:INICIO/GERADO:FIM.
 *                           O resto do arquivo (reset, keyframes, scrollbar) é
 *                           escrito à mão e o script não encosta nele.
 *   2. tailwind/theme.css — arquivo inteiro, gerado do zero.
 *
 * Por que "entre marcas"? Porque tokens.css tem duas naturezas misturadas:
 * valores (que nascem do JSON) e comportamento (reset, animação). Reescrever o
 * arquivo todo apagaria o comportamento; reescrever nada deixaria o JSON
 * decorativo — que era exatamente o bug da primeira versão deste script.
 *
 * --- Como um nome do JSON vira um nome de variável ---
 *
 *   color.brand.600        ->  --zaz-brand-600
 *   color.semantic.bg-app  ->  --zaz-bg-app        (o segmento "semantic" some)
 *   color.dark.bg-app      ->  --zaz-bg-app        (mesmo nome, mas dentro de `.dark`)
 *   size.layout.sidebarW   ->  --zaz-sidebar-w     ("size" e "layout" somem, camelCase vira kebab)
 *   motion.ease.standard   ->  --zaz-ease-standard
 *
 * Segmentos em DROP são "pastas" de organização do JSON, não fazem parte do nome.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

/** Segmentos que existem só para organizar o JSON e não entram no nome final. */
const DROP = new Set(["color", "size", "motion", "semantic", "layout", "feedback", "chart"]);

/** sidebarW -> sidebar-w | data-seq -> data-seq | 600 -> 600 */
const kebab = (s) =>
  String(s).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").toLowerCase();

/**
 * Caminho no JSON -> nome da custom property, sem o prefixo `--zaz-`.
 * "solid" no fim também some: a cor cheia do trio é o nome pelado
 * (feedback.danger.solid -> --zaz-danger, ao lado de --zaz-danger-bg).
 */
const nameOf = (path) => {
  const segs = path.filter((seg) => !DROP.has(seg));
  if (segs.at(-1) === "solid") segs.pop();
  return segs.map(kebab).join("-");
};

/**
 * Percorre a árvore e devolve [caminho, valor] para cada folha.
 * Uma folha é um objeto que tem a chave "$value" (formato W3C Design Tokens).
 * Chaves que começam com "$" ($type, $description) são metadados: ignoradas.
 */
function flatten(node, path = [], out = []) {
  if (node && typeof node === "object" && "$value" in node) {
    out.push([path, node.$value]);
    return out;
  }
  for (const [k, v] of Object.entries(node ?? {})) {
    if (k.startsWith("$")) continue;
    flatten(v, [...path, k], out);
  }
  return out;
}

/**
 * Converte um valor do JSON no texto que vai para o CSS.
 *  - "{color.brand.600}"   -> var(--zaz-brand-600)      (alias W3C)
 *  - [0.4, 0, 0.2, 1]      -> cubic-bezier(0.4, 0, 0.2, 1)
 *  - ["Inter", "Segoe UI"] -> "Inter", "Segoe UI"       (aspas só onde há espaço)
 *
 * O alias vale em qualquer posição da string, não só sozinho — é o que permite
 * escrever "color-mix(in srgb, {color.semantic.primary-text} 10%, transparent)"
 * e ainda assim ter um valor rastreável até o token de origem.
 */
function render(value) {
  if (typeof value === "string") {
    return value.replace(/\{([^{}]+)\}/g, (_, ref) => `var(--zaz-${nameOf(ref.split("."))})`);
  }
  if (Array.isArray(value)) {
    return value.every((v) => typeof v === "number")
      ? `cubic-bezier(${value.join(", ")})`
      : value.map((v) => (/\s/.test(v) ? `"${v}"` : v)).join(", ");
  }
  return String(value);
}

const tokens = JSON.parse(await readFile(join(root, "tokens/zaz.tokens.json"), "utf8"));
const flat = flatten(tokens);

/* O grupo `dark` não é uma paleta: é o conjunto de trocas do tema escuro.
   Vai para um bloco `.dark` separado, com os MESMOS nomes do tema claro. */
const isDark = (path) => path[0] === "dark";
const decl = (path, value) =>
  `  --zaz-${nameOf(isDark(path) ? path.slice(1) : path)}: ${render(value)};`;

const rootDecls = flat.filter(([p]) => !isDark(p)).map(([p, v]) => decl(p, v));
const darkDecls = flat.filter(([p]) => isDark(p)).map(([p, v]) => decl(p, v));

// ---------------------------------------------------------------- css/tokens.css
const START = "/* GERADO:INICIO — não edite daqui até GERADO:FIM. Fonte: tokens/zaz.tokens.json */";
const END = "/* GERADO:FIM */";

const bloco = [
  START,
  ":root {",
  ...rootDecls,
  "}",
  "",
  "/* Tema escuro: trocam APENAS os papéis semânticos. Nenhuma cor de escala é",
  "   redefinida aqui — brand-600 vale o mesmo nos dois temas. */",
  ".dark {",
  ...darkDecls,
  "}",
  END,
].join("\n");

const alvoTokens = join(root, "css/tokens.css");
const atual = await readFile(alvoTokens, "utf8");
const i = atual.indexOf(START);
const j = atual.indexOf(END);
if (i === -1 || j === -1) {
  console.error(`css/tokens.css não tem as marcas ${START.slice(0, 22)}…/${END}. Restaure-as antes de gerar.`);
  process.exit(1);
}
const novoTokens = atual.slice(0, i) + bloco + atual.slice(j + END.length);

// ------------------------------------------------------------ tailwind/theme.css
/* Tailwind v4 lê o tema de namespaces fixos: --color-*, --font-*, --text-*,
   --spacing-*, --radius-*, --shadow-*, --ease-*. Um token só vira utilitário se
   entrar no namespace certo — por isso o de/para abaixo, e não uma cópia crua.
   Altura de controle entra em --spacing-* de propósito: é assim que `h-control-md`
   passa a existir, já que Tailwind resolve h-* a partir de spacing. */
/**
 * Devolve [namespace, quantos segmentos do começo do caminho o namespace já
 * consumiu]. Ex.: size.text.xs -> ["text", 2], porque "size" e "text" viram o
 * prefixo `--text-` e sobra só `xs`. Contar segmentos em vez de recortar o nome
 * pronto evita o caso venenoso de color.semantic.text-muted, onde um replace de
 * "^text-" comeria metade do nome e produziria `--color-muted`.
 */
const twMap = (path) => {
  const [a, b] = path;
  if (a === "color") return ["color", 0];
  if (a === "font") return ["font", 1];
  if (a === "size" && b === "text") return ["text", 2];
  if (a === "size" && b === "space") return ["spacing", 2];
  if (a === "size" && b === "tracking") return ["tracking", 2];
  if (a === "size" && b === "control") return ["spacing", 1]; // vira h-control-md
  if (a === "radius") return ["radius", 1];
  if (a === "shadow") return ["shadow", 1];
  if (a === "motion" && b === "ease") return ["ease", 2];
  return null;
};
const twDecl = (path, value) => {
  const hit = twMap(path);
  if (!hit) return null;
  const [ns, corte] = hit;
  return `  --${ns}-${nameOf(path.slice(corte))}: ${render(value)};`;
};

const twLines = flat.filter(([p]) => !isDark(p)).map(([p, v]) => twDecl(p, v)).filter(Boolean);
/* No escuro o caminho perde o "dark" da frente. O que sobra é papel de cor,
   exceto o grupo shadow: dark.semantic.bg-app -> --color-bg-app,
   dark.shadow.sm -> --shadow-sm. */
const twDark = flat.filter(([p]) => isDark(p)).map(([p, v]) => {
  const resto = p.slice(1);
  return resto[0] === "shadow"
    ? `  --shadow-${nameOf(resto.slice(1))}: ${render(v)};`
    : `  --color-${nameOf(resto)}: ${render(v)};`;
});

const theme = `/* ============================================================================
   ZAZ Apolo Design System — preset Tailwind v4
   GERADO por scripts/build-tokens.mjs. Não editar à mão.

   Uso:
     @import "tailwindcss";
     @import "@zaz/design-system/tailwind/theme.css";

   Gera utilitários nativos: bg-brand-600, text-text-muted, rounded-card,
   shadow-cta, h-control-md, ease-entrance.
   ========================================================================== */

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap");

@theme {
${twLines.join("\n")}
}

/* Papéis do tema escuro. Fora do @theme porque @theme não aceita seletor —
   a cascata resolve: bg-bg-app usa var(--color-bg-app), que muda aqui dentro. */
.dark {
${twDark.join("\n")}
}
`;

// ---------------------------------------------------------------------- escrita
const alvoTheme = join(root, "tailwind/theme.css");

if (CHECK) {
  const themeAtual = await readFile(alvoTheme, "utf8").catch(() => "");
  const defasados = [
    novoTokens !== atual && "css/tokens.css",
    theme !== themeAtual && "tailwind/theme.css",
  ].filter(Boolean);
  if (defasados.length) {
    console.error(`Defasado: ${defasados.join(", ")}. Rode: npm run build:tokens`);
    process.exit(1);
  }
  console.log(`OK — ${flat.length} tokens em sincronia (${rootDecls.length} claros, ${darkDecls.length} escuros).`);
} else {
  await writeFile(alvoTokens, novoTokens);
  await writeFile(alvoTheme, theme);
  console.log(`css/tokens.css e tailwind/theme.css escritos — ${flat.length} tokens.`);
}
