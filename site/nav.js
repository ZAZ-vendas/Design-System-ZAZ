/* ============================================================================
   nav.js — a navegação do site, num lugar só.

   Cada página do sistema (fundamento, componente, hub) declara apenas

       <nav class="ficha__nav" data-nav data-raiz="../../"></nav>

   e este arquivo monta a lista inteira. O motivo é de manutenção: com mais de
   vinte páginas, uma navegação copiada em cada arquivo garante que a próxima
   página nova nasça faltando em metade do site.

   `data-raiz` é o caminho de volta à raiz publicada (`../../` dentro de
   fundamentos/cores/, `../` dentro de componentes/). Os href abaixo são todos
   relativos à raiz, e o prefixo é colado na hora.
   ========================================================================== */

const NAVEGACAO = [
  {
    grupo: "Começar",
    itens: [
      { nome: "Página inicial", href: "" },
      { nome: "Como consumir", href: "docs/" },
      { nome: "Modelos prontos", href: "docs/#modelos" },
      { nome: "Telas de referência", href: "docs/#telas" },
    ],
  },
  {
    grupo: "Fundamentos",
    itens: [
      { nome: "Cores", href: "fundamentos/cores/" },
      { nome: "Tipografia", href: "fundamentos/tipografia/" },
      { nome: "Espaço, raios e sombras", href: "fundamentos/espaco/" },
      { nome: "Tema claro e escuro", href: "fundamentos/tema/" },
      { nome: "Ícones e movimento", href: "fundamentos/iconografia/" },
      { nome: "Conteúdo e voz", href: "fundamentos/voz/" },
    ],
  },
  {
    grupo: "Componentes",
    itens: [
      { nome: "Visão geral", href: "componentes/" },
      { nome: "Botão", href: "componentes/botao/" },
      { nome: "Campo", href: "componentes/campo/" },
      { nome: "Badge", href: "componentes/badge/" },
      { nome: "Card e métrica", href: "componentes/card/" },
      { nome: "Tabela e lista", href: "componentes/tabela/" },
      { nome: "Sobreposições", href: "componentes/sobreposicoes/" },
    ],
  },
  {
    grupo: "Padrões",
    itens: [
      { nome: "Shell", href: "padroes/shell/" },
      { nome: "Layouts de slide", href: "docs/#slides", pendente: true },
      { nome: "Formulário", href: "docs/", pendente: true },
    ],
  },
];

(function montarNavegacao() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;

  const raiz = nav.dataset.raiz ?? "";
  /* Normaliza para comparar: /design-system/componentes/campo/ e
     /componentes/campo/ têm de casar, porque o site roda tanto na raiz de um
     servidor local quanto sob /design-system/ no nginx do Apolo. */
  const aqui = location.pathname.replace(/index\.html$/, "");

  const html = [
    `<a class="ficha__voltar" href="${raiz || "./"}">← ZAZ Apolo Design System</a>`,
  ];

  for (const { grupo, itens } of NAVEGACAO) {
    html.push(`<strong>${grupo}</strong>`);
    for (const item of itens) {
      const destino = raiz + item.href;
      /* Só marca como página atual quem tem endereço próprio: um link com #
         aponta para uma seção do hub, não para esta página. */
      const alvo = item.href.split("#")[0];
      const atual = alvo && aqui.endsWith("/" + alvo) ? ' aria-current="page"' : "";
      const marca = item.pendente ? ' <span class="ficha__pendente" title="Ainda sem ficha própria">·</span>' : "";
      html.push(`<a href="${destino}"${atual}>${item.nome}${marca}</a>`);
    }
  }

  html.push(
    '<div class="ficha__rodape">' +
      '<button class="zaz-btn zaz-btn--secondary zaz-btn--sm zaz-btn--block" data-tema>Alternar tema</button>' +
      "</div>"
  );

  nav.innerHTML = html.join("\n");
})();
