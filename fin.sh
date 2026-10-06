#!/bin/sh
# Uso: sh fin.sh <tipo> <carpeta>   (desde alpha-blueprint/)
cd "$(dirname "$0")/.." || exit 1
rm -f alpha-blueprint/$2/*.browser-check.json alpha-blueprint/$2/*.finalize*.json
node "$HOME/.claude/skills/archify/bin/archify.mjs" finalize "$1" "alpha-blueprint/$2/candidate.json" "alpha-blueprint/$2/$2.html" --quality standard --json 2>/dev/null | node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);
console.log(j.status, JSON.stringify(j.gates));
for (const d of j.diagnostics||[]) { const e=d.evidence||{}; console.log("-", d.message.slice(0,400), e.overflowY!==undefined?("overflowY="+e.overflowY+" overflowX="+e.overflowX+" h="+e.scrollHeight):"", e.text||""); }
if (j.update?.noticeRequired) console.log("UPDATE", j.update.noticeText);
})'
