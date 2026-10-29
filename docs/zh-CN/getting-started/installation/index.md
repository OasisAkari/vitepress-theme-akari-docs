---
icon: package_2
order: 1
---

# 安装

主题就放在仓库的 `docs/.vitepress/theme` 中，不需要另外安装主题包。

## 环境要求

- Node.js `>=22.12.0`（`package.json` 的 `engines`）；本仓库在 Node.js `24.21.0`、npm `12.2.1` 下验证。
- npm，仓库只保留一份 `package-lock.json`。

## 安装与启动

```bash
npm install
npm run dev
```

开发服务器默认在 `http://localhost:5173`。持续集成中用 `npm ci` 按锁文件安装。

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 开发服务器；修改 Markdown 即时更新，修改 `config.ts` 自动重启 |
| `npm run build` | 构建静态站点到 `docs/.vitepress/dist` |
| `npm run preview` | 本地预览构建结果 |
| `npm run typecheck` | 用 `vue-tsc --noEmit` 检查主题与测试 |
| `npm test` | 运行 Vitest 单元测试 |

## 版本基线

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| `vitepress` | `2.0.0-alpha.21` | 固定版本，基于 Vite 8 / Rolldown 与 Vue 3.5 |
| `@m3e/web` | `2.10.2` | Material 3 Expressive Web Components |
| `@m3e/icons` | `1.0.21` | 按需注册的 Material Symbols 图标 |

VitePress 仍处于 alpha 阶段，升级时需要一并检查主题代码、配置类型与构建输出。

## 目录结构

```text
.
├── docs/
│   ├── config.ts                  各语言共用的配置
│   ├── zh-CN/                     简体中文，放在站点根路径
│   │   ├── config.ts              覆写共用配置
│   │   ├── index.md               首页
│   │   └── getting-started/       rail 分类
│   │       └── installation/
│   │           └── index.md       文章 /getting-started/installation
│   ├── en-US/                     English，放在 /en-US/
│   ├── public/                    静态资源
│   └── .vitepress/
│       ├── config.mts             把主题接入 VitePress
│       ├── content/               由目录生成语言、地址与导航
│       ├── search/                本地搜索索引
│       └── theme/                 主题源码
├── tests/                         单元测试
└── package.json
```

页面与配置怎样放置见[配置](/getting-started/configuration)与[撰写页面](/getting-started/writing)；主题源码的结构见[扩展主题](/theme/extending/api#源码结构)。

## 部署

`npm run build` 的产物是纯静态文件，可以放到任意静态托管。

- **无扩展名地址**：站点开启了 `cleanUrls`，`/theme/layout` 对应文件 `theme/layout.html`。托管服务需要在找不到文件时补上 `.html` 再找：GitHub Pages、Netlify 与 Cloudflare Pages 默认如此；Vercel 需要在 `vercel.json` 中设置 `"cleanUrls": true`；Nginx 写 `try_files $uri $uri.html $uri/ =404;`。
- **部署在子路径**：例如 `https://example.com/docs/`，在 `.vitepress/config.mts` 中设置 `base: "/docs/"`。导航、头图、logo 与搜索索引的站内地址都会自动加上它。
- **搜索索引**：`search-index.json` 在构建时生成并复制到产物根目录，不需要额外步骤。

## 常见问题

### 页面空白或组件没有样式

主题在浏览器中注册 m3e 组件，注册完成后给 `html` 加上 `data-akari-ready`。先看浏览器控制台有没有模块加载错误；脚本被禁用或加载失败时，正文会在 3 秒后以纯 HTML 显示。浏览器需要支持 Custom Elements、Shadow DOM 与原生 ES 模块。

### 为什么组件只在浏览器注册

m3e 组件是 Lit 自定义元素，注册需要 `customElements.define`，Node.js 中没有。主题入口只在浏览器中导入 `m3e.ts`，服务端渲染只输出元素标记与插槽内容。不要在服务端执行的代码里导入 `@m3e/web` 的组件模块。

### 新增的组件或图标不显示

组件与图标都是按需注册的：组件在 `docs/.vitepress/theme/m3e.ts` 中导入对应子路径（不要导入 `@m3e/web/all`，它会注册全部组件），图标在 `icons.ts` 中导入。未注册的图标显示为空白。

### 构建时提示未知的 Vue 组件

`.vitepress/config.mts` 用 `vue.template.compilerOptions.isCustomElement` 放行了以 `m3e-` 开头的标签。在别的项目中复用主题时需要保留这段配置。
