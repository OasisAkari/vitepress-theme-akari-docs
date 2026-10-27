# 布局与顶栏

主题采用“应用式文档”布局：页面本身不滚动，顶栏固定高度，抽屉容器占满剩余视口，正文在圆角内容面板内部滚动。这样左侧导航、右侧目录与设置抽屉可以同时保持可见，滚动只发生在阅读区域内。

## 应用壳结构

`M3eLayout.vue` 输出的结构可以简化为：

```text
<m3e-theme>
  <AppBar />
  <m3e-drawer-container start start-mode="auto" end-mode="auto">
    <div slot="start"> <Sidebar /> </div>
    <main class="m3e-main">
      <m3e-content-pane id="m3e-doc-content">
        <Content />
        <Footer />
      </m3e-content-pane>
      <m3e-toc for="m3e-doc-content" max-depth="3"></m3e-toc>
    </main>
    <div slot="end"> <Settings /> </div>
  </m3e-drawer-container>
</m3e-theme>
```

关键点：

- `body` 高度锁定为 `100dvh` 并隐藏溢出，避免移动端地址栏变化造成双滚动条。
- `m3e-drawer-container` 以 `start` 与 `end` 两个插槽承载导航和设置，`start-mode` / `end-mode` 为 `auto`，由组件在常驻抽屉与模态抽屉之间切换。
- 内容面板拥有独立的滚动容器，页脚跟随正文，不参与外层滚动。
- `m3e-theme` 包裹整个应用，集中提供动态颜色、明暗模式、对比度与动效。

## 顶栏配置

顶栏由 `themeConfig.m3e.appBar` 控制：

```ts
appBar: {
  title: "M3E 文档主题",
  version: "v2.10.2",
  logo: "/logo.svg",
  showSidebarToggle: true,
  showSettingsToggle: true,
  socialLinks: [
    {
      icon: "github",
      link: "https://github.com/matraic/m3e",
      label: "M3E GitHub",
    },
    {
      icon: "npm",
      link: "https://www.npmjs.com/package/@m3e/web",
      label: "@m3e/web npm",
    },
  ],
}
```

内置顶栏使用 `m3e-app-bar` 的四个插槽：

- `leading`：菜单按钮，内部使用抽屉开关控制左侧导航，图标在 `menu` 与 `menu_open` 之间切换。
- `title`：品牌图标、标题与版本 Chip；标题过长时截断省略。
- `subtitle`：预留给需要副标题的自定义顶栏，默认顶栏未占用。
- `trailing`：社交入口、设置按钮与工具提示；设置按钮同样通过抽屉开关控制右侧面板。

`showSidebarToggle` 与 `showSettingsToggle` 分别控制两个图标按钮。关闭设置整体功能时，即使 `showSettingsToggle` 为 `true`，设置按钮也不会出现。社交链接的 `icon` 为 `github`、`npm` 时使用内联品牌图形，其它值交给已注册的 `m3e-icon`。

下面的静态演示只展示顶栏结构，位于普通文档流中，不使用固定定位，因此不会遮挡正文：

<div class="demo-surface">
  <m3e-app-bar>
    <m3e-icon-button slot="leading" aria-label="切换导航" toggle>
      <m3e-icon name="menu"></m3e-icon>
      <m3e-icon slot="selected" name="menu_open"></m3e-icon>
    </m3e-icon-button>
    <span slot="title">M3E 文档主题</span>
    <m3e-chip slot="trailing">v2.10.2</m3e-chip>
    <m3e-icon-button id="layout-demo-settings" slot="trailing" aria-label="设置" toggle>
      <m3e-icon name="settings"></m3e-icon>
    </m3e-icon-button>
    <m3e-tooltip for="layout-demo-settings">打开设置抽屉</m3e-tooltip>
  </m3e-app-bar>
</div>

实际站点的顶栏固定在应用壳顶部，背景使用 `surface-container-low`，不随内容滚动。页面级 `html`/`body` 背景与前景由 Layout 从当前 `m3e-theme` 色板同步到根元素，跟随明暗模式与配色设置。

## 内容面板与目录

内容面板是 `m3e-content-pane`，主题为其设置：

- 背景：`--md-sys-color-surface-container-lowest`
- 圆角：`28px`
- 内边距：`32px`
- 标识：`id="m3e-doc-content"`，供目录与滚动逻辑引用

文章标题、正文、表格、代码块和页脚都渲染在这个面板内。代码复制按钮沿用 VitePress 核心注入的 `button.copy`，主题只负责视觉样式，不替换节点，因此复制行为与 VitePress 完全一致。

右侧 `m3e-toc` 指向内容面板，扫描其中的标题层级（受 `maxDepth` 限制）并生成可点击目录。目录会监听 DOM 变化，路由切换或内容更新后自动重建，无需手动刷新。`overline` 默认显示“本页内容”，标题取自当前页面。

```ts
toc: {
  enabled: true,
  maxDepth: 3,
  overline: "本页内容",
}
```

`maxDepth` 解析时限制在 `1` 到 `6`。目录在窄屏下隐藏，为正文让出宽度。

## 路由与滚动

VitePress 完成路由切换后，主题通过 `onContentUpdated` 在下一帧找到内容面板 Shadow DOM 内的 `.scroll-container`，把滚动位置重置到顶部。这样从长页面跳转到新页面时不会停留在中间位置。

目录的激活项由 `m3e-toc` 根据标题位置自动计算，不需要主题维护滚动监听。页内锚点点击仍由浏览器处理，滚动发生在内容面板内部而不是窗口。

## 响应式断点

- 桌面：左侧导航与右侧设置可同时常驻，内容面板随窗口伸缩，目录固定在右侧。
- 宽度小于 `960px`：右侧目录隐藏，正文与内容面板保留。
- 宽度小于 `600px`：内容面板贴边，只保留顶部两个圆角，内边距收紧到 `24px 20px`。
- 移动端：抽屉以覆盖模式打开，点击遮罩或选择导航项后关闭；顶栏菜单按钮与设置按钮仍然可用。

断点只影响布局呈现，不改变配置解析与路由匹配逻辑。

## 自定义顶栏

需要品牌区、搜索框或额外操作时，通过 `themeConfig.m3e.components.AppBar` 替换顶栏。自定义组件应保留 `m3e-app-bar` 根元素、抽屉开关与无障碍标签，避免破坏移动端导航与键盘操作。完整示例见[扩展主题](/theme/extending)。
