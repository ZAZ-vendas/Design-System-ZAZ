#!/usr/bin/env bash
#
# Instala o caminho /design-system/ no nginx que ja serve o Apolo.
#
#   ssh -t apolo 'sudo bash /home/worker/design-system/deploy/instalar-nginx.sh'
#
# Feito para ser seguro de rodar num servidor de producao:
#
#   - idempotente: rodar duas vezes nao duplica nada
#   - faz backup datado da config antes de tocar nela
#   - testa com `nginx -t` ANTES de recarregar
#   - se o teste falhar, restaura o backup sozinho e sai sem recarregar
#   - usa `reload`, nao `restart`: quem esta usando o Apolo nao perde a conexao
#
# O bloco em si nao e inserido no meio do arquivo: ele vai para
# /etc/nginx/snippets/ e a config do site ganha uma linha de `include`. Assim a
# config do Apolo muda em UMA linha, facil de achar e de desfazer.

set -euo pipefail

SITE=/etc/nginx/sites-available/zaz-tasklist
SNIPPET=/etc/nginx/snippets/design-system.conf
FONTE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/nginx-design-system.conf"
INCLUDE="    include snippets/design-system.conf;"
RAIZ=/home/worker/design-system

erro() { echo "ERRO: $*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || erro "rode com sudo."
[ -f "$FONTE" ]      || erro "nao achei $FONTE"
[ -f "$SITE" ]       || erro "nao achei $SITE"
[ -f "$RAIZ/index.html" ] || erro "nao achei $RAIZ/index.html — o clone rodou?"

# ---------------------------------------------------------------- snippet
install -m 0644 "$FONTE" "$SNIPPET"
echo "snippet instalado em $SNIPPET"

# ------------------------------------------------------------------ include
if grep -qF "snippets/design-system.conf" "$SITE"; then
  echo "include ja existia — nada a inserir"
else
  BACKUP="${SITE}.bak-$(date +%Y%m%d-%H%M%S)"
  cp -p "$SITE" "$BACKUP"
  echo "backup: $BACKUP"

  # Insere logo depois da PRIMEIRA linha `index ...;`, que fica dentro do
  # server { } e antes dos location. Ancorar numa linha existente e conhecida e
  # mais previsivel do que tentar adivinhar onde o bloco server termina.
  grep -qE '^\s*index\s' "$SITE" || erro "nao achei a linha 'index' em $SITE — insira o bloco a mao"

  awk -v linha="$INCLUDE" '
    !feito && $1 == "index" { print; print ""; print linha; feito=1; next }
    { print }
  ' "$SITE" > "${SITE}.novo"

  grep -qF "snippets/design-system.conf" "${SITE}.novo" || erro "a insercao nao pegou; nada foi alterado"
  mv "${SITE}.novo" "$SITE"
  echo "include inserido em $SITE"

  # -------------------------------------------------------------- validacao
  if ! nginx -t; then
    cp -p "$BACKUP" "$SITE"
    rm -f "$SNIPPET"
    erro "nginx -t falhou. Config restaurada do backup, nada foi recarregado. O Apolo segue no ar."
  fi
fi

nginx -t || erro "nginx -t falhou com o snippet ja instalado. Verifique $SNIPPET"

systemctl reload nginx
echo "nginx recarregado"

# ------------------------------------------------------------------ conferencia
sleep 1
CODIGO=$(curl -s -o /dev/null -w '%{http_code}' http://localhost/design-system/ || echo "000")
echo "teste local: HTTP $CODIGO"
[ "$CODIGO" = "200" ] || erro "esperava 200. Veja /var/log/nginx/zaz-tasklist.error.log"

echo
echo "pronto: https://apolo.zaz.vc/design-system/"
echo "atualizar depois:  cd $RAIZ && git pull --ff-only"
