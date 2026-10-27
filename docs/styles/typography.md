# 排版

文档排版以 Roboto Variable 为西文字体，以系统中文字体作为回退，正文基准字号为 `16px`，行高 `1.65`。标题、正文、代码与表格共用一套基于 `rem` 的节奏，因此设置面板调整字号时，阅读区域会等比缩放。

## 字体栈

```css
body {
  font-family:
    "Roboto Variable",
    Roboto,
    "PingFang SC",
    "Microsoft YaHei",
    system-ui,
    sans-serif;
}
```

- Roboto Variable 由 `@fontsource-variable/roboto` 本地提供，不请求 Google Fonts。
- 中文优先使用系统的苹方或微软雅黑，避免加载体积较大的中文字体文件。
- `system-ui` 作为最后回退，保证在缺少上述字体时仍有合理的字形。
- 主题开启字体平滑与 `text-rendering: optimizeLegibility`，改善大字号标题的观感。

## 标题层级

页面只有一个 H1，作为文档标题；章节使用 H2，子节使用 H3，更细的说明使用 H4。样式对应 Material 3 的 typescale：

| 层级 | 用途 | 视觉规格 |
| --- | --- | --- |
| H1 | 页面标题 | display-large，字重 400，行高紧凑 |
| H2 | 主要章节 | headline-medium，字重 500 |
| H3 | 子节 | headline-small，字重 500 |
| H4 | 细节说明 | title-large，字重 500 |

### 三级标题示例

H3 用于把一个 H2 拆成可扫读的子节。每个子节保持一个主题，避免在同一段里同时讨论配置、样式和组件行为。

#### 四级标题示例

H4 适合补充边界条件、版本差异或参数细节。层级不要跳级，也不要用加粗段落代替标题。

## 正文与辅助文本

正文段落使用 body-large 级别，保持每段三到五行，长段落拆分为列表或小标题。行内代码用于命令、字段名与标签名，例如 `themeConfig.m3e.appBar`、`npm run build` 与 `m3e-card`。

辅助文本使用较小的字号与 `on-surface-variant` 颜色：

<small>最后更新于 2026-10-27，适用于 VitePress 2.0.0-alpha.21 与 @m3e/web 2.10.2。</small>

引用块用于提示来自规格或官方的结论：

> 主题在客户端注册 Web Components，服务端只输出自定义元素标记与插槽内容，避免在 Node.js 环境调用 `customElements.define`。

列表适合并列信息：

- 配置项使用表格，字段多时按模块拆分。
- 步骤使用有序列表，一步只做一件事。
- 注意事项放在引用块或提示容器中，避免淹没在正文里。

链接文本应描述目标，例如[安装与运行环境](/getting-started/installation)，不要使用“点击这里”。

## 组件中的排版

`m3e-heading` 提供 display、headline、title、label 四种外观，可与文档标题混用。下面的演示全部标记为不进入目录：

<div class="demo-stack">
  <m3e-heading m3e-toc-ignore variant="display" size="large" level="2">Display Large</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="headline" size="medium" level="3">Headline Medium</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="title" size="large" level="4">Title Large</m3e-heading>
  <m3e-heading m3e-toc-ignore variant="label" size="large" level="5">Label Large</m3e-heading>
</div>

```html
<m3e-heading variant="display" size="large" level="2">Display Large</m3e-heading>
<m3e-heading variant="headline" size="medium" level="3">Headline Medium</m3e-heading>
<m3e-heading variant="title" size="large" level="4">Title Large</m3e-heading>
<m3e-heading variant="label" size="large" level="5">Label Large</m3e-heading>
```

`level` 决定辅助技术读取的标题层级，`variant` 与 `size` 只影响视觉。卡片标题、设置区块标题与目录标题都使用 `m3e-heading`，并通过 `m3e-toc-ignore` 排除在目录之外。

## 字号缩放

设置面板的字号选项对应根元素的三种尺寸：

| 选项 | 根字号 | 效果 |
| --- | --- | --- |
| 100% | `16px` | 默认阅读尺寸 |
| 150% | `24px` | 适合视力较弱或远距离阅读 |
| 200% | `32px` | 演示与无障碍检查 |

主题把选择写入 `document.documentElement.style.fontSize`。正文、标题、间距与代码块的 `rem` 值随之缩放；m3e 组件自身的字号由组件令牌控制，不会简单放大两倍，但会保持整体布局可用。切换后请检查侧边栏文本截断、表格横向滚动与代码块换行。

## Markdown 写法

页面 H1 已在页首提供，下面展示正文、强调、链接、列表与代码块的写法：

````md
正文段落，包含 **加粗**、*斜体*、`行内代码` 与 [链接](/getting-started/installation)。

> 引用块用于强调结论。

- 列表项一
- 列表项二

```bash
npm run build
```
````

代码块使用围栏语法并标注语言，VitePress 会注入语法高亮与复制按钮。表格使用标准管道语法，表头保持简短；过宽的表格由正文容器横向滚动，不挤压内容面板。

## 可读性建议

- 每行控制在 60 到 80 个西文字符，中文约 30 到 40 字；内容面板的留白已经为此预留。
- 标题层级连续，不跳级使用 H2 与 H4。
- 代码块只展示必要片段，完整配置放在配置页。
- 强调使用少量加粗，避免整段加粗或全大写。
- 颜色与字号都通过令牌和设置控制，不在正文中写内联字号。
