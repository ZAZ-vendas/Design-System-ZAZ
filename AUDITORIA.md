# Auditoria — Design System × Apolo em produção

Data: **20 de agosto de 2026**
Fonte comparada: `zaz-tasklist/components/*.tsx` (46 componentes) + `zaz-tasklist/index.html`, branch `main`.

Um design system que descreve uma tela imaginária é pior que nenhum: ele fabrica
regras que o time vai desobedecer sem perceber, e a primeira aplicação nova sai
diferente do produto que ela deveria imitar. Este documento é a prova de que
cada regra do sistema foi conferida contra o código que está no ar — e a lista
honesta do que **não** bateu.

Método: contagem de ocorrências reais no código (`grep`), não leitura de
mockup. Onde há divergência, vence o que está em produção, salvo quando o valor
de produção reprova em acessibilidade — esses casos estão marcados e explicados.

---

## 1. Confirmado — o sistema descreve o produto

| Regra do sistema | Evidência em produção |
|---|---|
| `brand-600` = `#591da9` é a primária | **361** ocorrências; nenhum outro roxo chega perto |
| `brand-700` = `#4a168c` é o hover | **32** ocorrências |
| Escala neutra é slate, e só ela | `bg-slate-50 dark:bg-slate-950` no `<body>`; nenhum gray/zinc/stone |
| `radius-control` = 12px | `rounded-xl`, **1140** ocorrências — o raio mais usado do produto |
| `radius-card` = 16px | `rounded-2xl`, **803** |
| `radius-hero` = 24px | `rounded-3xl`, **99** |
| `radius-pill` | `rounded-full`, **363** |
| `sidebar-w` = 16rem | `w-64` na sidebar de todas as áreas |
| `header-h` = 4rem | `h-16` no `<header>` de `Layout.tsx:506` |
| `control-lg` = 3.5rem | `h-14`, **51** ocorrências, todas em campo de formulário |
| Trilha lateral de 4px | `border-l-4`, **15** ocorrências |
| Tema por classe, não por media query | `darkMode: 'class'` + classe aplicada antes do paint |
| Inter 300–900 | `<link>` do Google Fonts no `index.html` |

Treze regras conferidas, treze batendo. A base do sistema é sólida.

---

## 2. Divergências corrigidas nesta versão

### 2.1 O roxo do tema escuro reprovava em contraste — corrigido

**O que havia:** no bloco `.dark`, `--zaz-primary` virava `brand-500` (`#7538c2`)
e servia tanto de fundo quanto de texto.

**O problema:** `#7538c2` sobre a superfície escura (`neutral-900`, `#0f172a`)
dá **2,7:1**. O mínimo da WCAG para texto é 4,5:1. Ou seja: todo texto de marca
no tema escuro — link, título de linha em hover, ícone de campo em foco —
estava abaixo do legível. Não é preciosismo de norma; é o texto sumindo mesmo,
principalmente em monitor de escritório com brilho baixo.

**O que o Apolo faz de verdade:** usa `#a78bfa` (**67** ocorrências, sempre em
`dark:text-*` ou `dark:hover:text-*`) — **6,7:1**, aprovado. E mantém o fundo em
roxo forte: `dark:bg-[#591da9]` e `dark:bg-[#3b1170]`.

**A correção:** o papel único virou dois.

| Token | Claro | Escuro | Para quê |
|---|---|---|---|
| `--zaz-primary` | `#591da9` | `#591da9` | **Fundo** de ação. Branco em cima: 9,7:1 |
| `--zaz-primary-text` | `#591da9` | `#a78bfa` | **Texto, ícone, borda.** Escuro: 6,7:1 |

No tema claro os dois são o mesmo roxo, e a separação parece burocracia. Ela
existe pelo escuro. Trocar um pelo outro não quebra o build nem estoura teste
nenhum — só apaga o texto até ninguém conseguir ler.

### 2.2 Faltava o quarto raio mais usado do produto

O sistema listava cinco raios e omitia justamente `rounded-lg` (8px), que
aparece **446** vezes — mais que o `radius-hero` e o `radius-sm` somados.
Quem seguisse o sistema à risca teria que escolher entre 6px e 12px para um
chip ou uma miniatura, e escolheria errado. Entrou como **`radius-md` = 0.5rem**.

### 2.3 A barra de rolagem não estava no sistema

`index.html` de produção pinta uma scrollbar de 6px, sem trilho, polegar
`neutral-300` (`neutral-600` no escuro). É um detalhe pequeno e é metade do
motivo de uma tela nova "parecer Apolo" antes mesmo de ter conteúdo. Virou
token (`--zaz-scrollbar`) e regra em `tokens.css`.

### 2.4 Cor crua dentro de componente

`components.css` tinha `rgb(117 56 194 / 0.15)` escrito à mão em sete lugares,
cada um dentro de uma regra `.dark` gêmea da regra clara. Isso é dívida dupla:
o valor não sai de token nenhum, e cada componente precisa ser mantido duas
vezes.

Agora existem `--zaz-veil` e `--zaz-veil-strong`, derivados de `primary-text`
por `color-mix()`. Como `primary-text` já muda com o tema, o véu muda junto —
e **as sete regras `.dark` do `components.css` viraram zero**. Mesmo tratamento
para `--zaz-on-primary`, `--zaz-border-strong` e `--zaz-overlay`.

---

## 3. Divergências registradas, sem correção automática

Estas exigem decisão humana. Nenhuma foi "resolvida" no escuro para fazer o
número fechar.

### 3.1 A barra roxa de seção não existe no Apolo

O README anunciava, entre "duas assinaturas que não se negociam", um retângulo
roxo de 4×40px à esquerda de títulos de seção. Busca no código de produção:
**zero ocorrências**. Nenhum elemento estreito e alto com fundo de marca, em
nenhum dos 46 componentes.

Ela veio do gerador do sistema, não do produto.

**Decisão tomada:** o componente `.zaz-section-heading` **fica** — é bom, é
barato e dá identidade a tela nova. Mas o texto foi corrigido: é uma **proposta
do sistema**, não um padrão observado. Chamar de assinatura consagrada algo que
não está no ar é como o sistema perde credibilidade no primeiro `Ctrl+F` de um
desenvolvedor.

Para virar padrão de verdade, precisa entrar no Apolo.

### 3.2 JetBrains Mono é especificada mas não carregada

`font-mono` aparece **184** vezes nos componentes; o `index.html` do Apolo
carrega **só Inter**. Ou seja: hoje todo CPF, ID de tarefa e chave Camunda
renderiza no monoespaçado padrão do sistema operacional — Consolas no Windows,
Menlo no Mac. O sistema promete uma fonte que o produto não baixa.

`css/tokens.css` **já carrega** JetBrains Mono. Então quem usar o design system
tem a fonte certa. Falta o inverso: o Apolo adotar o sistema, ou acrescentar a
fonte ao `<link>` do `index.html`.

### 3.3 Roxos fora da escala em produção

| Valor | Ocorrências | O que é |
|---|---|---|
| `#4a1790`, `#4a1890`, `#4a1789` | 3 + 3 + 3 | Quase-`#4a168c`. Três variações de um dígito — erro de digitação propagado por cópia |
| `dark:bg-purple-900` | 115 | Roxo do Tailwind, não da escala ZAZ |
| `dark:text-purple-400` | 92 | idem |
| `dark:text-purple-300` | 56 | idem |
| `#7c3aed`, `#8b5cf6`, `#a855f7`, `#a21caf` | 12 + 10 + 4 + 5 | violet/purple/fuchsia do Tailwind |

Os três primeiros são bug puro: ninguém escolheu `#4a1790`, alguém errou uma
tecla e o valor foi copiado adiante. Os demais são a família `purple` do
Tailwind ocupando o lugar da escala de marca — visualmente perto, mas fora do
sistema, e é o tipo de coisa que faz duas telas do mesmo produto não combinarem.

Nenhum foi alterado: mexer em 300+ ocorrências dentro do Apolo é migração, não
auditoria — e migração precisa de decisão e de teste. Fica registrado como o
trabalho de adoção do sistema no produto.

### 3.4 `<html lang="en">` no Apolo

O produto é integralmente em português e declara inglês. Isso muda hifenização,
corretor ortográfico e a pronúncia de leitor de tela. Correção de uma linha em
`zaz-tasklist/index.html`, fora do escopo deste pacote.

### 3.5 Divergência de roxo do logo — continua aberta

O arquivo de logo usa `#6a1ca0`; a interface usa `#591da9`. Os dois seguem
registrados e separados (`brand-logo` × `brand-600`), à espera do time de marca.
Quando a decisão sair, um dos dois some e a escala inteira é rederivada a partir
do vencedor.

---

## 4. Como repetir esta auditoria

Ela não vale nada se for feita uma vez. O produto auditado vive em **outro
repositório** (`ZAZ-vendas/apolo`), então comece clonando os dois lado a lado:

```bash
git clone https://github.com/ZAZ-vendas/apolo.git
cd apolo/zaz-tasklist

# Roxos em uso, por frequência — o topo tem que ser #591da9
grep -rhoE '#[0-9a-fA-F]{6}' components | tr 'A-F' 'a-f' | sort | uniq -c | sort -rn | head -20

# Raios em uso — tem que bater com os tokens radius-*
grep -rhoE '\brounded-(sm|md|lg|xl|2xl|3xl|full)\b' components | sort | uniq -c | sort -rn

# Cor do Tailwind ocupando lugar da escala de marca
grep -rhoE '\b(text|bg|border)-(purple|violet|fuchsia)-[0-9]{3}\b' components | sort | uniq -c | sort -rn
```

E, na raiz deste repositório:

```bash
npm run build:tokens -- --check   # o CSS bate com o JSON de tokens?
npm run check:vars                # alguma var(--zaz-*) sem definição?
```

Os dois últimos rodam sozinhos no CI a cada push — ver
`.github/workflows/design-system.yml`.
