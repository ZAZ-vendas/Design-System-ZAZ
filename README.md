# ZAZ Apolo Design System

Base visual única para tudo que leva o nome **ZAZ**: produtos (Apolo e afins),
apresentações, documentos, páginas HTML e materiais internos.

A fonte da verdade é [`tokens/zaz.tokens.json`](tokens/zaz.tokens.json). CSS,
preset Tailwind e componentes React são **gerados ou derivados** dele — não são
cópias mantidas à mão.

📖 **Documentação navegável:** <https://apolo.zaz.vc/design-system/> — fichas em `/fundamentos/`, `/componentes/` e `/padroes/`
🔍 **O que foi conferido contra produção:** [`AUDITORIA.md`](AUDITORIA.md)

---

## Começar

### Caminho 1 — HTML solto, sem build

Apresentação, página avulsa, relatório, e-mail interno. Uma linha:

```html
<link rel="stylesheet" href="https://apolo.zaz.vc/design-system/css/zaz.css">
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
docs/index.html           Hub: como consumir, modelos, assets e telas de referência
fundamentos/<nome>/       Ficha de um fundamento (cores, tipografia, espaço…)
componentes/<nome>/       Ficha de um componente (botão, campo, badge…)
padroes/<nome>/           Ficha de um padrão (shell…)
site/ficha.css            Layout das fichas (documentação, não faz parte do sistema)
site/nav.js               A navegação do site, num lugar só
site/ficha.js             Abas, botão copiar e alternador de tema
site/paleta.js            Desenha as escalas lendo os tokens do navegador
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

A fonte destas cores é o **Manual de identidade da marca ZAZ 2022**, que define
três primárias: o **Roxo ZAZ `#5c229c`**, o branco e o **Verde ZAZ `#a8d812`** —
com o roxo sempre como protagonista.

O roxo (`brand-600`) vale nos **dois** temas. Hover: `brand-700` no claro,
`brand-500` no escuro.

| Token | Hex | Uso |
|---|---|---|
| `brand-50` / `100` | `#f4f1fb` / `#e9e3f8` | Fundo de estado ativo, badge de marca, anel de foco |
| `brand-200` / `300` | `#d3c6f0` / `#b298e3` | Bordas de destaque, texto de marca em fundo escuro |
| **`brand-600`** | **`#5c229c`** | **Primária: CTA, foco, trilha ativa, ponto "ao vivo"** |
| `brand-700` | `#4c1c83` | Hover da primária (tema claro) |
| `brand-800` – `950` | `#3d1669` … `#1a0930` | Fundos escuros de slide, sombra tingida |

A escala inteira deriva do roxo oficial: cada degrau manteve a luminosidade já
calibrada e recebeu o matiz e o croma de `#5c229c`. Por isso o contraste não
mudou — a primária sobre branco dá 9,70:1, contra 9,66:1 da versão anterior.

### Verde ZAZ

O verde é primária no manual, mas na interface ele é **acento e superfície,
nunca ação**: `#a8d812` tem **1,68:1** sobre branco, e não existe texto que passe
em cima dele.

| Token | Hex | Uso |
|---|---|---|
| `accent-100` / `200` | `#e8f4be` / `#dbef89` | Superfície e borda do bloco de destaque |
| **`accent-300`** | **`#a8d812`** | **Verde ZAZ: ponto, barra de dado, borda, marcador** |
| `accent-500` | `#77bc00` | Verde secundário do manual |
| `accent-700` | `#3a6838` | Verde como **texto** sobre fundo claro (6,5:1) |
| `accent-800` | `#2c3f2f` | Verde escuro do manual; texto sobre a superfície verde |

Quatro degraus (`200`, `300`, `500`, `800`) são cores oficiais do manual; os
demais saem da interpolação em OKLCH entre elas.

O verde de marca **não é** o verde de sucesso. `--zaz-success` continua sendo
status; `--zaz-accent` é identidade. Misturar os dois faz a marca virar semáforo.

### A regra que mais dá errado: fundo × texto

São **dois papéis**, não um.

| Token | Claro | Escuro | Onde |
|---|---|---|---|
| `--zaz-primary` | `#5c229c` | `#5c229c` | **Fundo** de ação: botão, barra, ponto |
| `--zaz-primary-text` | `#5c229c` | `#b298e3` | **Texto, ícone, borda** de marca |

No tema claro os dois valem o mesmo roxo e a distinção parece burocracia. Ela
existe pelo escuro: `#5c229c` como fundo, com branco em cima, dá 9,7:1 — ótimo;
o mesmo `#5c229c` como **texto** sobre a superfície escura dá 2,7:1, abaixo do
mínimo legível. O `brand-300` resolve, com 7,2:1. Detalhes em
[`AUDITORIA.md`](AUDITORIA.md) e na ficha
[Fundamentos → Cores](fundamentos/cores/).

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

Três famílias, e a divisão é do manual de marca:

| Família | Token | Onde |
|---|---|---|
| **Nunito** | `--zaz-font-display` | Títulos e display, em bold/extrabold/black |
| **Nunito Sans** | `--zaz-font-sans` | Corpo e interface — o manual a indica textualmente para "textos corridos e interfaces" |
| **Gochi Hand** | `--zaz-font-hand` | Manuscrita. Uso **muito restrito**: citação, palavra de destaque, assinatura de título curto |
| JetBrains Mono | `--zaz-font-mono` | IDs de tarefa, CPFs e chaves Camunda |

A Nunito não é a `sans` de propósito: os cantos arredondados que dão a
personalidade da marca cansam em corpo de texto pequeno, e o próprio manual
reserva a Nunito Sans para interface.

O nome da empresa é sempre **ZAZ**, em caixa alta.

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

**Divergência de roxo — encerrada.** Havia aqui um `#6a1ca0` lido do arquivo de
logo, concorrendo com o roxo de interface. O Manual de identidade 2022 resolveu:
o Roxo ZAZ é **`#5c229c`**, e a escala inteira deriva dele. O token `brand-logo`
foi removido.

Regras de logo: altura mínima 24px; **área de proteção igual à largura da letra
"Z" do próprio logo** — é a medida que o manual usa, e ela acompanha o tamanho da
aplicação sozinha; nada pode invadir esse respiro. Sem sombra, sem contorno e
**nunca girado** (o manual proíbe qualquer ângulo fora do original). Em fundo
escuro, use a versão positiva sobre o roxo — não aplique `filter: invert()`.

O manual também prevê versão com tagline ("Primeira salestech brasileira", em
vertical ou horizontal, só em peças institucionais), versão negativa colorida
como segunda opção e versões em tons de cinza quando não der para usar cor.
Nenhuma dessas está no repositório ainda — temos só o PNG principal.

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

5. **Página nova entra na navegação em `site/nav.js`, não no HTML.** A lista de
   páginas vive num arquivo só; página que não estiver lá nasce invisível para
   o resto do site.

6. **Cada assunto tem ficha própria**: componente em `componentes/`, fundamento
   em `fundamentos/`, padrão em `padroes/`. A ficha segue sempre a mesma ordem
   de seções, copiada do
   [Padrão Digital de Governo](https://www.gov.br/ds/components):

   > Uso → Tom e voz → Anatomia → Detalhamento dos itens → Tipos (ou Ênfases) →
   > Comportamentos → Especificações

   mais duas abas: **Código** (classes, atributos, HTML copiável) e
   **Acessibilidade** (teclado, estilo, `aria`, contraste verificado). Três
   regras não negociáveis:

   - A **figura de anatomia é o componente real**, com marcadores `.marca`
     ancorados por `.peca` — nunca uma imagem exportada, que mente no dia em
     que o CSS muda.
   - Todo item da anatomia tem **coluna Referência** apontando para o
     fundamento que o governa. Componente compõe, não redefine.
   - A especificação é escrita em **token**, com o pixel ao lado. Assim a ficha
     continua certa quando o valor muda.

   Ficha sem anatomia numerada e sem nota de acessibilidade não entra no índice
   de `componentes/index.html` — fica como "na fila".

7. **Nenhum componente escreve cor crua nem lê a escala direto.** Só papéis
   (`--zaz-primary`, `--zaz-text-muted`, `--zaz-border`). Se precisou de uma cor
   que não é papel, ou o papel existe com outro nome, ou falta criar um.

8. Versionamento semântico: mudança de valor de token = minor; remoção ou
   renomeação = major.

### Publicação

O site é servido pelo **nginx da VM do Apolo**, em
<https://apolo.zaz.vc/design-system/>. O GitHub guarda o código; o servidor
serve os arquivos. O GitHub Actions **não** publica — só verifica.

Para atualizar o que está no ar depois de um merge na `main`:

```bash
ssh apolo 'cd /home/worker/design-system && git pull --ff-only'
```

Não há build nem reinício de serviço: o nginx serve os arquivos do disco, e um
`git pull` já é o deploy. O `apolo` do PM2 não é tocado.

O caminho `/design-system/` fica **público**, sem login — igual ao repositório.
São CSS, tokens e o logo. Se algum dia precisar restringir, o lugar é o nginx
(`auth_basic`) ou uma regra de acesso no Cloudflare, não o conteúdo.

---

`© 2026 Zaz Vendas.`
