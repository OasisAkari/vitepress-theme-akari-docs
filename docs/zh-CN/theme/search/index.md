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

默认不需要任何后端：主题使用 VitePress 本地搜索生成的索引，每种语言一个，只在这种语言第一次搜索时下载。页面按标题分成章节，匹配由 [MiniSearch](https://lucaong.github.io/minisearch/) 完成：中文与日文按词切分，词可以只输入开头，较长的词允许拼错一两个字母。开发时修改页面后，索引随之更新。

## 接入其他搜索

需要语义搜索或站外内容时，换成 HTTP 接口或自己的 JS 函数：

```ts
// docs/config.ts
search: {
  backend: { type: "http", endpoint: "/api/docs/search" },
},
```

后端的写法与结果格式见[接口](/theme/search/api)；面板的动效、索引的生成与排序见[技术细节](/theme/search/details)。
