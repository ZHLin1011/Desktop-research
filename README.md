# 呱基讲 AI · 竖屏手绘科普

小青蛙主播「呱基」用纯 JavaScript Canvas 做竖屏科普短片。面向对 AI 感兴趣、但缺少专业知识的成年人（老师、传统行业、大学生等）。

## 本期

**为什么大模型说话有快有慢？**  
Prefill 读题 · Decode 吐字 · 五条少等待干货

## 打开方式

```bash
cd llm-explainer
python3 -m http.server 8765
```

浏览器打开 `http://127.0.0.1:8765`（建议手机模式 / 竖屏窗口），点「播放」。

## 文件

| 文件 | 说明 |
|------|------|
| `llm-explainer/index.html` | 竖屏 9:16 可播放短片 |
| `llm-explainer/SCRIPT.md` | 完整分镜与口播脚本 |
| `llm-explainer/PROMPT.md` | 可复用生成 Prompt |

## 角色与口径

- 角色形象：小青蛙「呱基」
- 每段口播：**以「呱基」开头，以「呱基」结尾**
- 讲法：常见问题 → 原理（类比）→ 实操干货
- 视频：**竖屏、正常语速、不加速**
