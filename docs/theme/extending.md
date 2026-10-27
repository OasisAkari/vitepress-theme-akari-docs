# 扩展主题

主题提供三种扩展方式：修改 `themeConfig.m3e` 调整行为，通过 `m3e.components` 替换界面组件，以及覆盖 CSS 自定义属性改变视觉。前两种不需要改动主题源码，第三种适合在站点样式中做增量定制。

## 扩展方式总览

| 方式 | 入口 | 适合场景 | 是否改源码 |
| --- | --- | --- | --- |
| 配置 | `themeConfig.m3e` | 标题、导航、设置区块、目录深度、页脚 | 否 |
| 组件覆盖 | `m3e.components` | 品牌顶栏、特殊页脚、自定义内容容器 | 提供新组件 |
| CSS 令牌 | `--m3e-*` 与 `--md-sys-color-*` | 圆角、间距、面板颜色、目录宽度 | 否 |

## 配置扩展

所有配置都在 `defineM3eThemeConfig` 内完成，未填写的字段自动使用默认值。例如只调整页脚与目录：

```ts
m3e: defineM3eThemeConfig({
  footer: {
    message: "内部技术文档",
    copyright: "© 2026 Example Team",
    showPrevNext: true,
  },
  toc: {
    maxDepth: 2,
    overline: "本页",
  },
})
```

`defineM3eThemeConfig` 原样返回传入对象，作用仅是提供类型推断与字段校验提示。配置在运行时解析一次，解析结果包含默认值合并、设置区块过滤、侧边栏宽度与目录深度限制。

## 组件覆盖

`m3e.components` 接受六个槽位：

| 槽位 | 替换内容 | 默认实现 |
| --- | --- | --- |
| `AppBar` | 顶部应用栏 | 内置 `m3e-app-bar` 顶栏 |
| `Sidebar` | 左侧导航 | 递归 `m3e-nav-menu` |
| `Settings` | 右侧设置抽屉 | 七区块设置面板 |
| `Toc` | 右侧目录 | `m3e-toc` |
| `Footer` | 文档页脚 | 上一页、下一页与版权信息 |
| `Content` | Markdown 外层容器 | 无样式的 `div` |

只覆盖需要的槽位：

```ts
import CustomAppBar from "./theme/CustomAppBar.vue";

m3e: defineM3eThemeConfig({
  components: {
    AppBar: CustomAppBar,
  },
})
```

自定义顶栏示例：

```vue
<script setup lang="ts">
import { useM3eConfig } from "@theme";

const config = useM3eConfig();
</script>

<template>
  <m3e-app-bar>
    <span slot="title">{{ config.appBar.title }}</span>
    <m3e-chip v-if="config.appBar.version" slot="trailing">{{ config.appBar.version }}</m3e-chip>
    <m3e-icon-button slot="trailing" aria-label="设置">
      <m3e-icon name="settings"></m3e-icon>
    </m3e-icon-button>
  </m3e-app-bar>
</template>
```

这个示例只保留标题、版本与设置按钮。实际替换时应复用默认顶栏的抽屉开关与状态切换逻辑，否则移动端将无法打开侧边导航；同时保留 `aria-label` 等无障碍属性。自定义组件可以使用主题提供的组合式函数读取配置与设置。

## 公共导出

主题入口 `docs/.vitepress/theme/index.ts` 导出：

| 导出 | 类型 | 用途 |
| --- | --- | --- |
| `useM3eConfig` | `() => ComputedRef<ResolvedM3eThemeConfig>` | 读取合并默认值后的主题配置 |
| `useM3eSettings` | `() => M3eSettingsApi` | 读取设置、切换单项、恢复默认 |
| `useSidebar` | `() => { items, prevNext, isActive, hasActive }` | 导航树、相邻页面与激活判断 |
| `defineM3eThemeConfig` | `(config: M3eThemeConfig) => M3eThemeConfig` | 配置类型辅助 |
| `M3E_CONTENT_ID` | `string` | 内容面板的固定 id |
| `M3E_SIDEBAR_ID` | `string` | 左侧抽屉的固定 id |
| `M3E_SETTINGS_ID` | `string` | 右侧抽屉的固定 id |

这些组合式函数依赖 `M3eLayout` 提供的上下文，只能在布局内部的组件中调用：

```ts
import { useM3eSettings } from "@theme";

const { settings, setSetting, reset, isDefault } = useM3eSettings();

setSetting("scheme", "dark");
reset();
```

`useM3eSettings` 返回的 `settings` 是响应式对象，`setSetting` 会自动持久化（当 `persist` 为真），`isDefault` 用于判断当前值是否全部等于默认值。`useSidebar` 返回的 `prevNext` 已按侧边栏顺序计算好上一页与下一页。

## CSS 令牌

主题为面板与抽屉暴露类名，可以直接在站点样式中覆盖对应的 m3e CSS 变量：

```css
.m3e-content-pane {
  --m3e-content-pane-container-color: var(--md-sys-color-surface-container-low);
  --m3e-content-pane-container-shape: 24px;
  --m3e-content-pane-container-padding: 24px;
}

.m3e-toc {
  --m3e-toc-width: 232px;
  --m3e-toc-container-color: var(--md-sys-color-surface-container);
  --m3e-toc-container-shape: 24px;
}

.m3e-shell {
  --m3e-drawer-container-width: 348px;
}
```

- `--m3e-content-pane-container-shape` 控制内容面板圆角。
- `--m3e-content-pane-container-padding` 控制正文四周留白。
- `--m3e-toc-width` 控制目录宽度，窄屏下目录仍会隐藏。
- `--m3e-drawer-container-width` 控制桌面抽屉宽度，与配置中的 `sidebar.width` 相互配合。

单个组件也可以在行内覆盖变量，下面的卡片演示只改变圆角：

<div class="demo-grid">
  <m3e-card variant="outlined" style="--m3e-card-shape: 4px;">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="medium">4px 圆角</m3e-heading>
    <div slot="content">更紧凑的卡片外观，适合工具面板与数据块。</div>
  </m3e-card>
  <m3e-card variant="outlined">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="medium">默认圆角</m3e-heading>
    <div slot="content">沿用 m3e 卡片的默认形状令牌，与其它组件一致。</div>
  </m3e-card>
  <m3e-card variant="outlined" style="--m3e-card-shape: 28px;">
    <m3e-heading m3e-toc-ignore slot="header" variant="title" size="medium">28px 圆角</m3e-heading>
    <div slot="content">更大的圆角，更接近内容面板的视觉语言。</div>
  </m3e-card>
</div>

对应的标记：

```html
<m3e-card variant="outlined" style="--m3e-card-shape: 28px;">
  <m3e-heading slot="header" variant="title" size="medium">28px 圆角</m3e-heading>
  <div slot="content">更大的圆角，更接近内容面板的视觉语言。</div>
</m3e-card>
```

优先覆盖主题已使用的变量，不要直接改组件内部类名；后者依赖组件版本，升级时容易失效。

## 注意事项

- 覆盖组件必须保留原有根元素语义，例如顶栏使用 `m3e-app-bar`、导航使用 `m3e-nav-menu`，并保留无障碍属性与键盘行为。
- 不要硬编码颜色。使用 `--md-sys-color-*` 令牌，才能在动态色、深色模式和高对比度下保持可读。
- 覆盖 CSS 时使用主题类名与 m3e 变量，不要依赖 Shadow DOM 内部结构。
- 新增 m3e 组件或图标时，在 `m3e.ts` 与 `icons.ts` 按需注册，不要导入 `@m3e/web/all`。
- 避免在模块顶层访问 `window`、`document` 或 `localStorage`，保证 SSR 构建通过。
