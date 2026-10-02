# xhs-ai-research

小红书笔记「转 AI 产品后，我做用研的 3 个变化」的配图源文件：每页一个 HTML，用 Chrome 无头渲染成 PNG。

- 成品图：`output/01-cover.png` ~ `output/06-summary.png`（1620×2160，3:4），总览图 `output/preview.png`
- 标题、正文、润色全文、修改说明、发布 checklist：[`文案.md`](./文案.md)

## 目录

```
pages/          每页一个 HTML，styles.css 是共享样式（配色、字体、组件）
assets/emoji/   Fluent 3D emoji（Microsoft，MIT License）
assets/fonts/   字体（脚本下载，不入库）
render.mjs      渲染脚本：HTML → PNG，并检查元素是否溢出画布
output/         渲染结果
```

## 重新渲染

需要 Node 22.12+（puppeteer-core 25 的要求）和本机 Chrome / Chromium。

```bash
npm install
npm run fetch-fonts        # Noto Sans SC / Bitter / Inter / JetBrains Mono（Google Fonts，OFL）
npm run render             # 渲染全部页面 + preview.png
node render.mjs 04         # 只渲染文件名含 04 的页面
```

Chrome 不在 `/usr/local/bin/google-chrome` 时，用 `CHROME_PATH=/path/to/chrome npm run render` 指定。

改文字直接编辑 `pages/*.html`；改配色、字号等全局样式编辑 `pages/styles.css`。
