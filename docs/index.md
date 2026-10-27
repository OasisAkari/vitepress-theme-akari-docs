---
title: 概览
toc: false
---

# 概览

本站是用 VitePress `2.0.0-alpha.21` 与 `@m3e/web` `2.10.2` 搭建的中文文档主题示例。它保留 VitePress 的 Markdown、路由、SSG 与代码高亮，同时用 Material 3 Expressive Web Components 重新实现文档外壳：顶部应用栏、双模式侧边导航、圆角内容面板、右侧目录与设置抽屉。

<div class="demo-row">
  <m3e-button id="overview-demo-button" variant="filled">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    开始使用
  </m3e-button>
  <m3e-button variant="outlined" href="/getting-started/installation">安装指南</m3e-button>
  <m3e-chip>
    <m3e-icon slot="icon" name="check"></m3e-icon>
    主题已就绪
  </m3e-chip>
  <m3e-chip variant="elevated">
    <m3e-icon slot="icon" name="layers"></m3e-icon>
    Web Components
  </m3e-chip>
  <m3e-badge size="large">v2.10.2</m3e-badge>
  <m3e-badge for="overview-demo-button" position="above-after">6</m3e-badge>
</div>

## 核心特性

<div class="demo-grid">
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Material 3 Expressive</m3e-heading>
    <div slot="content">
      颜色、形状、动效与排版全部来自 m3e 的设计令牌，界面语言与官方 Material 3 一致，并支持表现力动效。
    </div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">双模式侧边栏</m3e-heading>
    <div slot="content">
      优先使用富配置 <code>themeConfig.m3e.sidebar</code>，没有时回退到 VitePress 原生 <code>themeConfig.sidebar</code>，迁移成本低。
    </div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">右侧设置</m3e-heading>
    <div slot="content">
      颜色、色调变体、明暗、对比度、动效、文字方向与字号七个区块，修改即时生效并保存在当前浏览器。
    </div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">SSR 与 SPA</m3e-heading>
    <div slot="content">
      VitePress 负责静态生成与路由，主题在客户端注册 Web Components，水合后接管交互，不使用 iframe。
    </div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">组件可覆盖</m3e-heading>
    <div slot="content">
      通过 <code>themeConfig.m3e.components</code> 替换顶栏、侧边栏、设置、目录、页脚或内容容器，保留默认实现作为基线。
    </div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">离线字体与图标</m3e-heading>
    <div slot="content">
      Roboto Variable 由本地依赖提供，图标按需从 <code>@m3e/icons</code> 注册，不依赖 Google Fonts 或图标 CDN。
    </div>
  </m3e-card>
</div>

## 快速开始

在仓库根目录安装依赖并启动开发服务器：

```bash
npm install
npm run dev
```

构建静态站点并本地预览：

```bash
npm run build
npm run preview
```

首次启动后访问终端提示的本地地址，点击左上角菜单按钮展开侧边栏，点击右上角齿轮按钮打开设置抽屉。

## 从这里开始

- [安装与运行环境](/getting-started/installation)：Node 版本、依赖版本与目录结构。
- [站点与主题配置](/getting-started/configuration)：`themeConfig.m3e` 的完整字段与默认值。
- [右侧设置](/theme/settings)：七个设置区块、持久化与隐藏区块。
- [按钮](/components/button)、[卡片](/components/card)、[导航](/components/navigation)：直接查看运行中的组件。

## 范围说明

当前版本聚焦文档主题骨架与核心演示页，搜索后端与多语言内容不在本阶段目标内，后续再行规划。主题能力以配置、组件覆盖和 CSS 令牌三种方式扩展，详见[扩展主题](/theme/extending)。
