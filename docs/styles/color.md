# 色彩

主题的色彩系统完全建立在 m3e 的动态色之上。站点只提供一个种子颜色，组件与正文使用的 `--md-sys-color-*` 令牌由 `m3e-theme` 在运行时生成；切换明暗、对比度或色调变体时，整套色板会一起更新。

## 动态色

`m3e-theme` 的 `color` 属性接受六位十六进制颜色。组件根据种子色生成主色、辅助色、第三色、表面色与错误色的完整色阶，并暴露为标准令牌：

```html
<m3e-theme color="#006A6A" scheme="auto">
  <!-- 应用内容 -->
</m3e-theme>
```

下面的演示使用青绿色种子，局部覆盖当前页面的色板：

<m3e-theme color="#006A6A">
  <div class="swatch-grid">
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-primary)"></div>
      <code>--md-sys-color-primary</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-primary-container)"></div>
      <code>--md-sys-color-primary-container</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-secondary-container)"></div>
      <code>--md-sys-color-secondary-container</code>
    </div>
    <div class="swatch">
      <div class="swatch__color" style="background: var(--md-sys-color-tertiary)"></div>
      <code>--md-sys-color-tertiary</code>
    </div>
  </div>
</m3e-theme>

种子色只决定色相与色调关系，具体亮度由 Material 3 的色调映射计算，因此同一个种子在浅色与深色模式下都会得到可读的配对颜色。

## 色调变体

默认变体为 `tonal-spot`，适合大多数文档站点。其余可选值：

<div class="demo-row">
  <m3e-chip variant="elevated">Tonal Spot</m3e-chip>
  <m3e-chip>Vibrant</m3e-chip>
  <m3e-chip>Fidelity</m3e-chip>
  <m3e-chip>Expressive</m3e-chip>
  <m3e-chip>Monochrome</m3e-chip>
  <m3e-chip>Neutral</m3e-chip>
  <m3e-chip>Rainbow</m3e-chip>
  <m3e-chip>Fruit Salad</m3e-chip>
</div>

```ts
settings: {
  defaults: {
    color: "#6750A4",
    variant: "tonal-spot",
  },
}
```

- `tonal-spot`：均衡、低饱和，作为默认值。
- `vibrant`：提高主色饱和度，适合品牌感更强的站点。
- `fidelity`：更贴近种子色本身。
- `expressive`：更活跃的色相偏移。
- `monochrome`：去除彩色倾向，只保留明度层次。
- `neutral`：接近中性的表面色。
- `rainbow`：多个角色使用差异更大的色相。
- `fruit-salad`：更强的色相分离，适合演示与创意场景。

变体由设置面板实时切换，不写入站点配置。

## 明暗与对比度

明暗模式有三个值：

- `light`：始终浅色。
- `dark`：始终深色。
- `auto`：跟随 `prefers-color-scheme`，监听系统主题变化。

对比度有 `standard`、`medium`、`high` 三档，影响前景与背景的明度差以及描边强度。高对比度适合强光环境与对视觉清晰度要求更高的用户。

<div class="demo-grid">
  <m3e-theme scheme="light">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>浅色模式</strong>
      <p>表面色偏亮，正文使用深色。适合日间与投影环境。</p>
    </div>
  </m3e-theme>
  <m3e-theme scheme="dark">
    <div class="demo-surface" style="background: var(--md-sys-color-surface-container-low); color: var(--md-sys-color-on-surface);">
      <strong>深色模式</strong>
      <p>表面色偏暗，正文使用浅色。适合低光环境与长时间阅读。</p>
    </div>
  </m3e-theme>
</div>

两个演示块共享同一页面配置，只用 `scheme` 属性区分，便于对比同一色板在两种模式下的映射结果。

## 色彩令牌

文档正文、面板与组件都引用同一组令牌。以下列出常用的 16 个：

<div class="swatch-grid">
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-primary)"></div>
    <code>--md-sys-color-primary</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-on-primary)"></div>
    <code>--md-sys-color-on-primary</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-primary-container)"></div>
    <code>--md-sys-color-primary-container</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-on-primary-container)"></div>
    <code>--md-sys-color-on-primary-container</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-secondary)"></div>
    <code>--md-sys-color-secondary</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-secondary-container)"></div>
    <code>--md-sys-color-secondary-container</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-tertiary)"></div>
    <code>--md-sys-color-tertiary</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-surface)"></div>
    <code>--md-sys-color-surface</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-surface-container-lowest)"></div>
    <code>--md-sys-color-surface-container-lowest</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-surface-container-low)"></div>
    <code>--md-sys-color-surface-container-low</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-surface-container)"></div>
    <code>--md-sys-color-surface-container</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-surface-container-high)"></div>
    <code>--md-sys-color-surface-container-high</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-on-surface)"></div>
    <code>--md-sys-color-on-surface</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-on-surface-variant)"></div>
    <code>--md-sys-color-on-surface-variant</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-outline)"></div>
    <code>--md-sys-color-outline</code>
  </div>
  <div class="swatch">
    <div class="swatch__color" style="background: var(--md-sys-color-outline-variant)"></div>
    <code>--md-sys-color-outline-variant</code>
  </div>
</div>

使用规则：

- 容器色与前景色成对使用，例如 `primary` 配 `on-primary`、`surface-container` 配 `on-surface`。
- 层级用 `surface-container-lowest`、`low`、`default`、`high` 区分，不靠阴影堆叠。
- 边框与分隔线使用 `outline-variant`，需要强调时用 `outline`。
- 错误状态使用 `error` 与 `error-container`，不要复用第三色。

```css
.panel {
  background: var(--md-sys-color-surface-container);
  color: var(--md-sys-color-on-surface);
  border: 1px solid var(--md-sys-color-outline-variant);
}
```

## 设置面板

打开右侧设置抽屉可以实时调整：

1. 点击“颜色”，选择新的种子色。
2. 在“色调变体”中选择一组色板。
3. 在“明暗模式”中切换浅色、跟随系统或深色。
4. 在“对比度”中选择默认、中等或高。

调整结果只保存在当前浏览器的 `localStorage`，刷新后保持，不影响其它访问者。需要团队统一的默认外观时，修改 `settings.defaults` 并重新构建。

## 使用规范

- 主题样式不要硬编码颜色，一律使用 `--md-sys-color-*` 或 m3e 组件变量。
- 自定义卡片、提示块与表格时沿用同一套表面层级，避免在一处使用纯白、另一处使用令牌。
- 深色模式必须单独检查，尤其是自绘背景、阴影与半透明遮罩。
- 需要固定品牌色时，把它作为 `color` 种子传入，而不是在组件上逐处覆盖。
- 对比度不足时优先调整令牌或对比度设置，不要用纯黑纯白强行提高对比。
