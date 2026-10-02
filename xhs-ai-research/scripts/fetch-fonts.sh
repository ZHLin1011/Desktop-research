#!/usr/bin/env bash
# 字体体积较大（思源黑体可变字体约 17MB），不入库，渲染前执行一次即可。
set -euo pipefail

mkdir -p "$(dirname "$0")/../assets/fonts"
cd "$(dirname "$0")/../assets/fonts"
base="https://github.com/google/fonts/raw/main/ofl"

fetch() {
  local out="$1" url="$2"
  if [ -s "$out" ]; then
    echo "skip $out"
    return
  fi
  curl -fsSL --retry 4 --retry-delay 4 -o "$out" "$url"
  echo "ok   $out"
}

fetch NotoSansSC-VF.ttf    "$base/notosanssc/NotoSansSC%5Bwght%5D.ttf"
fetch Bitter-VF.ttf        "$base/bitter/Bitter%5Bwght%5D.ttf"
fetch Inter-VF.ttf         "$base/inter/Inter%5Bopsz,wght%5D.ttf"
fetch JetBrainsMono-VF.ttf "$base/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf"
