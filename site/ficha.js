/* ============================================================================
   ficha.js — o comportamento das fichas de componente.

   Três coisas, nenhuma dependência: abas, botão copiar e alternador de tema.
   Carregado com `defer` em toda ficha; ausente o elemento, a função não faz
   nada — assim uma ficha que ainda não tem aba de código não quebra.
   ========================================================================== */

/* --- Abas ------------------------------------------------------------------
   A aba escolhida vai para a query string (?tab=codigo), não para o hash: o
   hash é das âncoras de seção, e trocá-lo aqui faria a página pular para o
   topo a cada clique. replaceState mantém o link copiável sem criar uma
   entrada nova no histórico a cada troca. */
(function abas() {
  const barra = document.querySelector("[data-abas]");
  if (!barra) return;

  const botoes = [...barra.querySelectorAll("button[data-aba]")];
  const paineis = new Map(botoes.map((b) => [b.dataset.aba, document.getElementById("painel-" + b.dataset.aba)]));

  function mostrar(nome, comHistorico) {
    if (!paineis.has(nome)) nome = botoes[0].dataset.aba;
    botoes.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.aba === nome)));
    paineis.forEach((painel, chave) => { if (painel) painel.hidden = chave !== nome; });
    if (comHistorico) {
      const url = new URL(location.href);
      url.searchParams.set("tab", nome);
      history.replaceState(null, "", url);
    }
  }

  botoes.forEach((b) => b.addEventListener("click", () => mostrar(b.dataset.aba, true)));

  /* Setas para navegar entre abas — é o que o padrão ARIA de tablist espera de
     quem chega pelo teclado. */
  barra.addEventListener("keydown", (e) => {
    const i = botoes.indexOf(document.activeElement);
    if (i < 0) return;
    const passo = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    const alvo = botoes[(i + passo + botoes.length) % botoes.length];
    alvo.focus();
    mostrar(alvo.dataset.aba, true);
  });

  mostrar(new URLSearchParams(location.search).get("tab") || botoes[0].dataset.aba, false);
})();

/* --- Copiar ----------------------------------------------------------------
   O texto do botão vira "Copiado" por 2s. Sem toast: a confirmação precisa
   estar onde o olho já está, que é no botão que acabou de ser clicado. */
document.querySelectorAll("[data-copiar]").forEach((botao) => {
  botao.addEventListener("click", async () => {
    const bloco = botao.closest(".codigo")?.querySelector("code");
    if (!bloco) return;
    try {
      await navigator.clipboard.writeText(bloco.innerText);
      const antes = botao.textContent;
      botao.textContent = "Copiado";
      setTimeout(() => { botao.textContent = antes; }, 2000);
    } catch {
      /* clipboard bloqueado (http, permissão negada): deixa o usuário
         selecionar à mão em vez de fingir que copiou. */
      const faixa = document.createRange();
      faixa.selectNodeContents(bloco);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(faixa);
    }
  });
});

/* --- Tema ------------------------------------------------------------------
   Mesma chave do docs/ e do Apolo ('tema'), para que alternar aqui valha lá.
   A leitura acontece num <script> inline no <head> de cada ficha, antes do
   primeiro paint — senão a página abre clara e escurece na cara do leitor. */
document.querySelector("[data-tema]")?.addEventListener("click", () => {
  const escuro = document.documentElement.classList.toggle("dark");
  try { localStorage.setItem("tema", escuro ? "dark" : "light"); } catch {}
});
