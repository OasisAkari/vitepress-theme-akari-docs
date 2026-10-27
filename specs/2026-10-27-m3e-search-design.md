# M3E 文档搜索子系统设计

日期：2026-10-27  
状态：已确认  
依赖：VitePress `2.0.0-alpha.21`、`@m3e/web@2.10.2`

## 1. 目标

在 M3E 主题顶栏加入搜索入口，提供符合 Material 3 Expressive 设计规范的居中搜索对话框。支持开箱即用的本地文档索引，以及通过 HTTP 接口或注册 JS handler 接入自定义文档后端。

## 2. 交互

### 顶栏

- 桌面端在顶栏 trailing 区域渲染真实占位的搜索框：搜索图标、`搜索文档` 占位、`⌘K / Ctrl K` 提示。
- 点击搜索框后，按钮的当前样式（背景、边框、圆角、阴影、图标、占位与快捷键）被克隆为动画表面，从按钮位置过渡到居中的自定义原生 `<dialog>`。
- 移动端收缩为圆形搜索图标；宽度低于 768px 时隐藏 GitHub/npm 社交入口，为搜索、设置和标题留出空间。
- 全局快捷键 `Meta/Ctrl + K` 打开搜索；已打开时只聚焦输入框，不重置查询。

### 搜索对话框

- 使用自定义原生 modal `<dialog>` 承载 M3 surface 面板，最大宽度 720px，最大高度 `min(680px, 100dvh - 64px)`；关闭按钮为 `m3e-icon-button`。
- 面板从搜索按钮的真实 rect morph 到视口中心，关闭时反向回放；按钮与面板尺寸均在运行时测量。触发按钮的克隆保留当前计算样式，作为动画表面本身；真实面板在表面接近落点前保持隐藏，避免初始帧出现空白 surface。
- Header 使用 `m3e-search-bar`；morph surface 接近面板尺寸时即交叉淡入面板与内容并聚焦输入框，不等待完整时长。
- 结果使用 `m3e-list` + `m3e-list-action`，每条显示页面 Overline、章节标题、摘要与 `article` 图标。
- 查询高亮使用 `<mark>`，不插入 HTML。
- 键盘：输入框中 `ArrowUp` / `ArrowDown` 切换结果，`Enter` 打开当前结果，`Escape` 关闭；活动结果自动滚入可视区域。
- 状态：空输入提示、加载指示器、错误与重试、无结果、结果列表、结果数量与键盘提示。
- 打开时清空上一次查询；关闭时中止请求并清理状态。结果点击通过 `router.go()` 保持 SPA。

## 3. 本地索引

构建期/开发期从 Markdown 生成 `docs/public/search-index.json`：

```ts
interface SearchIndexEntry {
  id: string
  pageTitle: string
  title: string
  heading: string
  href: string
  content: string
  level: number
}

interface SearchIndexFile {
  version: 1
  generatedAt: string
  entries: SearchIndexEntry[]
}
```

- 扫描 `docs/**/*.md`，排除 `.vitepress`、`public`、`node_modules`。
- 提取 frontmatter title、首个 H1、H2/H3 与章节正文；忽略 fenced code。
- 每个页面生成一个 level 0 页面条目，每个 H2/H3 生成一个章节条目。
- 锚点使用与 VitePress 一致的 slug 规则（NFKD、特殊字符转 `-`、重复加后缀）。
- 中文检索采用归一化后的子串/短语匹配；标题命中权重高于页面名与正文。
- 索引请求在客户端缓存；开发模式下不使用浏览器缓存。

Vite 插件在 `configResolved` 生成索引，并在开发服务器监听 Markdown 的 add/change/unlink 事件做防抖重建。

## 4. 后端配置

```ts
search: {
  enabled?: boolean                 // 默认 true
  placeholder?: string              // 默认 "搜索文档"
  shortcut?: string                 // 默认 "k"；空字符串关闭快捷键
  maxResults?: number               // 默认 8，限制 1..20
  debounce?: number                 // 默认 180ms，限制 0..1000
  backend?:
    | { type: "local"; endpoint?: string }  // 默认，endpoint 默认 /search-index.json
    | {
        type: "http"
        endpoint: string
        method?: "GET" | "POST"
        headers?: Record<string, string>
        credentials?: RequestCredentials
        queryParam?: string          // 默认 "q"
        limitParam?: string          // 默认 "limit"
      }
    | { type: "registered"; id: string }
}
```

HTTP 后端：

- GET 把查询与上限写入 query 参数；POST 以 JSON body 发送。
- 相对 endpoint 自动应用站点 base。
- 返回 `SearchResult[]` 或 `{ results: SearchResult[] }`。
- 失败、非 2xx、格式非法都进入错误状态。

注册后端：

```ts
registerSearchBackend(id, async (query, { limit, signal }) => SearchResult[])
```

统一结果：

```ts
interface M3eSearchResult {
  id: string
  title: string
  href: string
  pageTitle?: string
  heading?: string
  excerpt?: string
}
```

后端返回的结果会被归一化、截断标题与摘要、过滤缺失 href 的项，并按 `maxResults` 截断。外部 URL 由结果组件保留原生行为；站内路径通过 `withBase` 与 `router.go` 导航。

## 5. 模块边界

```text
docs/.vitepress/search/
  parse.ts            # Markdown/frontmatter -> SearchIndexEntry[]（纯函数）
  generate.ts         # 扫描 docs、生成 search-index.json
  indexPlugin.ts      # Vite 索引插件
docs/.vitepress/theme/search/
  types.ts            # 索引条目、backend/handler 类型
  local.ts            # 本地检索排序、摘要、归一化
  highlight.ts        # 查询高亮分段
  backends.ts         # local/http/registered 适配与响应归一化
  registry.ts         # registerSearchBackend
  useSearch.ts        # provide/inject 搜索状态、防抖、请求取消、快捷键
  components/SearchTrigger.vue
  components/SearchDialog.vue
```

修改点：

- `types.ts`/`config.ts` 增加 `search` 配置与默认值。
- `AppBar.vue` 接入触发器与响应式操作区。
- `M3eLayout.vue` provide 搜索状态并挂载对话框。
- `m3e.ts` 注册 search/list/loading-indicator 组件；`icons.ts` 注册 search/article/error/search_off。
- `styles/index.css` 引入搜索样式。
- 新增 `docs/theme/search.md`、侧边栏条目、配置页/README/spec 更新。
- `gray-matter` 作为构建期依赖加入 devDependencies。
- `docs/public/search-index.json` 为生成产物，加入 `.gitignore`。

## 6. 错误与边界

- 本地索引文件缺失/格式错误：显示错误与重试；提示检查构建或后端配置。
- 注册后端不存在：显示明确错误“未找到搜索后端 …”。
- 请求竞态：只接受最新请求结果；关闭对话框或新查询会 abort 旧请求。
- 空查询不发请求；纯空白按空处理。
- 无结果、短查询、超长查询都不会破坏布局；查询与摘要截断。
- 所有动态文本按纯文本渲染，不执行 HTML。

## 7. 实施修订

- 搜索弹窗外壳从 `m3e-dialog` 替换为自定义原生 `<dialog>` + M3 panel：`m3e-dialog` 的动画位于 shadow/top layer，无法从顶栏按钮位置 morph 到中心。
- 打开动画以搜索按钮的 DOM 克隆作为 morph surface：初始帧复制按钮当前计算样式（图标、占位、快捷键、边框与背景），表面本身位移、缩放并以圆角/边框/阴影插值到面板位置；不再是“按钮留在原处 + 空白面板从中心展开”。
- morph surface 接近面板尺寸时交叉淡入真实面板与内容；内容淡入与表面收尾重叠，避免表面提前到位后长时间空白。
- 关闭先短暂淡出面板内容，再复用当前 morph surface 沿原路径缩回按钮；接近按钮时恢复图标/占位/快捷键，空间运动完全落定后才关闭 modal，避免 expressive 过冲造成末帧跳变。
- 动效跟随 `settings.motion`：standard 空间运动约 300ms `cubic-bezier(0.2,0,0,1)`，expressive 约 500ms `cubic-bezier(0.38,1.21,0.22,1)`；原生 dialog 提供 top layer、背景 inert、Esc 与焦点约束。
- 打开时由 dialog 保持焦点，内容落定即进入输入框；关闭优先恢复打开前焦点，否则回到搜索按钮。
- `m3e-search-bar` 不启用 clearable，面板 header 只保留一个 `m3e-icon-button` 关闭按钮。
- 索引生成产物位于 `docs/public/search-index.json`，由 Vite 插件在 `configResolved`、开发服务器 Markdown 变化和 `closeBundle` 时维护；当前构建包含 13 个内容页。
- 搜索输入增加 `id` / `name`，避免浏览器表单字段无障碍提示。

## 8. 验收

- 桌面/移动顶栏入口正确，移动端无横向溢出。
- 搜索弹窗动画、焦点、Escape/遮罩/X 关闭、焦点陷阱正常。
- 本地索引覆盖全部 12+ 页面与章节，中文查询可命中，结果跳转正确。
- HTTP 后端请求构造与响应归一化通过单测。
- 注册 JS 后端可通过 `registerSearchBackend` 接入并有错误兜底。
- 空态/加载/错误/无结果/结果五种状态均可在浏览器或单测中验证。
- `npm run typecheck`、`npm test`、`npm run build` 通过，控制台无错误。
- 新文档页说明本地索引、HTTP 配置、注册后端、结果结构与快捷键。
