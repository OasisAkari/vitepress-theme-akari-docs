---
tab: 技术细节
---

# 配置：技术细节

## 两层配置怎样叠加

`docs/config.ts` 与语言文件夹的 `config.ts` 是 VitePress 2 的目录级配置。

- VitePress 在 `docs` 中查找名为 `config.ts`（也可以是 `.mts`、`.js`、`.mjs`）的文件，以 `.` 开头的目录除外。每个文件只作用于它所在文件夹中的页面，按源文件的位置判断，与页面改写后的地址无关。
- 一个页面的配置由几层叠成，上层优先：所在文件夹及其上级文件夹的 `config.ts`（越深越优先）、`docs/config.ts`、VitePress 的语言（locale）配置、`.vitepress/config.mts`。
- 叠加按字段进行：对象逐个字段取最上层有值的那一层，字符串、数组等其它值整体替换。所以语言配置中的 `appBar: { title }` 不会清掉共用配置里的 `appBar.socialLinks`，而 `socialLinks` 本身作为数组只能整体替换。
- 叠加在页面渲染时进行，服务端与浏览器端结果相同。
- 修改、新增或删除任何一个 `config.ts`，开发服务器都会自动重启。
- 分类目录或文章文件夹中也可以放 `config.ts`，只作用于其中的页面，例如给一个分类单独设置页尾文字。

## 由目录生成语言

`akariContent` 在 `.vitepress/config.mts` 加载时运行：

1. 读取 `docs/config.ts`，在 `docs` 的顶层文件夹中找出带有 `config.ts` 的语言文件夹；`public`、`node_modules` 与以 `.` 开头的文件夹除外。配置文件由 Vite 的配置加载器打包执行，与 VitePress 加载它们的方式相同。
2. 确定根语言：`rootLanguage` 指定的文件夹；没有指定或不存在时（会给出提示），取按字母顺序的第一个。其余语言按字母顺序排在后面。
3. 为每种语言生成一项 VitePress 的 `locales`：根语言的键为 `root`，其余为文件夹名。每项带着语言配置的内容（`head` 除外，它已经由目录级配置加入，再加一次会重复；locale 的 `head` 是这种语言的字体标签，见[排版](/styles/typography/api#fonts)），`lang` 缺省为文件夹名，`label` 缺省为 `lang`，并带上生成的导航（`themeConfig.akari.sidebar.items`）。
4. 站点级的 `lang`、`title`、`description` 取自根语言。

语言配置既作为目录级配置作用于自己的页面，又作为 locale 出现，各有用处：locale 让语言菜单列出这种语言、让代码块复制按钮等 Markdown 文字按语言渲染，也让 404 页这类语言文件夹之外的页面得到根语言的设置。两处的值相同，叠加结果不受影响。

没有语言文件夹时，`akariContent` 不生成 locale 与改写，站点按 `.vitepress/config.mts` 中的配置运行，导航取手写的 `sidebar.items` 或 VitePress 原生的 `themeConfig.sidebar`。

## 地址与导航

`akariContent` 同时返回 VitePress 的 `rewrites` 函数，并读取每种语言的 Markdown 头部信息生成导航。具体规则见[撰写页面 · 技术细节](/getting-started/writing/details)。语言配置或共用配置写了 `sidebar.items` 时，这种语言不生成导航，使用手写的那份。

## 开发时的更新

| 修改 | 结果 |
| --- | --- |
| 增删或修改 `config.ts` | VitePress 重启开发服务器，`akariContent` 重新运行 |
| 增删 Markdown，或修改头部信息 | `content.plugin` 约 120ms 后重新生成导航；导航有变化时更新站点数据并刷新页面 |
| 只修改正文 | 导航不变，按 VitePress 自己的热更新处理，页面不刷新 |

`content.plugin` 只监听语言文件夹中的 `.md`。运行中整个语言文件夹被移走时，在重启之前它会跳过这个文件夹。

## 配置文件中能写什么

配置文件在 Node.js 中执行，结果序列化后随站点数据发到浏览器，所以只适合写数据。Vue 组件这类依赖导入的对象传不过去，替换组件要在主题入口调用 `provideAkariComponents`，见[扩展主题](/theme/extending/api#provideakaricomponents)。

## 导入 defineAkariConfig

`defineAkariConfig` 放在 `theme/define.ts` 中：这个文件只导入类型，并且写明扩展名（`./types.ts`）；配置文件也以完整文件名导入它（`define.ts`）。Vite 加载配置文件时，会对未来原生加载器无法处理的写法（例如省略扩展名的导入）打印警告，这样写的配置文件不会触发它。`tsconfig.json` 为此开启了 `allowImportingTsExtensions`。

构建时仍会看到一条同类警告，它来自 `.vitepress/config.mts` 自身的导入，不影响构建结果。
