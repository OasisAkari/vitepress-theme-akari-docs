[English](README.md) | 简体中文

# Vitepress Theme Akari Docs

Vitepress Theme Akari Docs 是一个使用 VitePress 与 [`@m3e/web`](https://github.com/matraic/m3e) Material 3 Expressive Web Components 构建的文档主题，相较于 [Vitepress Theme Akari Blog](https://github.com/OasisAkari/vitepress-theme-akari-blog) 来说，针对文档场景优化了布局。

## 示例

![](./imgs/overview-zh.png)

![](./imgs/overview-dark-zh.png)

## 环境要求

- Node.js >= 22.12
- npm

## 开发

```bash
npm install
npm run dev
```

默认开发地址为 `http://localhost:5173`。

## 构建与检查

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

生产输出位于 `docs/.vitepress/dist`。

## 配置文档

有关本主题的更多配置文档，请见[这里](https://vitepress-theme-akari-docs.vercel.app/zh-CN/)。