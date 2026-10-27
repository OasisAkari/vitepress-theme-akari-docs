# 搜索

主题在顶栏提供一个 Material 3 风格的搜索入口。桌面端显示搜索图标、占位文案与快捷键提示；移动端收缩为圆形图标。点击后按钮本身（图标、占位、快捷键与边框的当前样式）被克隆为动画表面，从按钮位置吸附到视口中心；关闭时沿原路径回放并恢复按钮内容。面板内容继续由 `m3e-search-bar`、`m3e-list` 与 `m3e-list-action` 组成。

## 动效与尺寸

搜索面板使用原生 modal `<dialog>` 配合 Web Animations API：

- 打开时把搜索按钮的实时 DOM 克隆为 morph surface，初始帧与按钮逐像素一致：背景、边框、圆角、图标、占位文案与快捷键都保留当前样式。随后表面本身位移、缩放，并插值圆角、边框、背景与阴影到最终面板位置；真实面板在表面接近落点前保持隐藏，因此画面中不会出现一块脱离按钮的空白面板。
- 表面接近面板尺寸时交叉淡入真实面板与内容，内容无需等待完整时长即可操作，空白 surface 不会长时间停留在中心。
- 关闭时先短暂淡出面板内容，再复用当前 morph surface 沿原路径缩回按钮；临近按钮时恢复图标/占位/快捷键，空间运动完全落定后才关闭 modal。
- 动效跟随右侧设置中的“动效”选项：
  - `standard`：空间运动约 300ms，`cubic-bezier(0.2, 0, 0, 1)`。
  - `expressive`：空间运动约 500ms，`cubic-bezier(0.38, 1.21, 0.22, 1)`，表面会轻微过冲后回稳。
- 开启系统“减少动态效果”时退化为直接显示/关闭，不执行位移缩放。
- 搜索按钮按断点自适应：桌面大搜索框、平板收窄、移动端圆形图标；初始帧直接使用按钮当前 rect，动画目标会重新测量面板尺寸，不依赖固定坐标。

原生 dialog 提供 top layer、背景 inert 与 Esc 语义；打开时由 dialog 保持焦点，内容接近落定时进入输入框，关闭后优先恢复打开前的焦点（没有可用焦点时回到搜索按钮）。

默认快捷键为 `⌘K`（macOS）或 `Ctrl K`（其他平台）。在输入框中可以使用：

- `↑` / `↓`：切换结果
- `Enter`：打开当前结果
- `Esc`：关闭搜索
- `Cmd/Ctrl + K`：在任意页面打开搜索

点击遮罩、关闭按钮或再次使用关闭操作都可以退出。结果跳转使用 VitePress 路由器，保持 SPA 导航；带章节锚点的结果会滚动到对应标题。

## 本地索引

默认配置不需要后端服务。开发或构建时，Vite 插件扫描 `docs/**/*.md`，生成 `docs/public/search-index.json`：

- 页面标题来自 frontmatter `title`、首个 H1 或文件名。
- 每个 H2/H3 生成一个可定位的章节条目，锚点与 VitePress 标题 ID 一致。
- fenced code 不进入索引；正文中的 HTML 标签、链接目标与 Markdown 标记会被清理。
- 中文查询使用归一化子串匹配，标题、页面名与正文分别加权。
- 索引在客户端首次搜索时加载并缓存；开发模式下不使用浏览器缓存。

生成文件不提交到仓库，`npm run dev` 与 `npm run build` 会自动刷新。索引文件缺失或格式错误时，弹窗会显示错误与重试。

## 配置

```ts
search: {
  enabled: true,
  placeholder: "搜索文档",
  shortcut: "k",
  maxResults: 8,
  debounce: 180,
  backend: { type: "local" },
}
```

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | `true` | 是否显示顶栏入口与注册快捷键 |
| `placeholder` | `string` | `搜索文档` | 顶栏与输入框占位文案 |
| `shortcut` | `string` | `k` | 与 Cmd/Ctrl 组合的按键；空字符串关闭快捷键 |
| `maxResults` | `number` | `8` | 结果上限，限制在 1–20 |
| `debounce` | `number` | `180` | 输入防抖毫秒数，限制在 0–1000 |
| `backend` | `object` | 本地索引 | `local` / `http` / `registered` |

### 本地后端

```ts
search: {
  backend: {
    type: "local",
    endpoint: "/search-index.json",
  },
}
```

`endpoint` 可以换成其他同源静态 JSON 地址；相对路径会自动拼接站点 base。索引需要符合主题约定的 `SearchIndexFile` 结构。

### HTTP 后端

```ts
search: {
  backend: {
    type: "http",
    endpoint: "/api/docs/search",
    method: "POST",
    headers: {
      Authorization: "Bearer YOUR_TOKEN",
    },
    credentials: "include",
    queryParam: "q",
    limitParam: "limit",
  },
}
```

- `GET` 会把查询与结果上限写入查询参数。
- `POST` 会发送 JSON：`{ "q": "关键词", "limit": 8 }`。
- 相对 endpoint 自动拼接站点 base；绝对 URL 保持不变。
- 响应可以是数组，也可以是 `{ "results": [...] }`。
- 结果字段：`title`、`href`（或 `url`/`path`）、`pageTitle`、`heading`、`excerpt`（或 `content`/`snippet`/`description`）、`id`。
- 请求会携带 `AbortSignal`；输入新查询或关闭弹窗时旧请求会被取消。
- 非 2xx、网络错误或响应结构不合法会显示错误状态与重试按钮。

示例响应：

```json
{
  "results": [
    {
      "id": "button-variants",
      "title": "变体",
      "pageTitle": "按钮",
      "heading": "变体",
      "href": "/components/button#变体",
      "excerpt": "五种外观从高到低表达强调程度……"
    }
  ]
}
```

### 注册 JS 后端

需要在主题入口注册一个异步 handler，然后在配置中引用它的 id。适合需要签名、鉴权、聚合多个数据源或转换响应结构的场景。

```ts
// docs/.vitepress/theme/index.ts
import { registerSearchBackend } from "./search/registry";

registerSearchBackend("my-search", async (query, { limit, signal }) => {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    signal,
  });

  if (!response.ok) throw new Error("自定义搜索失败");

  const data = await response.json();
  return data.results.slice(0, limit);
});
```

```ts
search: {
  backend: {
    type: "registered",
    id: "my-search",
  },
}
```

handler 接收 `query` 与 `{ limit, signal }`，返回 `M3eSearchResult[]` 或 Promise。后端不存在时会显示明确错误，不会静默失败。

## 结果与状态

搜索弹窗包含以下状态：

- **空输入**：展示搜索提示与快捷键说明。
- **加载中**：显示 M3 加载指示器。
- **有结果**：页面 Overline、章节标题、摘要与命中高亮；活动项使用 secondary container 背景。
- **无结果**：提示更换关键词。
- **失败**：显示错误原因与重试按钮，便于自定义后端恢复。

所有动态文本按纯文本渲染，不使用 `v-html`。输入、结果列表与错误提示提供对应 ARIA 标签；原生 dialog 保持页面背景 inert，打开后焦点进入搜索框，关闭后交还给触发入口。

## 可扩展性

- 结果结构统一，HTTP 后端和注册后端遵循同一套归一化逻辑。
- 搜索状态通过 `useM3eSearch()` 提供给自定义触发入口或其他组件。
- 主题入口导出 `registerSearchBackend`、`useM3eSearch` 与相关类型。
- 搜索样式使用 `--md-sys-color-*` 与 m3e CSS 变量，继承右侧设置中的明暗、对比度、色调与 RTL 设置。

## 已知限制

- 本地索引是轻量级子串检索，不提供拼写纠错或向量语义搜索；需要更强能力时接入 HTTP 或注册式后端。
- 本地索引仅在开发服务器或构建时刷新；直接修改 Markdown 后如果开发服务器未运行，需要重新执行 `npm run build` 或 `npm run dev`。
- 搜索结果默认按站内路径处理；注册后端返回外部 URL 时会在新标签页打开。
