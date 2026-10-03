import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const root = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(root, "pages");
const outDir = path.join(root, "output");
const W = 1080;
const H = 1440;
// 1.5x → 1620×2160，3:4 竖图，上传小红书后压缩依然清晰
const SCALE = 1.5;

const only = process.argv.slice(2);
const files = fs
  .readdirSync(pagesDir)
  .filter((f) => /^\d{2}-.*\.html$/.test(f))
  .filter((f) => !only.length || only.some((o) => f.includes(o)))
  .sort();

fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--font-render-hinting=none", "--allow-file-access-from-files"],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });

for (const f of files) {
  await page.goto("file://" + path.join(pagesDir, f), { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);

  const issues = await page.evaluate(
    ({ W, H }) => {
      const out = [];
      for (const el of document.querySelectorAll(".page *")) {
        if (el.closest("[data-allow-overflow]")) continue;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.bottom > H - 24 || r.right > W - 8 || r.left < 8) {
          out.push(`${el.tagName.toLowerCase()}.${[...el.classList].join(".")} → ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}×${Math.round(r.height)}`);
        }
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === "hidden") {
          out.push(`clipped: ${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`);
        }
      }
      return out.slice(0, 12);
    },
    { W, H }
  );

  const out = path.join(outDir, f.replace(/\.html$/, ".png"));
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: W, height: H } });
  console.log(`✓ ${path.relative(root, out)}`);
  for (const i of issues) console.log(`  ⚠ ${i}`);
}

if (!only.length) {
  const pngs = fs.readdirSync(outDir).filter((f) => /^\d{2}-.*\.png$/.test(f)).sort();
  const cols = 3;
  const tw = 360;
  const th = 480;
  const gap = 24;
  const rows = Math.ceil(pngs.length / cols);
  const sheetW = cols * tw + (cols + 1) * gap;
  const sheetH = rows * th + (rows + 1) * gap;
  const imgs = pngs
    .map((p) => `<img src="data:image/png;base64,${fs.readFileSync(path.join(outDir, p)).toString("base64")}">`)
    .join("");
  await page.setViewport({ width: sheetW, height: sheetH, deviceScaleFactor: 2 });
  await page.setContent(
    `<style>body{margin:0;background:#e9edf5;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:${gap}px;padding:${gap}px}
     img{width:${tw}px;height:${th}px;border-radius:14px;box-shadow:0 6px 18px rgba(20,40,90,.18)}</style>${imgs}`,
    { waitUntil: "load" }
  );
  await page.screenshot({ path: path.join(outDir, "preview.png") });
  console.log("✓ output/preview.png");
}

await browser.close();
