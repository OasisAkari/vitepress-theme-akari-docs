---
icon: package_2
order: 1
---

# Installation

The theme lives in the repository at `docs/.vitepress/theme`. There is no separate theme package to install.

## Requirements

- Node.js `>=22.12.0` (the `engines` field of `package.json`). The repository is verified with Node.js `24.21.0` and npm `12.2.1`.
- npm. The repository keeps a single `package-lock.json`.

## Install and start

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` by default. In continuous integration, use `npm ci` to install from the lockfile.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server. Markdown changes update instantly; changing `config.ts` restarts it automatically |
| `npm run build` | Builds the static site into `docs/.vitepress/dist` |
| `npm run preview` | Previews the build locally |
| `npm run typecheck` | Checks the theme and the tests with `vue-tsc --noEmit` |
| `npm test` | Runs the Vitest unit tests |

## Version baseline

| Dependency | Version | Notes |
| --- | --- | --- |
| `vitepress` | `2.0.0-alpha.21` | Pinned; built on Vite 8 / Rolldown and Vue 3.5 |
| `@m3e/web` | `2.10.2` | Material 3 Expressive Web Components |
| `@m3e/icons` | `1.0.21` | Material Symbols icons, registered on demand |

VitePress is still in alpha. When you upgrade it, check the theme code, the config types and the build output together.

## Folder layout

```text
.
├── docs/
│   ├── config.ts                  config shared by every language
│   ├── zh-CN/                     Simplified Chinese, at the site root
│   │   ├── config.ts              overrides the shared config
│   │   ├── index.md               home page
│   │   └── getting-started/       rail category
│   │       └── installation/
│   │           └── index.md       article /getting-started/installation
│   ├── en-US/                     English, under /en-US/
│   ├── public/                    static assets
│   └── .vitepress/
│       ├── config.mts             wires the theme into VitePress
│       ├── content/               languages, paths and navigation from the folders
│       ├── search/                local search index
│       └── theme/                 theme source
├── tests/                         unit tests
└── package.json
```

For where pages and config go, see [Configuration](/en-US/getting-started/configuration) and [Writing pages](/en-US/getting-started/writing). For the structure of the theme source, see [Extending the theme](/en-US/theme/extending/api#source-layout).

## Deployment

`npm run build` produces plain static files that any static host can serve.

- **Paths without extensions**: the site enables `cleanUrls`, so `/theme/layout` maps to the file `theme/layout.html`. When a file is not found, the host needs to try again with `.html` added. GitHub Pages, Netlify and Cloudflare Pages do this by default; Vercel needs `"cleanUrls": true` in `vercel.json`; for Nginx, write `try_files $uri $uri.html $uri/ =404;`.
- **Under a subpath**: for example `https://example.com/docs/`, set `base: "/docs/"` in `.vitepress/config.mts`. Internal paths in the navigation, the hero, the logo and the search index get it added automatically.
- **Search index**: `search-index.json` is generated at build time and copied to the root of the output. No extra step is needed.

## FAQ

### Blank page, or components without styles

The theme registers the m3e components in the browser, and once they are registered it adds `data-akari-ready` to `html`. First check the browser console for module loading errors. When scripts are disabled or fail to load, the content shows as plain HTML after 3 seconds. The browser needs to support Custom Elements, Shadow DOM and native ES modules.

### Why components are registered only in the browser

m3e components are Lit custom elements. Registering them needs `customElements.define`, which Node.js does not have. The theme entry imports `m3e.ts` only in the browser, and server-side rendering outputs only the element tags and their slot content. Do not import `@m3e/web` component modules in code that runs on the server.

### A new component or icon does not show

Components and icons are both registered on demand. For a component, import its subpath in `docs/.vitepress/theme/m3e.ts` (do not import `@m3e/web/all`, which registers every component). For an icon, import it in `icons.ts`. An icon that is not registered shows as blank.

### The build reports an unknown Vue component

`.vitepress/config.mts` lets tags starting with `m3e-` through with `vue.template.compilerOptions.isCustomElement`. Keep this setting when you reuse the theme in another project.
