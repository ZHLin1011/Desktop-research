# 呱基讲 AI · 竖屏手绘科普

小青蛙主播「呱基」用纯 JavaScript Canvas 做竖屏科普短片。  
面向对 AI 感兴趣、有学习意愿，但缺少专业知识的成年人（老师、传统行业人员、大学生等非 AI 从业者）。

## 系列成片

| 期 | 话题 | 时长 | 页面 | 成片 |
|----|------|------|------|------|
| 1 | 为什么大模型说话有快有慢 | ~72s | [index.html](llm-explainer/index.html) | [下载](https://github.com/ZHLin1011/Desktop-research/raw/017be90/exports/guaji-llm-speed-vertical-with-audio.mp4) |
| 2 | 没有网络还能运行 AI 吗 | ~82s | [edge-vs-cloud.html](llm-explainer/edge-vs-cloud.html) | [下载](https://github.com/ZHLin1011/Desktop-research/raw/63ef79f/exports/guaji-edge-vs-cloud-with-audio.mp4) |
| 3 | 大模型除了会读会写还有什么技能 | ~93s | [modalities.html](llm-explainer/modalities.html) | 见推送后 `exports/guaji-modalities-with-audio.mp4` |

## 制作规范（定稿）

| 项 | 约定 |
|----|------|
| 角色 | 小青蛙「呱基」 |
| 口播点名 | 只在开场 / 收尾各一次 |
| 讲法 | 常见问题 → 原理（类比）→ 实操干货 |
| 画面 | 手绘粉笔风；关键字放大；简单动画 |
| 字幕 | 底部字幕画进 Canvas |
| 安全边距 | 顶部 / 底部多留空（灵动岛 / Home 条） |
| 节奏 | 正常语速、紧衔接（约 0.2 秒间隙）、不加速 |
| 音色 | 聪明清亮；淡入淡出 |
| 规格 | 竖屏 9:16 · 1080×1920 · H.264 + AAC |

## 本地预览

```bash
cd llm-explainer && python3 -m http.server 8765
```

- 第 1 期：`http://127.0.0.1:8765/`
- 第 2 期：`http://127.0.0.1:8765/edge-vs-cloud.html`
- 第 3 期：`http://127.0.0.1:8765/modalities.html`

## 文件

| 路径 | 说明 |
|------|------|
| `llm-explainer/index.html` | 第 1 期 |
| `llm-explainer/edge-vs-cloud.html` | 第 2 期 |
| `llm-explainer/modalities.html` | 第 3 期 |
| `llm-explainer/SCRIPT*.md` | 各期脚本 |
| `llm-explainer/PROMPT.md` | 可复用 Prompt |
| `exports/*.mp4` | 有声成片 |
| `exports/README.md` | 下载说明 |
