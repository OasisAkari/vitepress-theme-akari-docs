---
title: Overview
toc: false
category: getting-started
icon: home
---

# Overview

Vitepress Theme Akari Docs is a documentation theme built with VitePress and `@m3e/web`.

<div class="demo-row">
  <m3e-button variant="filled" href="/getting-started/installation.html">
    <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
    Installation guide
  </m3e-button>
  <m3e-chip>
    <m3e-icon slot="icon" name="check"></m3e-icon>
    Theme ready
  </m3e-chip>
  <m3e-chip variant="elevated">
    <m3e-icon slot="icon" name="layers"></m3e-icon>
    Web Components
  </m3e-chip>
  <m3e-badge size="large">v1.0.0</m3e-badge>
</div>

## Features

<div class="demo-grid">
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Material 3 Expressive</m3e-heading>
    <div slot="content">Color, shape, motion and typography all come from the m3e design tokens and match the official Material 3.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Organized by folders</m3e-heading>
    <div slot="content">In a language folder, folders are categories and the folders in them are articles. The navigation and the language list come from the folders and the frontmatter.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Parallel pages and hero</m3e-heading>
    <div slot="content">An article can be split into several pages, switched with a tab bar. A page with a hero takes its colors from the image.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Settings and appearance</m3e-heading>
    <div slot="content">Four light and dark modes. Color, variant, contrast, motion, text direction and text size apply instantly and are saved in the current browser.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Search and multiple languages</m3e-heading>
    <div slot="content">The local index works out of the box, and you can swap it for an HTTP or custom backend. Switching language keeps you on the matching page.</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="large">Replaceable and extensible</m3e-heading>
    <div slot="content">Replace components such as the app bar, the table of contents and the footer, or override CSS variables to adjust the look.</div>
  </m3e-card>
</div>

## Quick start

```bash
npm install
npm run dev
```

Read next:

- [Installation](/getting-started/installation): creating a repository from the template, requirements and deployment.
- [Configuration](/getting-started/configuration): shared config and language config.
- [Writing pages](/getting-started/writing): new articles, frontmatter and Markdown.
- [Layout and app bar](/theme/layout), [Side navigation](/theme/sidebar): the parts of the theme shell.

This site comes in Chinese, English, Japanese, Korean, French and Arabic. Switch with the language button at the bottom of the rail.
