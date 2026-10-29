---
icon: search
order: 5
tab: 概览
parallel:
  - api
  - details
---

# 搜索

顶栏右侧是搜索入口：宽屏是带占位文字与快捷键提示的搜索框，窄屏收成圆形按钮。点击它或按 `⌘K`（Windows 与 Linux 上是 `Ctrl K`），搜索框展开为搜索面板。

## 使用

| 按键 | 作用 |
| --- | --- |
| `⌘K` / `Ctrl K` | 在任意页面打开搜索 |
| `↑` / `↓` | 在结果之间移动 |
| `Enter` | 打开当前结果 |
| `Esc` | 关闭搜索 |

结果按页面与章节列出，带有命中的摘要；打开带章节的结果会滚动到对应的标题。多语言站点只返回当前语言的页面。

## 本地索引

默认不需要任何后端：开发与构建时，主题扫描所有 Markdown 页面，生成 `docs/public/search-index.json`。每个页面一条，每个二级、三级标题再各一条。索引不提交到仓库，`npm run dev` 与 `npm run build` 会自动刷新它。

## 接入其他搜索

需要拼写纠错、语义搜索或站外内容时，换成 HTTP 接口或自己的 JS 函数：

```ts
// docs/config.ts
search: {
  backend: { type: "http", endpoint: "/api/docs/search" },
},
```

后端的写法与结果格式见[接口](/theme/search/api)；面板的动效、索引的生成与排序见[技术细节](/theme/search/details)。
