# 安装

本页说明如何在本地准备运行环境、安装依赖、验证版本，并生成可部署的静态站点。项目是一个单仓库 VitePress 站点，主题位于 `docs/.vitepress/theme`，不需要额外安装 VitePress 主题包。

## 环境要求

- Node.js `>=22.12.0`，由 `package.json` 的 `engines` 字段约束；本仓库实际验证版本为 Node.js `24.21.0`、npm `12.2.1`。
- 使用 npm 作为包管理器，仓库只保留一份 `package-lock.json`。
- 操作系统不限，macOS、Linux 与 Windows 均可；构建不依赖全局 CLI。

<div class="demo-surface">
  <div class="demo-row">
    <m3e-chip>
      <m3e-icon slot="icon" name="check"></m3e-icon>
      Node.js 24.21.0
    </m3e-chip>
    <m3e-chip>
      <m3e-icon slot="icon" name="check"></m3e-icon>
      npm 12.2.1
    </m3e-chip>
    <m3e-chip variant="elevated">
      <m3e-icon slot="icon" name="package_2"></m3e-icon>
      单一 lockfile
    </m3e-chip>
  </div>
</div>

## 安装依赖

在仓库根目录执行：

```bash
node -v
npm -v
npm install
```

持续集成环境建议使用锁定安装，确保依赖树与 `package-lock.json` 完全一致：

```bash
npm ci
```

依赖安装完成后，主题与图标已经随 `@m3e/web`、`@m3e/icons` 一同就绪，无需再引入外部字体或图标 CDN。

## 版本基线

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| `vitepress` | `2.0.0-alpha.21` | 固定版本，使用 Vite 8 / Rolldown 与 Vue 3.5 |
| `@m3e/web` | `2.10.2` | Material 3 Expressive Web Components |
| `@m3e/icons` | `1.0.21` | 按需注册的 Material Symbols 图标 |
| `@fontsource-variable/roboto` | `^5.3.0` | 本地 Roboto Variable 字体 |
| Node.js | `>=22.12.0` | 实际开发环境为 `24.21.0` |

VitePress 处于 alpha 阶段，升级前需要同时检查主题代码、配置类型与构建输出，不建议在开发过程中单独升级。

## 目录结构

```text
.
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts             站点与主题配置
│   │   └── theme/
│   │       ├── index.ts           主题入口
│   │       ├── config.ts          配置解析
│   │       ├── settings.ts        设置校验与持久化
│   │       ├── sidebar.ts         侧边栏解析
│   │       ├── m3e.ts             Web Components 注册
│   │       ├── icons.ts           图标注册
│   │       ├── layouts/           自定义 Layout
│   │       ├── components/        壳层、侧边栏、设置、内容组件
│   │       ├── composables/       公共组合式函数
│   │       └── styles/            令牌、外壳、正文与设置样式
│   ├── index.md
│   ├── getting-started/
│   ├── theme/
│   ├── styles/
│   ├── components/
│   └── public/                    静态资源
├── specs/                         设计规格
├── tests/                         纯函数单元测试
└── package.json
```

## 开发、构建与预览

```bash
npm run dev
npm run build
npm run preview
```

- `dev` 启动开发服务器，支持热更新与 Markdown 即时预览。
- `build` 执行客户端与服务端构建，输出到 `docs/.vitepress/dist`。
- `preview` 以静态服务器方式预览构建结果，用于检查生产产物。

辅助校验命令：

```bash
npm run typecheck
npm test
```

`typecheck` 使用 `vue-tsc --noEmit` 检查主题源码与测试；`test` 运行 Vitest 单元测试，覆盖配置默认值、侧边栏解析与设置持久化等纯函数。

## 常见问题

### Web Components 为什么只在浏览器注册

m3e 组件是 Lit 自定义元素，注册时会调用 `customElements.define`，Node.js 环境没有该 API。主题入口在 `!import.meta.env.SSR` 条件下动态导入 `m3e.ts`，服务端只输出自定义元素标记与插槽内容，客户端水合后再升级为可交互组件。因此不要在服务端入口直接导入 `@m3e/web` 的组件模块。

### 为什么不要导入 `@m3e/web/all`

`@m3e/web/all` 会一次性注册全部组件，显著增加首包体积。主题的 `m3e.ts` 只注册文档实际使用的模块，新增组件时在该文件补充对应子路径导入，并在 `icons.ts` 注册所需图标。这样首屏只加载主题、按钮、卡片、导航等必要代码。

### 构建时出现自定义元素告警

`docs/.vitepress/config.mts` 已通过 `vue.template.compilerOptions.isCustomElement` 放行所有以 `m3e-` 开头的标签。如果在新项目中复用主题，需要保留这段配置，否则 Vue 编译器会把 `m3e-*` 当作未知 Vue 组件处理。

### 安装后页面空白或组件未升级

确认浏览器控制台没有模块加载错误，并检查 `html` 元素是否带有 `data-m3e-ready` 属性。主题会在组件注册完成后写入该属性；基线样式保证在注册完成前正文仍然可读。若使用旧版浏览器，请先确认其支持 Custom Elements、Shadow DOM 与原生模块。
