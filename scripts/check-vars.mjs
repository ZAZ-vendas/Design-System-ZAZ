#!/usr/bin/env node
/**
 * check-vars.mjs — nenhum arquivo do sistema pode usar uma variável que não
 * existe.
 *
 *   node scripts/check-vars.mjs
 *
 * Por que isso importa: `var(--zaz-nao-existe)` não dá erro nenhum. O navegador
 * simplesmente ignora a declaração e o elemento herda o que estiver por perto —
 * um badge some, um texto fica preto onde devia ser roxo, e ninguém descobre até
 * alguém abrir a tela. Uma variável com nome errado é um bug silencioso, e é
 * exatamente o tipo de bug que aparece quando se renomeia um token.
 *
 * Também aponta o contrário: token definido que ninguém usa. Isso não é erro
 * (um sistema publica tokens para quem consome usar), então sai só como aviso.
 */
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Varre a pasta procurando .css e .html, ignorando node_modules. */
async function arquivos(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) await arquivos(p, out);
    else if (/\.(css|html)$/.test(e.name)) out.push(p);
  }
  return out;
}

const definidas = new Set(
  (await readFile(join(root, "css/tokens.css"), "utf8")).match(/--zaz-[a-z0-9-]+(?=\s*:)/g) ?? []
);

/* Variáveis locais de componente: nascem e morrem dentro de um bloco, não são
   tokens do sistema. `--zaz-slide-cols` é configuração de layout que a página
   define inline; `--_algo` é convenção de privado dentro do próprio CSS. */
const LOCAIS = new Set(["--zaz-slide-cols"]);

const usadas = new Map(); // nome -> [arquivos]
for (const f of await arquivos(root)) {
  const txt = await readFile(f, "utf8");
  for (const m of txt.matchAll(/var\(\s*(--zaz-[a-z0-9-]+)/g)) {
    // Nome montado em tempo de execução (`--zaz-data-${i}`) chega truncado
    // no hífen final — não dá para validar estaticamente, então pula.
    if (m[1].endsWith("-")) continue;
    if (!usadas.has(m[1])) usadas.set(m[1], []);
    usadas.get(m[1]).push(relative(root, f));
  }
}

const orfas = [...usadas].filter(([n]) => !definidas.has(n) && !LOCAIS.has(n));
const naoUsadas = [...definidas].filter((n) => !usadas.has(n));

if (naoUsadas.length) {
  console.log(`aviso — ${naoUsadas.length} tokens definidos que nenhum arquivo consome (normal num sistema publicado):`);
  console.log(`  ${naoUsadas.join(", ")}\n`);
}

if (orfas.length) {
  console.error(`ERRO — ${orfas.length} variável(is) usada(s) sem definição em css/tokens.css:\n`);
  for (const [nome, arqs] of orfas) console.error(`  ${nome}\n    em ${[...new Set(arqs)].join(", ")}`);
  console.error("\nOu o nome está errado, ou o token precisa entrar em tokens/zaz.tokens.json.");
  process.exit(1);
}

console.log(`OK — ${usadas.size} variáveis usadas, todas definidas.`);
