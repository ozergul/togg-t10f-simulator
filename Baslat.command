#!/bin/zsh
cd "${0:A:h}" || exit 1
if curl -fsS http://127.0.0.1:5178/ | grep -q 'EV Atölye'; then
  open http://127.0.0.1:5178/
  exit 0
fi
if [[ ! -d node_modules ]]; then
  npm install || exit 1
fi
open http://127.0.0.1:5178/
npm run dev -- --port 5178 --strictPort
