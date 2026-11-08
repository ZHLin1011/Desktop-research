# 呱基讲 AI · 竖屏手绘科普

小青蛙主播「呱基」用纯 JavaScript Canvas 做竖屏科普短片。  
面向对 AI 感兴趣、有学习意愿，但缺少专业知识的成年人（老师、传统行业人员、大学生等非 AI 从业者）。

## 本期

**为什么大模型说话有快有慢？**  
Prefill 读题 · Decode 吐字 · 五条少等待干货

约 **72 秒** · 竖屏 9:16 · 正常语速（不加速）· 有声 + 底部字幕

## 成片下载

浏览器打开即可下载（约 7MB，H.264 + AAC，可存手机相册）：

https://github.com/ZHLin1011/Desktop-research/raw/017be90/exports/guaji-llm-speed-vertical-with-audio.mp4

仓库路径：`exports/guaji-llm-speed-vertical-with-audio.mp4`

## 本地预览

```bash
cd llm-explainer
python3 -m http.server 8765
```

浏览器打开 `http://127.0.0.1:8765`（建议手机模式 / 竖屏窗口），点「播放」。

## 文件

| 文件 | 说明 |
|------|------|
| `llm-explainer/index.html` | 竖屏 9:16 可播放短片（字幕画进画面） |
| `llm-explainer/SCRIPT.md` | 完整分镜与口播脚本 |
| `llm-explainer/PROMPT.md` | 可复用生成 Prompt |
| `exports/guaji-llm-speed-vertical-with-audio.mp4` | 有声成片（可直接下载） |
| `exports/README.md` | 成片下载说明 |

## 制作规范（最近定稿）

| 项 | 约定 |
|----|------|
| 角色 | 小青蛙「呱基」 |
| 口播点名 | **只在开场自报家门、收尾道别各一次**，中间不反复喊「呱基」 |
| 受众 | 非 AI 从业者：老师 / 传统行业 / 大学生等 |
| 讲法 | 常见问题 → 原理（类比）→ 实操干货 |
| 画面 | 手绘粉笔风；关键字放大；简单入场/闪烁动画 |
| 字幕 | **有底部字幕**（画进 Canvas，成片可见） |
| 安全边距 | 顶部 / 底部多留空，避开状态栏、灵动岛、Home 条 |
| 节奏 | 段落紧衔接（间隙约 0.2 秒），不拖长静音 |
| 音色 | 聪明清亮（略提速/提亮）；淡入淡出，去掉转场爆破杂音 |
| 规格 | 竖屏 9:16 · 1080×1920 · 正常语速 · **不加速** |
