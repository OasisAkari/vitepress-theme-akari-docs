# 导航

主题中的导航分为三层：侧边栏负责全局页面结构，标签页负责同一页面内的视图切换，Chip、过滤 Chip 与徽标负责状态与筛选。三者都来自 m3e，并与 VitePress 路由配合。

## 侧边导航

`m3e-nav-menu` 承载多级导航，`m3e-nav-menu-item` 通过 `label`、`icon`、`badge` 插槽组织内容。分组使用 `open` 展开，当前叶子项使用 `selected` 高亮：

<div class="demo-surface" style="max-width: 320px; max-block-size: 320px;">
  <m3e-nav-menu aria-label="组件导航演示">
    <m3e-nav-menu-item open>
      <m3e-icon slot="icon" name="widgets"></m3e-icon>
      <span slot="label">组件</span>
      <m3e-nav-menu-item>
        <m3e-icon slot="icon" name="radio_button_checked"></m3e-icon>
        <a slot="label" href="/components/button">按钮</a>
      </m3e-nav-menu-item>
      <m3e-nav-menu-item selected>
        <m3e-icon slot="icon" name="language"></m3e-icon>
        <a slot="label" href="/components/navigation">导航</a>
      </m3e-nav-menu-item>
    </m3e-nav-menu-item>
    <m3e-nav-menu-item>
      <m3e-icon slot="icon" name="dashboard"></m3e-icon>
      <a slot="label" href="/components/card">卡片</a>
      <span slot="badge">New</span>
    </m3e-nav-menu-item>
  </m3e-nav-menu>
</div>

```html
<m3e-nav-menu aria-label="组件导航演示">
  <m3e-nav-menu-item open>
    <m3e-icon slot="icon" name="widgets"></m3e-icon>
    <span slot="label">组件</span>
    <m3e-nav-menu-item selected>
      <m3e-icon slot="icon" name="language"></m3e-icon>
      <a slot="label" href="/components/navigation">导航</a>
    </m3e-nav-menu-item>
  </m3e-nav-menu-item>
  <m3e-nav-menu-item>
    <m3e-icon slot="icon" name="dashboard"></m3e-icon>
    <a slot="label" href="/components/card">卡片</a>
    <span slot="badge">New</span>
  </m3e-nav-menu-item>
</m3e-nav-menu>
```

分组是否展开由 `open` 控制，也可以在运行时由组件根据子项选择状态自动管理。`disabled` 会禁用该项及其所有子项。菜单默认在高度受限时内部滚动。

## 标签页

`m3e-tabs` 的直接子元素只能包含 `m3e-tab` 与 `m3e-tab-panel`。每个 `m3e-tab` 的 `for` 指向对应面板的 `id`，且只能有一个标签带 `selected`：

<m3e-tabs variant="primary">
  <m3e-tab selected for="nav-demo-panel-overview">
    <m3e-icon slot="icon" name="home"></m3e-icon>
    概览
  </m3e-tab>
  <m3e-tab for="nav-demo-panel-button">
    <m3e-icon slot="icon" name="radio_button_checked"></m3e-icon>
    按钮
  </m3e-tab>
  <m3e-tab for="nav-demo-panel-card">
    <m3e-icon slot="icon" name="dashboard"></m3e-icon>
    卡片
  </m3e-tab>
  <m3e-tab-panel id="nav-demo-panel-overview">
    概览面板：展示当前组件的用途、变体与使用建议。
  </m3e-tab-panel>
  <m3e-tab-panel id="nav-demo-panel-button">
    按钮面板：`m3e-button` 与 `m3e-icon-button` 的五种变体。
  </m3e-tab-panel>
  <m3e-tab-panel id="nav-demo-panel-card">
    卡片面板：`m3e-card` 的插槽、变体与可点击模式。
  </m3e-tab-panel>
</m3e-tabs>

```html
<m3e-tabs variant="primary">
  <m3e-tab selected for="nav-demo-panel-overview">
    <m3e-icon slot="icon" name="home"></m3e-icon>
    概览
  </m3e-tab>
  <m3e-tab for="nav-demo-panel-button">
    <m3e-icon slot="icon" name="radio_button_checked"></m3e-icon>
    按钮
  </m3e-tab>
  <m3e-tab-panel id="nav-demo-panel-overview">概览面板内容。</m3e-tab-panel>
  <m3e-tab-panel id="nav-demo-panel-button">按钮面板内容。</m3e-tab-panel>
</m3e-tabs>
```

可选属性：

- `variant="primary"`：主标签样式；默认 `secondary`。
- `stretch`：标签等宽铺满容器。
- `header-position="after"`：标签栏放到面板下方。
- `disable-pagination`：标签溢出时关闭翻页控件。

标签数量多时应允许横向滚动或翻页，不要把标签文字压缩到不可读。

## 标签与筛选

`m3e-chip` 是非交互标签，适合展示分类、状态与技术栈。外层用 `.demo-row` 控制间距：

<div class="demo-row">
  <m3e-chip>
    <m3e-icon slot="icon" name="palette"></m3e-icon>
    主题
  </m3e-chip>
  <m3e-chip>
    <m3e-icon slot="icon" name="layers"></m3e-icon>
    组件
  </m3e-chip>
  <m3e-chip variant="elevated">
    <m3e-icon slot="icon" name="check"></m3e-icon>
    已启用
  </m3e-chip>
</div>

```html
<div class="demo-row">
  <m3e-chip>
    <m3e-icon slot="icon" name="palette"></m3e-icon>
    主题
  </m3e-chip>
  <m3e-chip>
    <m3e-icon slot="icon" name="layers"></m3e-icon>
    组件
  </m3e-chip>
  <m3e-chip variant="elevated">
    <m3e-icon slot="icon" name="check"></m3e-icon>
    已启用
  </m3e-chip>
</div>
```

需要让用户筛选内容时，使用可交互的 Filter Chip：

<m3e-filter-chip-set aria-label="文档筛选">
  <m3e-filter-chip selected value="all">全部</m3e-filter-chip>
  <m3e-filter-chip value="theme">主题</m3e-filter-chip>
  <m3e-filter-chip value="style">样式</m3e-filter-chip>
  <m3e-filter-chip value="component">组件</m3e-filter-chip>
</m3e-filter-chip-set>

```html
<m3e-filter-chip-set aria-label="文档筛选">
  <m3e-filter-chip selected value="all">全部</m3e-filter-chip>
  <m3e-filter-chip value="theme">主题</m3e-filter-chip>
  <m3e-filter-chip value="style">样式</m3e-filter-chip>
  <m3e-filter-chip value="component">组件</m3e-filter-chip>
</m3e-filter-chip-set>
```

Filter Chip 自带选中状态与键盘操作，`selected` 设置初始值，点击后触发变更事件。它与非交互的 `m3e-chip` 语义不同，不要混用。

## 徽标

徽标可以独立显示计数，也可以通过 `for` 锚定到按钮或图标：

<div class="demo-row">
  <m3e-badge size="small">3</m3e-badge>
  <m3e-badge size="medium">12</m3e-badge>
  <m3e-badge size="large">99+</m3e-badge>
  <m3e-button id="navigation-demo-update" variant="outlined">更新</m3e-button>
  <m3e-badge for="navigation-demo-update" position="above-after">4</m3e-badge>
</div>

```html
<m3e-badge size="small">3</m3e-badge>
<m3e-badge size="medium">12</m3e-badge>
<m3e-badge size="large">99+</m3e-badge>
<m3e-button id="navigation-demo-update" variant="outlined">更新</m3e-button>
<m3e-badge for="navigation-demo-update" position="above-after">4</m3e-badge>
```

锚定徽标会跟随目标元素布局变化。位置支持 `above-after`、`above-before`、`below-after`、`below-before`、`above`、`below`、`before` 与 `after`。徽标没有默认 ARIA 角色，附加到交互元素时应使用 `aria-describedby` 或同步的可见文本说明数量。

## SPA 导航

侧边栏与页脚的内部链接应输出真实 `<a>`，由 VitePress 2 在捕获阶段拦截站内点击并完成 SPA 导航。VitePress 2 已移除 vue-router 与 `RouterLink`，不要导入或使用旧版示例：

```vue
<a
  v-if="item.link && !isExternalLink(item.link)"
  slot="label"
  :href="withBase(item.link)"
  :aria-current="isActive(item.link) ? 'page' : undefined"
>
  {{ item.text }}
</a>
<a
  v-else-if="item.link"
  slot="label"
  :href="item.link"
  target="_blank"
  rel="noreferrer"
>
  {{ item.text }}
</a>
```

`withBase` 来自 `vitepress`，用于给站内路径加上部署 base。普通左键点击由 VitePress 核心统一接管，同时保留中键新标签页、复制链接与无障碍语义；外部链接保持原生行为并添加 `target="_blank"` 与 `rel="noreferrer"`。

如果必须在脚本中跳转，可使用 `useRouter().go()`：

```ts
import { useRouter, withBase } from "vitepress";

const router = useRouter();

function navigate(event: MouseEvent, link: string): void {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) {
    return;
  }

  event.preventDefault();
  void router.go(withBase(link));
}
```

m3e 按钮或图标按钮内部的锚点位于 Shadow DOM，VitePress 的全局拦截无法看到它；这类组件需要 SPA 时，应在宿主元素上监听点击并显式调用 `router.go()`。本篇的静态演示使用普通 `<a>`，站内点击由 VitePress 接管；外部链接保持整页跳转。无论采用哪种写法，都不要用 `div` 加点击事件模拟链接，也不要在内部导航上丢失真实 `href`。

## 面包屑与后续计划

当前版本没有引入面包屑组件。跨层级定位由侧边栏的展开状态与页脚的上一页/下一页承担；如需面包屑，可在自定义 `AppBar` 或内容容器中基于路由段自行实现。搜索与多语言导航同样属于后续计划，不在本阶段范围内。

## 可访问性

- 菜单根元素设置 `aria-label`，明确它是文档导航地标。
- 当前菜单项使用 `selected`，组件会输出 `aria-current`。
- 标签页通过 `for` 与面板 `id` 建立关联，只允许一个 `selected`。
- Filter Chip 保持可见文本，不用颜色单独表达选中状态。
- 纯图标按钮必须提供 `aria-label`，并配合工具提示。
