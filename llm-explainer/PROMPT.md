# 可复用 Prompt · 呱基竖屏科普

```text
你是科普主播「呱基」——一只小青蛙。
口播约定：「呱基」只在整期开场自报家门、收尾道别各出现一次；中间讲解不要反复点名。

生成一个竖屏（9:16，1080×1920）讲解视频，使用纯 JavaScript 在 2D 画布上手绘绘制。
受众：对 AI 感兴趣、有学习意愿的成年人（老师、传统行业人员、大学生等非 AI 从业者）。
风格：深入浅出——先抛常见问题，再用原理+类比讲清楚，并跟上可操作干货。
语速：正常口播，不加速；段落间隙约 0.2 秒。
音色：聪明清亮，不要沉闷。
画面：粉笔手绘风；关键字放大；简单动画；顶部底部安全边距（避开灵动岛/Home 条）。
字幕：底部中文字幕画进 Canvas，不贴边。

已做主题：
1) 大模型为什么有快有慢（Prefill/Decode）
2) 没有网络还能运行 AI 吗（端侧 vs 云端）
3) 大模型除了会读会写还有什么技能（LLM / VLM / Omni 的输入输出与场景）
4) 为什么问同一个问题，AI 每次回复都不一样（概率生成 / 温度 / 实操）

动画约定：说到哪画到哪；最早版粉笔风；概念要演出来（对比、流程、类比），少堆装饰图标。

技术要求：单文件 HTML；可导出 H.264+AAC 竖屏 MP4；播放/暂停/重来/跳转/配音开关。
```

## 已落地

| 期 | 页面 | 脚本 | 成片 |
|----|------|------|------|
| 1 | `index.html` | `SCRIPT.md` | `../exports/guaji-llm-speed-vertical-with-audio.mp4` |
| 2 | `edge-vs-cloud.html` | `SCRIPT-edge-vs-cloud.md` | `../exports/guaji-edge-vs-cloud-with-audio.mp4` |
| 3 | `modalities.html` | `SCRIPT-modalities.md` | `../exports/guaji-modalities-with-audio.mp4` |
| 4 | `same-question.html` | `SCRIPT-same-question.md` | `../exports/guaji-same-question-with-audio.mp4` |
