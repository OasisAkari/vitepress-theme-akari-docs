---
title: 概览
toc: false
category: getting-started
icon: home
---

# 概览

Vitepress Theme Akari Docs 是一个用 VitePress `2.0.0-alpha.21` 与 `@m3e/web` `2.10.2` 搭建的文档主题：保留 VitePress 的 Markdown、静态生成与路由，用 Material 3 Expressive Web Components 重写文档外壳。

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
  <m3e-badge size="large">v1.0.0</m3e-badge>
  <m3e-badge for="overview-demo-button" position="above-after">6</m3e-badge>
</div>

## 特性

<div class="demo-grid">
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Material 3 Expressive</m3e-heading>
    <div slot="content">颜色、形状、动效与排版都来自 m3e 的设计令牌，与官方 Material 3 一致。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">按目录组织</m3e-heading>
    <div slot="content">语言文件夹下的目录是分类、文件夹是文章，导航与语言列表都由目录和头部信息生成。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">平行页面与头图</m3e-heading>
    <div slot="content">一篇文章可以分成几页，用标签栏切换；带头图的页面换成图片的配色。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">设置与明暗模式</m3e-heading>
    <div slot="content">四种明暗模式；颜色、色调变体、对比度、动效、方向与字号即时生效，保存在当前浏览器。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">搜索与多语言</m3e-heading>
    <div slot="content">本地索引开箱即用，也可以换成 HTTP 或自定义后端；切换语言停留在对应页面。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">可替换、可扩展</m3e-heading>
    <div slot="content">替换顶栏、目录、页尾等组件，或覆盖 CSS 变量调整外观。</div>
  </m3e-card>
</div>

## 快速开始

```bash
npm install
npm run dev
```

接着阅读：

- [安装](/getting-started/installation)：运行环境、目录结构、构建与部署。
- [配置](/getting-started/configuration)：共用配置与语言配置。
- [撰写页面](/getting-started/writing)：新建文章、头部信息与 Markdown 写法。
- [布局与顶栏](/theme/layout)、[侧边导航](/theme/sidebar)：主题外壳的各个部分。

本站有中文、英文、日文、韩文、法文与阿拉伯文六个版本，用 rail 底部的语言按钮切换。
