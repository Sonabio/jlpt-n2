#!/usr/bin/env bash
# Ghép src/ thành index.html (PWA) và artifact.html (bản dán vào claude.ai Artifact)
set -euo pipefail
cd "$(dirname "$0")"
HEAD_PART=$(sed '/<div class="app">/,$d' src/head.html)
BODY_PART=$(sed -n '/<div class="app">/,$p' src/head.html)
{
  echo '<!doctype html><html lang="vi"><head><meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
  echo '<meta name="theme-color" content="#2B428F" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#0F1220" media="(prefers-color-scheme: dark)">'
  echo '<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icons/icon-192.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png">'
  echo '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="JLPT N2">'
  echo '<style>:root{padding-top:env(safe-area-inset-top,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>'
  echo "$HEAD_PART"
  echo '</head><body>'
  echo "$BODY_PART"
  echo '<script src="data/kanji.js"></script><script src="data/vocab.js"></script>'
  echo '<script>'; cat src/data.js; echo '</script>'
  echo '<script>'; cat src/app.js src/placement.js src/flow.js src/boot.js; echo '</script>'
  echo "<script>if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}</script>"
  echo '</body></html>'
} > index.html
{ cat src/head.html; echo '<script src="data/kanji.js"></script><script src="data/vocab.js"></script>'; echo '<script>'; cat src/data.js; echo '</script>'; echo '<script>'; cat src/app.js src/placement.js src/flow.js src/boot.js; echo '</script>'; } > artifact.html
echo "Built index.html ($(wc -c < index.html) bytes), artifact.html"
