# 侧边导航

左侧导航由 `m3e-nav-menu` 递归渲染 `m3e-nav-menu-item`，支持多级分组、图标、徽标、自动展开与当前项高亮。导航数据有富配置与 VitePress 原生配置两种来源，主题在运行时归一化为同一棵树。

## 双模式解析

解析顺序固定：

1. 如果 `themeConfig.m3e.sidebar.items` 存在且非空，使用富配置。
2. 否则读取 `themeConfig.sidebar`，把原生数组或按路径分组的对象转换为 `M3eSidebarItem`。

两种来源都支持：

- 数组形式：所有页面共用一份导航。
- 对象形式：键为路径前缀，值为该前缀下的导航项，按当前路径最长前缀匹配。
- 自动展开：包含当前页面的分组会被标记为 `open`，叶子项标记为 `selected`。
- 上一页与下一页：深度优先扁平化所有带链接的叶子项，按顺序取相邻项；无链接分组不参与。

路由比较会忽略 `base`、结尾斜杠、查询参数与 hash，并把 `.html` 后缀视为同一路径。因此 `/guide/intro/`、`/guide/intro.html` 与 `/guide/intro?from=nav` 都会命中同一项。

## 富配置字段

`M3eSidebarItem` 的字段如下：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `text` | `string` | 必填，显示文本 |
| `link` | `string` | 目标地址；内部路径使用以 `/` 开头的站点路径 |
| `icon` | `string` | 已注册的 m3e 图标名，显示在文本前 |
| `badge` | `string` | 文本后的紧凑徽标，例如 `New`、`扩展` |
| `collapsed` | `boolean` | 设为 `false` 时分组默认展开；包含当前页面的分组始终展开 |
| `items` | `M3eSidebarItem[]` | 子项，支持任意层级嵌套 |

`sidebar.width` 控制桌面抽屉宽度，默认 `320`，解析时限制在 `240` 到 `400` 之间。

```ts
sidebar: {
  width: 340,
  items: [
    {
      text: "主题",
      icon: "palette",
      items: [
        {
          text: "布局与顶栏",
          link: "/theme/layout",
          icon: "view_quilt",
        },
        {
          text: "侧边导航",
          link: "/theme/sidebar",
          icon: "view_sidebar",
        },
        {
          text: "扩展主题",
          link: "/theme/extending",
          icon: "integration_instructions",
          badge: "扩展",
        },
      ],
    },
    {
      text: "组件",
      icon: "widgets",
      collapsed: false,
      items: [
        {
          text: "按钮",
          link: "/components/button",
          icon: "radio_button_checked",
        },
        {
          text: "卡片",
          link: "/components/card",
          icon: "dashboard",
        },
      ],
    },
  ],
}
```

`collapsed: false` 的分组默认展开；包含当前页面的分组始终展开。`collapsed` 为 `true` 或未设置时，其他分组保持折叠，用户仍可手动开合。

## 路径匹配与自动展开

对象形式的键可以是 `/`、`/theme/` 或 `/theme/settings`。解析时按路径长度从长到短排序，取第一个匹配项：

- `/theme/settings` 优先于 `/theme/`。
- `/theme/` 优先于 `/`。
- 键为 `/` 时匹配所有路径，作为最终兜底。

匹配成功后，递归查找当前链接；命中叶子项的祖先分组全部获得 `open`，叶子项获得 `selected`。`m3e-nav-menu-item` 会把 `selected` 映射为 `aria-current`，并让父级图标与选择指示器同步。

## 上一页与下一页

页脚导航复用同一棵导航树：

- 先深度优先扁平化，只保留带 `link` 的项。
- 找到当前页面在扁平列表中的位置。
- 取前一项与后一项；首项没有上一页，末项没有下一页。
- 外部链接与纯锚点不会被视为当前页面，也不会成为激活项。

`footer.showPrevNext` 设为 `false` 时隐藏这一区域，页脚说明文字仍然保留。

## 静态演示

下面的菜单使用与真实侧边栏相同的标记，演示展开分组、选中叶子项与徽标：

<div class="demo-surface" style="max-width: 320px; max-block-size: 320px;">
  <m3e-nav-menu aria-label="侧边导航演示">
    <m3e-nav-menu-item open>
      <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
      <span slot="label">开始</span>
      <m3e-nav-menu-item selected>
        <m3e-icon slot="icon" name="home"></m3e-icon>
        <a slot="label" href="/">概览</a>
      </m3e-nav-menu-item>
      <m3e-nav-menu-item>
        <m3e-icon slot="icon" name="package_2"></m3e-icon>
        <a slot="label" href="/getting-started/installation">安装</a>
      </m3e-nav-menu-item>
      <m3e-nav-menu-item>
        <m3e-icon slot="icon" name="tune"></m3e-icon>
        <a slot="label" href="/getting-started/configuration">配置</a>
      </m3e-nav-menu-item>
    </m3e-nav-menu-item>
    <m3e-nav-menu-item>
      <m3e-icon slot="icon" name="palette"></m3e-icon>
      <span slot="label">主题</span>
      <m3e-nav-menu-item>
        <m3e-icon slot="icon" name="view_quilt"></m3e-icon>
        <a slot="label" href="/theme/layout">布局与顶栏</a>
      </m3e-nav-menu-item>
      <m3e-nav-menu-item>
        <m3e-icon slot="icon" name="view_sidebar"></m3e-icon>
        <a slot="label" href="/theme/sidebar">侧边导航</a>
      </m3e-nav-menu-item>
      <m3e-nav-menu-item>
        <m3e-icon slot="icon" name="integration_instructions"></m3e-icon>
        <a slot="label" href="/theme/extending">扩展主题</a>
        <span slot="badge">扩展</span>
      </m3e-nav-menu-item>
    </m3e-nav-menu-item>
  </m3e-nav-menu>
</div>

演示中的链接是普通锚点，由 VitePress 2 的全局点击拦截转为 SPA 导航。VitePress 2 已移除 `RouterLink`，主题内部统一输出真实 `<a>`；外部链接保持原生跳转。

## 原生配置回退

不写 `m3e.sidebar` 时，直接使用 VitePress 的 `themeConfig.sidebar`：

```ts
import { defineConfig } from "vitepress";

export default defineConfig({
  themeConfig: {
    sidebar: {
      "/theme/": [
        {
          text: "主题",
          items: [
            {
              text: "布局与顶栏",
              link: "/theme/layout",
              icon: "view_quilt",
            },
            {
              text: "扩展主题",
              link: "/theme/extending",
              icon: "integration_instructions",
              badge: "扩展",
            },
          ],
        },
      ],
      "/components/": [
        {
          text: "组件",
          items: [
            { text: "按钮", link: "/components/button" },
            { text: "卡片", link: "/components/card" },
          ],
        },
      ],
    },
  },
});
```

原生项中的 `icon`、`badge` 与分组级 `base` 会在归一化时保留或拼接，因此迁移时可以先沿用现有导航，再逐组替换为富配置。

## 图标注册

图标由 `docs/.vitepress/theme/icons.ts` 逐个导入，新增图标需要在该文件补充一行：

```ts
import "@m3e/icons/outlined/rocket_launch";
```

同时把图标名写入 `sidebar` 配置。未注册的名称不会报错，但会渲染为空白占位。当前文档使用的图标均已注册，包括 `home`、`package_2`、`tune`、`palette`、`view_quilt`、`view_sidebar`、`integration_instructions`、`widgets`、`dashboard`、`language` 等。

## 可访问性

- `m3e-nav-menu` 根元素带有 `aria-label="文档导航"`，作为页面主导航地标。
- 叶子项通过 `selected` 暴露 `aria-current`，屏幕阅读器可识别当前位置。
- 分组项支持键盘展开与折叠，焦点环由 `strong-focus` 与组件内置焦点管理提供。
- 图标默认对辅助技术隐藏，可见文本由 `label` 插槽中的链接或文本承担。

自定义导航时应保留“菜单根元素 + 标签锚点 + `selected` 状态”的结构，不要用纯 `div` 模拟链接。
