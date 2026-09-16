/* ============================================================================
   paleta.js — desenha as escalas de cor lendo os tokens do próprio navegador.

   Por que não escrever os hexadecimais na página: uma paleta com o valor
   digitado à mão mente no dia em que o token muda, e mente em silêncio — a
   amostra continua bonita, só está errada. Aqui cada amostra pergunta ao
   navegador quanto vale `--zaz-brand-600` neste momento. Token renomeado
   aparece como amostra vazia, que é o comportamento certo: some da página em
   vez de mostrar uma cor que não existe mais.

   Markup esperado:
     <div class="escala" data-escala="brand" data-graus="50,100,…"></div>
     <div class="chips" data-chips="area" data-itens="rh:RH,gestor:Gestor"></div>
   ========================================================================== */

/** Resolve uma variável CSS no contexto do documento. */
function valorDoToken(nome) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

/** rgb()/hex → luminância relativa, pela fórmula da WCAG. */
function luminancia(cor) {
  const m = cor.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return 1;
  const [r, g, b] = m.slice(0, 3).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Decide se o rótulo da amostra fica claro ou escuro, em vez de chutar pelo
    número do grau — que não vale para as famílias sem escala. */
function tintaLegivel(corDeFundo) {
  return luminancia(corDeFundo) > 0.42 ? "var(--zaz-neutral-900)" : "#ffffff";
}

/** Converte o rgb() que o navegador devolve para hexadecimal, que é como o
    designer escreve e como o token está no JSON. */
function paraHex(cor) {
  const m = cor.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return cor;
  return "#" + m.slice(0, 3).map((v) => Number(v).toString(16).padStart(2, "0")).join("");
}

document.querySelectorAll("[data-escala]").forEach((alvo) => {
  const familia = alvo.dataset.escala;
  const graus = (alvo.dataset.graus || "").split(",").map((g) => g.trim()).filter(Boolean);

  alvo.innerHTML = graus
    .map((grau) => {
      const token = `--zaz-${familia}-${grau}`;
      const cor = valorDoToken(token);
      if (!cor) return "";
      return `<div class="escala__tom" style="background:${cor};color:${tintaLegivel(cor)}"
                   title="${token}">
                <span class="escala__grau">${grau}</span>
                <span class="escala__hex">${paraHex(cor)}</span>
              </div>`;
    })
    .join("");
});

document.querySelectorAll("[data-chips]").forEach((alvo) => {
  const familia = alvo.dataset.chips;
  const itens = (alvo.dataset.itens || "").split(",").map((p) => p.split(":"));

  alvo.innerHTML = itens
    .map(([chave, rotulo]) => {
      const token = `--zaz-${familia}-${chave}`;
      const cor = valorDoToken(token);
      if (!cor) return "";
      /* O ponto carrega a cor e o rótulo fica neutro: é a regra de uso destas
         duas famílias, e a própria amostra obedece a ela. */
      return `<span class="chip" title="${token}">
                <span class="chip__ponto" style="background:${cor}"></span>
                <span class="chip__nome">${rotulo}</span>
                <span class="chip__hex">${paraHex(cor)}</span>
              </span>`;
    })
    .join("");
});
