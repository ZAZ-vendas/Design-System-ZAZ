# ZAZ Apolo Design System

Base visual única para tudo que leva o nome **ZAZ**: produtos (Apolo e afins),
apresentações, documentos, páginas HTML e materiais internos.

A fonte da verdade é [`tokens/zaz.tokens.json`](tokens/zaz.tokens.json). CSS,
preset Tailwind e componentes React são **gerados ou derivados** dele — não são
cópias mantidas à mão.

📖 **Documentação navegável:** <https://zaz-vendas.github.io/Design-System-ZAZ/>
🔍 **O que foi conferido contra produção:** [`AUDITORIA.md`](AUDITORIA.md)

---

## Começar

### Caminho 1 — HTML solto, sem build

Apresentação, página avulsa, relatório, e-mail interno. Uma linha:

```html
<link rel="stylesheet" href="https://zaz-vendas.github.io/Design-System-ZAZ/css/zaz.css">
<body class="zaz-root">
```

`class="zaz-root"` não é enfeite: é ela que liga fundo, cor de texto, fonte e
barra de rolagem. Sem ela o CSS carrega e não faz nada visível.

### Caminho 2 — Tailwind v4

```css
@import "tailwindcss";
@import "@zaz/design-system/tailwind/theme.css";
```

O preset expõe `bg-brand-600`, `text-text-muted`, `rounded-card`, `shadow-cta`,
`h-control-md`, `tracking-eyebrow`, `ease-entrance` — os mesmos valores dos tokens.

### Caminho 3 — React

```bash
npm i github:ZAZ-vendas/Design-System-ZAZ
```

```js
import "@zaz/design-system/css";
import { Button, Card, StatusBadge } from "@zaz/design-system";
```

Para fixar uma versão, aponte para a tag: `github:ZAZ-vendas/Design-System-ZAZ#v1.0.0`.
Sem isso o npm segue a `main`, e uma mudança de token entra no seu projeto no
próximo `npm install` sem você pedir.

### Rodar a documentação localmente

```bash
git clone https://github.com/ZAZ-vendas/Design-System-ZAZ.git
cd Design-System-ZAZ
npm start          # serve a pasta em http://localhost:3000
```

---

## Modelos prontos

Nem tudo que leva o nome ZAZ é aplicação. Cada arquivo abaixo é completo: abra,
apague o conteúdo, escreva o seu.

| Arquivo | O que é |
|---|---|
| [`templates/apresentacao.html`](templates/apresentacao.html) | Deck 1920×1080 com os seis layouts, navegação por seta, visão em grade (`G`), tela cheia (`F`) e `Ctrl+P` gerando PDF em paisagem, um slide por página. O slide atual fica no `#hash` — dá para mandar o link já aberto no slide 4. |
| [`templates/app.html`](templates/app.html) | Shell de aplicação: sidebar com contadores, header com busca e ações, métricas, lista com trilha lateral, alternador de tema que persiste. HTML puro, sem build. |

---

## Estrutura

```
tokens/zaz.tokens.json    Tokens W3C — fonte da verdade
css/tokens.css            Variáveis (geradas) + reset, scrollbar, keyframes (à mão)
css/components.css        Componentes (.zaz-*), sem dependência de Tailwind
css/slides.css            Layouts de apresentação 1920×1080
css/zaz.css               Entrada única (importa os três)
tailwind/theme.css        Preset Tailwind v4 (gerado)
react/index.js            Componentes React (JS puro, sem build)
templates/                Modelos prontos de deck e de aplicação
docs/index.html           Documentação navegável
index.html                Porta de entrada do site publicado
scripts/build-tokens.mjs  Gera o CSS a partir do JSON
scripts/check-vars.mjs    Acusa var(--zaz-*) sem definição
assets/                   Logo ZAZ + mascote Apolo (peças separadas)
AUDITORIA.md              Comparação com o Apolo em produção
```

> O produto que serviu de referência — o Apolo — vive em outro repositório
> (`ZAZ-vendas/apolo`). Este aqui é só o sistema visual, e é de propósito: um
> design system que precisa do produto para ser consumido não é um sistema, é
> uma pasta do produto.

---

## Cores

### Marca

O roxo **`#591da9`** (`brand-600`) é a cor institucional ZAZ, nos **dois** temas.
Hover: `brand-700` no claro, `brand-500` no escuro.

| Token | Hex | Uso |
|---|---|---|
| `brand-50` / `100` | `#f5f1fc` / `#ebe2f9` | Fundo de estado ativo, badge de marca, anel de foco |
| `brand-200` / `300` | `#d7c4f2` / `#b795e6` | Bordas de destaque, texto de marca em fundo escuro |
| **`brand-600`** | **`#591da9`** | **Primária: CTA, foco, trilha ativa, ponto "ao vivo"** |
| `brand-700` | `#4a168c` | Hover da primária (tema claro) |
| `brand-800` – `950` | `#3b1270` … `#1a0733` | Fundos escuros de slide, sombra tingida |

### A regra que mais dá errado: fundo × texto

São **dois papéis**, não um.

| Token | Claro | Escuro | Onde |
|---|---|---|---|
| `--zaz-primary` | `#591da9` | `#591da9` | **Fundo** de ação: botão, barra, ponto |
| `--zaz-primary-text` | `#591da9` | `#a78bfa` | **Texto, ícone, borda** de marca |

No tema claro os dois valem o mesmo roxo e a distinção parece burocracia. Ela
existe pelo escuro: `#591da9` como fundo, com branco em cima, dá 9,7:1 — ótimo;
o mesmo `#591da9` como **texto** sobre a superfície escura dá 2,7:1, abaixo do
mínimo legível. `#a78bfa` resolve, com 6,7:1. Detalhes em [`AUDITORIA.md`](AUDITORIA.md).

Trocar um pelo outro não quebra build nem estoura teste. Só apaga o texto no
tema escuro até ninguém conseguir ler.

### Véu

`--zaz-veil` (10%) e `--zaz-veil-strong` (16%) são a marca diluída, para fundo de
hover, linha de lista tocada e item de nav ativo. Nascem de `primary-text` via
`color-mix()`, então acompanham o tema sozinhos — é por isso que
`components.css` **não tem nenhuma regra `.dark`**.

### Neutros

Escala **slate** completa (`neutral-50` → `neutral-950`). É o único conjunto
neutro permitido — todo fundo, borda e texto sai dela.

**Camadas de superfície.** Claro: `neutral-50` (app) → branco (card) →
`neutral-50` (painel). Escuro: `neutral-950` → `neutral-900` → `neutral-950`.

### Status

Sempre em **trio**: fundo `*-bg` + texto `*-fg` + borda `*-border`. Cor cheia
(`--zaz-danger`, `--zaz-success`…) só em ponto, ícone ou barra — nunca como
fundo de bloco.

`danger` · `warning` · `success` · `info` · `status` (neutro)

### Acentos de área

Cada área do Apolo tem um acento que colore **apenas** sua pílula no AreaSwitcher
e o marcador de área ativa. Nunca o corpo da tela.

Tasklist roxo · RH âmbar · Gestor esmeralda · Promotor sky · Suporte VERO ciano · Agenda indigo

### Marcas parceiras

> As cores em `color.tag` são de **identificação interna** dentro de produtos
> ZAZ. Não são a marca do parceiro e não substituem o manual de marca dele.

**Permitido:** tag/badge de fila, ponto de legenda, série de gráfico.
**Proibido:** fundo de tela, botão, header, capa de slide.

Nomes de marca sempre em CAIXA ALTA: VERO, GETNET, GUARA, SAFIRA, ORIGO, SUA LUZ,
SERENA, TICKET, PLUXEE. O componente `<BrandTag>` colore só o ponto — o rótulo
fica neutro.

### Dados

`data-1` a `data-8`, usados **na ordem** — a série 1 é sempre o roxo de marca.
Acima de 8 séries, agrupe em "Outros". Para intensidade e mapas, use a rampa
`data-seq-1` → `data-seq-7`.

---

## Tipografia

**Inter** (300–900) para tudo; **JetBrains Mono** para IDs de tarefa, CPFs e
chaves Camunda.

| Contexto | Token | Peso |
|---|---|---|
| Display (uma vez por tela) | `4xl` 36px | 900, tracking `-0.02em` |
| Título de tela | `2xl` 24px | 800 |
| Título de card | `xl` 20px | 700 |
| Corpo (padrão em produto) | `sm` 14px | 400 |
| Eyebrow / label | `xs` 12px | 700, CAIXA ALTA, tracking `0.08em` |
| Mono | `xs` 12px | 400 |

**Eyebrow em caixa alta sempre com letter-spacing** — nunca caixa alta "seca".

Em apresentação a escala é outra: título 88px, seção 56px, corpo 30px, rodapé
24px. **Mínimo absoluto em slide: 24px.** Em documento impresso: 12pt.

---

## Espaçamento, raios e sombras

Grade de **4px**. Gaps usuais: 2, 3, 4, 6, 8.

Raios são a assinatura do sistema:

| Token | Valor | Onde |
|---|---|---|
| `radius-sm` | 6px | Checkbox, swatch |
| `radius-md` | 8px | Chip, miniatura, célula de calendário |
| `radius-control` | 12px | Botão, input, item de nav, badge |
| `radius-card` | 16px | **Card padrão** — a maioria dos contêineres |
| `radius-hero` | 24px | Card herói e modal. Um por tela, no máximo |
| `radius-pill` | ∞ | Avatar, ponto, barra de progresso |

Escada de sombra: `sm` (cards) → `md` → `lg` (modal, drawer) → `cta` (botão
primário, brilho roxo) → `hero` (única sombra tingida do sistema).

---

## Componentes

Disponíveis em CSS (`.zaz-*`) e React:

- **Ação** — `Button` (primary / secondary / ghost / danger; sm / md / lg)
- **Formulário** — `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Alert`
- **Contêiner** — `Card` + `CardHeader/Body/Footer`, `Metric`, `SectionHeading`
- **Status** — `Badge`, `StatusBadge`, `BrandTag`, `LiveDot`
- **Dados** — `Table`, `Track` + `TrackRow`, `DescriptionList`, `Legend`, `Bar`
- **Shell** — `Shell`, `Sidebar*`, `Header`, `Main`, `NavItem`, `AreaPill`, `Avatar`
- **Sobreposição** — `Modal`, `Drawer`, `Toast` + `ToastStack`
- **Apresentação** — `Slide` (cover / section / content / data / split / closing) e auxiliares

### Assinaturas

**1. Trilha lateral.** Linhas de lista usam `border-left: 4px solid transparent`
que vira roxo no hover e no estado ativo. É assim que o Apolo indica foco — sem
trocar o fundo inteiro. **Confirmada em produção** (`border-l-4`, 15 ocorrências).

**2. Barra roxa de seção.** Um retângulo de 4×40px arredondado à esquerda de
títulos de seção dentro de cards; em slide, 8×96px. **Proposta deste sistema —
ainda não existe no Apolo** (zero ocorrências no código de produção). Ela fica
porque é boa e barata, mas não é padrão observado enquanto não entrar no produto.

### Foco

O ícone acende antes da borda: dentro de inputs, ícones vão de `text-subtle`
para `primary-text` em `:focus-within`. Foco por teclado sempre com
`outline: 2px solid var(--zaz-ring)` e `outline-offset: 2px`.

---

## Movimento

Transições de 150–300ms com a curva padrão. Entradas usam `--zaz-ease-entrance`.

Botão: `hover: translateY(-1px)` + `active: scale(0.96)`. Linha de lista: tinta
de fundo + chevron desloca 4px. Sem bounce, sem spring, sem animação de entrada
em item de lista.

`prefers-reduced-motion: reduce` desliga tudo — já vem no `tokens.css`.

---

## Conteúdo e voz

**Português (pt-BR), sempre.** Inglês só em código.

- Tom institucional, claro, educado. Nunca casual.
- **CAIXA ALTA com tracking** para eyebrows e labels: `IDENTIFICAÇÃO (CPF OU USUÁRIO)`.
- **Title Case** em botões e navegação: `Entrar no Sistema`, `Filtros Avançados`.
- **Sentence case** em corpo e dicas: `Gestão inteligente de processos.`
- Acentuação completa, sempre. Nunca ASCII.
- **Sem emoji.** Em nenhum lugar.
- Rótulos explicam o contexto: `Identificação (CPF ou Usuário)`, não `Login`.
- Marcas em CAIXA ALTA; etapas de processo em Title Case (Handshake, Credenciamento, Pendência, Onboarding).
- Rodapé: `© 2026 Zaz Vendas. Apolo.`

---

## Ícones

**lucide** exclusivamente (`^0.563.0`, via `https://esm.sh/lucide-react@^0.563.0`).
Sem icon font, sem sprite, sem PNG de ícone.

Tamanhos: 14 (meta inline), 16 (junto a botão), 18–20 (adorno de input,
standalone). `strokeWidth={2}`. Cor neutra por padrão; `primary-text` em
ativo/foco.

---

## Assets

| Arquivo | Uso |
|---|---|
| `assets/logo-zaz.png` | **Marca ZAZ oficial** — 2190×2430, fundo transparente |
| `assets/apolo/*.png` | Mascote Apolo em peças separadas (cabeça, corpo, braços, pés, mão, bandeira, sombra) |

**Pendência aberta:** só temos o PNG. Um SVG vetorial ainda é desejável para
impressão e telas grandes.

**Divergência de roxo — decisão pendente do time de marca.** O arquivo de logo
usa `#6a1ca0`; a interface do Apolo usa `#591da9`. Os dois estão registrados e
separados:

| Token | Hex | Uso |
|---|---|---|
| `brand-logo` | `#6a1ca0` | Só ao reproduzir a marca ou casar um fundo com ela |
| `brand-600` | `#591da9` | Primária de interface — tudo o mais |

Quando a decisão sair, um dos dois some e a escala inteira é rederivada a partir
do vencedor.

Regras de logo (valem para os dois): altura mínima 24px; área de respiro igual a
metade da altura do logo; sem sombra, contorno ou rotação. Em fundo escuro, use a
versão positiva sobre o roxo — não aplique `filter: invert()`.

O mascote é para contextos de acolhimento e estados vazios/erro. Não entra em
tela operacional densa.

---

## Manutenção

1. **Toda mudança visual começa em `tokens/zaz.tokens.json`.** Nunca no CSS.

2. `npm run build:tokens` regenera:
   - o miolo de `css/tokens.css`, entre as marcas `GERADO:INICIO` / `GERADO:FIM`
   - `tailwind/theme.css` inteiro

   O resto de `tokens.css` (reset, scrollbar, keyframes) é escrito à mão e o
   gerador não encosta.

3. `npm run check` antes de abrir PR. São duas verificações:

   | Comando | O que pega |
   |---|---|
   | `check:tokens` | CSS editado à mão que o próximo build apagaria sem avisar |
   | `check:vars` | `var(--zaz-nome-errado)` — que **não** dá erro no navegador: a declaração é ignorada em silêncio e o elemento herda o que estiver por perto |

   As duas rodam sozinhas no CI (`.github/workflows/design-system.yml`).

4. Componente novo entra em `css/components.css` **e** `react/index.js`, com uma
   amostra em `docs/index.html`.

5. **Nenhum componente escreve cor crua nem lê a escala direto.** Só papéis
   (`--zaz-primary`, `--zaz-text-muted`, `--zaz-border`). Se precisou de uma cor
   que não é papel, ou o papel existe com outro nome, ou falta criar um.

6. Versionamento semântico: mudança de valor de token = minor; remoção ou
   renomeação = major.

### Publicação

O site sai do próprio repositório pelo GitHub Actions. Antes do primeiro deploy,
uma vez, na mão: **Settings › Pages › Source: GitHub Actions**.

---

`© 2026 Zaz Vendas.`
