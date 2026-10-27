# 右侧设置

设置抽屉从右侧滑出，提供七组外观选项。它只改变当前浏览器中的显示效果，不写入 `config.mts`，也不影响其它访问者。所有选项实时作用于整个应用，包括顶栏、导航、内容面板与目录。

## 打开设置

顶栏右侧的齿轮按钮通过抽屉开关打开设置面板；移动端点击遮罩或按 `Escape` 关闭。相关配置：

```ts
settings: {
  enabled: true,
}
```

`settings.enabled` 为 `false` 时，抽屉不渲染，顶栏设置按钮也会隐藏。`appBar.showSettingsToggle` 可以单独隐藏入口，但保留设置功能本身。

## 七个区块

设置抽屉按 `settings.sections` 的顺序渲染，默认包含全部七项：

| 区块 | 配置键 | 控件 | 生效位置 | 取值 |
| --- | --- | --- | --- | --- |
| 颜色 | `color` | 原生颜色输入 | `<m3e-theme color>` | 六位十六进制颜色，默认 `#6750A4` |
| 色调变体 | `variant` | `m3e-filter-chip-set` | `<m3e-theme variant>` | `tonal-spot`、`vibrant`、`fidelity`、`expressive`、`monochrome`、`neutral`、`rainbow`、`fruit-salad` |
| 明暗模式 | `scheme` | `m3e-segmented-button` | `<m3e-theme scheme>` | `light`、`auto`、`dark`，默认 `auto` |
| 对比度 | `contrast` | `m3e-segmented-button` | `<m3e-theme contrast>` | `standard`、`medium`、`high` |
| 动效 | `motion` | `m3e-segmented-button` | `<m3e-theme motion>` | `standard`、`expressive` |
| 文字方向 | `direction` | `m3e-segmented-button` | `document.documentElement.dir` | `ltr`、`rtl` |
| 字号 | `textSize` | `m3e-segmented-button` | 根元素 `font-size` | `16px`、`24px`、`32px`，显示为 100%、150%、200% |

颜色使用原生 `<input type="color">`，选择后立即生成新的动态色板。色调变体使用可多选外观、单选行为的 Filter Chip 组；明暗、对比度、动效、方向与字号使用分段按钮。

<div class="demo-surface">
  <div class="demo-stack">
    <div class="demo-row">
      <strong>明暗模式</strong>
      <m3e-segmented-button aria-label="明暗模式示例">
        <m3e-button-segment checked value="light">
          <m3e-icon slot="icon" name="light_mode"></m3e-icon>
          浅色
        </m3e-button-segment>
        <m3e-button-segment value="auto">
          <m3e-icon slot="icon" name="settings_brightness"></m3e-icon>
          跟随系统
        </m3e-button-segment>
        <m3e-button-segment value="dark">
          <m3e-icon slot="icon" name="dark_mode"></m3e-icon>
          深色
        </m3e-button-segment>
      </m3e-segmented-button>
    </div>
    <div class="demo-row">
      <strong>色调变体</strong>
      <m3e-filter-chip-set aria-label="色调变体示例">
        <m3e-filter-chip selected value="tonal-spot">Tonal Spot</m3e-filter-chip>
        <m3e-filter-chip value="vibrant">Vibrant</m3e-filter-chip>
        <m3e-filter-chip value="expressive">Expressive</m3e-filter-chip>
        <m3e-filter-chip value="monochrome">Monochrome</m3e-filter-chip>
      </m3e-filter-chip-set>
    </div>
    <div class="demo-row">
      <strong>持久化</strong>
      <m3e-switch id="settings-demo-persist" checked aria-label="持久化示例"></m3e-switch>
      <span>保存到当前浏览器</span>
    </div>
  </div>
</div>

以上控件为外观演示，修改不会应用到实际主题；真正生效的控件位于右侧设置抽屉。

## 属性映射

颜色、变体、明暗、对比度与动效直接绑定到应用根部的 `m3e-theme`：

```vue
<m3e-theme
  :color="settings.color"
  :variant="settings.variant"
  :scheme="settings.scheme"
  :contrast="settings.contrast"
  :motion="settings.motion"
  strong-focus
>
  <!-- 应用壳 -->
</m3e-theme>
```

`direction` 与 `textSize` 不经过组件属性，而是同步到文档根元素：

```ts
document.documentElement.dir = settings.direction;
document.documentElement.style.fontSize = settings.textSize;
```

方向切换会影响 `m3e` 组件的 BIDI 布局与图标方向；字号切换会影响所有以 `rem` 计算的正文尺寸，代码块与表格随容器自适应。

## 持久化与默认值

默认行为：

- 首次访问使用 `settings.defaults` 与主题内置默认值合并后的结果。
- 服务端渲染阶段只输出默认值，客户端挂载后再读取 `localStorage`，避免水合不一致。
- 每次修改后写入 `localStorage`，键名默认为 `m3e-docs-settings`。
- 存储内容损坏、字段缺失或值非法时，逐项回退到默认值。
- 隐私模式或配额耗尽导致读写失败时静默忽略，不影响页面运行。

```ts
settings: {
  persist: true,
  storageKey: "m3e-docs-settings",
  defaults: {
    color: "#6750A4",
    variant: "tonal-spot",
    scheme: "auto",
    contrast: "standard",
    motion: "expressive",
    direction: "ltr",
    textSize: "16px",
  },
}
```

`persist: false` 时设置只保留在当前页面生命周期内，刷新后回到默认值。`defaults` 支持部分字段，未提供的字段沿用主题默认。设置 API 提供 `reset()` 恢复默认值，但初版界面不额外放置“恢复默认”按钮，以保持与官方文档一致。

## 隐藏区块

只保留颜色、明暗与字号：

```ts
settings: {
  enabled: true,
  sections: ["color", "scheme", "textSize"],
  labels: {
    textSize: "正文字号",
  },
}
```

`settings.sections` 会过滤非法键、去重并保持给定顺序；空数组或全部非法时回退到完整七项。`labels` 只覆盖对应区块的标题，其余标签保持中文默认值。

## 生效范围

设置仅影响当前浏览器：

- 不修改 `docs/.vitepress/config.mts`，不会提交到仓库。
- 不写入服务端，不跨设备同步。
- 不同浏览器、不同域名或端口拥有各自的 `localStorage`。
- 构建产物仍以默认值为初始状态，首次访问者看到的是配置中的默认外观。

如果希望团队统一默认外观，应修改 `settings.defaults` 并重新构建，而不是依赖个人浏览器中的设置。
