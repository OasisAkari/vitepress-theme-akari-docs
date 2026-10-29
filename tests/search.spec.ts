import { describe, expect, it, vi } from "vitest";

import { resolveAkariConfig } from "../docs/.vitepress/theme/config";
import { resolveMessages } from "../docs/.vitepress/theme/i18n";
import {
  computeRevealMorph,
  fullClipPath,
  getSearchMotionPreset,
  insetClipPath,
} from "../docs/.vitepress/theme/search/animation";
import {
  buildHttpRequest,
  createSearchBackend,
  describeSearchError,
  AkariSearchError,
  normalizeSearchResults,
  resolveSearchEndpoint,
} from "../docs/.vitepress/theme/search/backends";
import { splitHighlight } from "../docs/.vitepress/theme/search/highlight";
import { searchLocal } from "../docs/.vitepress/theme/search/local";
import { registerSearchBackend } from "../docs/.vitepress/theme/search/registry";
import type { SearchIndexEntry } from "../docs/.vitepress/theme/search/types";
import {
  parseMarkdownPage,
  slugifyHeading,
} from "../docs/.vitepress/search/parse";

const entries: SearchIndexEntry[] = [
  {
    id: "/components/button::page",
    pageTitle: "按钮",
    title: "按钮",
    heading: "",
    href: "/components/button",
    content: "按钮用于触发操作。",
    level: 0,
  },
  {
    id: "/components/button::变体",
    pageTitle: "按钮",
    title: "变体",
    heading: "变体",
    href: "/components/button#变体",
    content: "五种外观，包括 filled、tonal、outlined 与 text。",
    level: 2,
  },
  {
    id: "/theme/sidebar::配置",
    pageTitle: "侧边导航",
    title: "配置",
    heading: "配置",
    href: "/theme/sidebar#配置",
    content: "在 sidebar.categories 中配置导航的分类。",
    level: 2,
  },
];

describe("resolveAkariConfig search", () => {
  it("uses local defaults", () => {
    expect(resolveAkariConfig().search).toEqual({
      enabled: true,
      placeholder: "Search docs",
      shortcut: "k",
      maxResults: 8,
      debounce: 180,
      backend: { type: "local", endpoint: "/search-index.json" },
    });
  });

  it("clamps numbers and rejects invalid backends", () => {
    const { search } = resolveAkariConfig({
      akari: {
        search: {
          maxResults: 100,
          debounce: -10,
          shortcut: "kk",
          backend: { type: "http", endpoint: "" },
        },
      },
    });

    expect(search.maxResults).toBe(20);
    expect(search.debounce).toBe(0);
    expect(search.shortcut).toBe("k");
    expect(
      resolveAkariConfig({ akari: { search: { shortcut: "" } } }).search.shortcut,
    ).toBe("");
    expect(search.backend).toEqual({
      type: "local",
      endpoint: "/search-index.json",
    });
  });

  it("keeps valid http and registered backends, trimmed", () => {
    const backend = (value: unknown) =>
      resolveAkariConfig({ akari: { search: { backend: value as never } } })
        .search.backend;

    expect(
      backend({ type: "http", endpoint: " /api/search ", method: "POST" }),
    ).toEqual({
      type: "http",
      endpoint: "/api/search",
      method: "POST",
      headers: {},
      credentials: "same-origin",
      queryParam: "q",
      limitParam: "limit",
    });
    expect(backend({ type: "registered", id: " my-search " })).toEqual({
      type: "registered",
      id: "my-search",
    });
  });
});

describe("search index parsing", () => {
  it("parses frontmatter, sections, anchors and excludes code fences", () => {
    const page = parseMarkdownPage(
      [
        "---",
        "title: 按钮",
        "---",
        "",
        "# 按钮",
        "",
        "介绍文本。",
        "",
        "## 变体",
        "",
        "五种外观。",
        "",
        "### 尺寸",
        "",
        "大小说明。",
        "",
        "```ts",
        "const hidden = true;",
        "```",
        "",
      ].join("\n"),
      "components/button.md",
    );

    expect(page.route).toBe("/components/button");
    expect(page.title).toBe("按钮");
    expect(page.entries[0]).toMatchObject({
      pageTitle: "按钮",
      title: "按钮",
      href: "/components/button",
      level: 0,
    });
    expect(page.entries.some((entry) => entry.href === "/components/button#变体")).toBe(true);
    expect(page.entries.some((entry) => entry.href === "/components/button#尺寸")).toBe(true);
    expect(page.entries.some((entry) => entry.content.includes("hidden"))).toBe(false);
    expect(parseMarkdownPage("# 首页\n", "index.md").route).toBe("/");
    expect(parseMarkdownPage("# 指南\n", "guide/index.md").route).toBe("/guide");
  });

  it("creates VitePress-compatible unique heading slugs", () => {
    const used = new Map<string, number>();
    expect(slugifyHeading("为什么不要导入 `@m3e/web/all`", used)).toBe(
      "为什么不要导入-m3e-web-all",
    );
    expect(slugifyHeading("变体", used)).toBe("变体");
    expect(slugifyHeading("变体", used)).toBe("变体-1");
  });

  it("keeps the anchor a heading names", () => {
    const page = parseMarkdownPage(
      "# ページ\n\n## 平行ページ {#parallel-pages}\n\n本文\n",
      "ja-JP/guide.md",
    );
    expect(page.entries[1]).toMatchObject({
      title: "平行ページ",
      href: "/ja-JP/guide#parallel-pages",
    });
  });
});

describe("local search", () => {
  it("matches Chinese substrings and ranks title hits", () => {
    const results = searchLocal(entries, "变体", 5);
    expect(results[0].href).toBe("/components/button#变体");
  });

  it("requires every whitespace token and respects the limit", () => {
    expect(searchLocal(entries, "按钮 不存在的词", 5)).toHaveLength(0);
    expect(searchLocal(entries, "配置 导航", 5).map((r) => r.href)).toEqual([
      "/theme/sidebar#配置",
    ]);
    const [result, ...rest] = searchLocal(entries, "按钮", 1);
    expect(rest).toHaveLength(0);
    expect(result!.excerpt).toBeTruthy();
  });

  it("puts the page whose title is the query first", () => {
    const entry = (
      href: string,
      pageTitle: string,
      heading = "",
    ): SearchIndexEntry => ({
      id: href,
      pageTitle,
      title: heading || pageTitle,
      heading,
      href,
      content: "",
      level: heading ? 2 : 0,
    });
    const index = [
      entry("/config/details#what", "配置：技术细节", "配置文件中能写什么"),
      entry("/search/api#search", "Search: API", "search"),
      entry("/config", "配置"),
      entry("/search", "Search"),
    ];

    // Over a section that starts with the query, and one that matches it.
    expect(searchLocal(index, "配置", 2)[0]?.href).toBe("/config");
    expect(searchLocal(index, "Search", 2).map((r) => r.href)).toEqual([
      "/search",
      "/search/api#search",
    ]);
  });
});

describe("highlight splitting", () => {
  it("splits case-insensitive highlights, none for an empty query", () => {
    expect(splitHighlight("Filled 和 filled", "filled")).toEqual([
      { text: "Filled", match: true },
      { text: " 和 ", match: false },
      { text: "filled", match: true },
    ]);
    expect(splitHighlight("文档搜索", "   ")).toEqual([
      { text: "文档搜索", match: false },
    ]);
  });
});

describe("search morph animation", () => {
  const trigger = { left: 900, top: 12, width: 300, height: 40 };
  const panel = { left: 280, top: 200, width: 720, height: 400 };
  const bar = { left: 304, top: 224, width: 616, height: 56 };

  it("opens a trigger-sized window that lands exactly on the trigger", () => {
    const morph = computeRevealMorph(trigger, panel, bar);

    // Window: 300×40 at the bar's start, vertically centred on the bar.
    expect(morph.clip).toEqual({ top: 32, right: 396, bottom: 328, left: 24 });
    expect(morph.radius).toBe(20);
    expect(panel.left + morph.clip.left + morph.translateX).toBe(trigger.left);
    expect(panel.top + morph.clip.top + morph.translateY).toBe(trigger.top);
  });

  it("aligns to the inline end in right-to-left, inside the panel", () => {
    const rtl = computeRevealMorph(trigger, panel, bar, true);
    const barEnd = bar.left + bar.width;
    expect(rtl.clip.left).toBe(barEnd - 300 - panel.left);
    expect(rtl.clip.right).toBe(panel.left + panel.width - barEnd);

    const wide = computeRevealMorph({ ...trigger, width: 900 }, panel, bar);
    expect([wide.clip.left, wide.clip.right]).toEqual([0, 0]);
  });

  it("serializes the window and the fully open clip", () => {
    expect(insetClipPath({ top: 1, right: 2, bottom: 3, left: 4 }, 20)).toBe(
      "inset(1px 2px 3px 4px round 20px)",
    );
    expect(fullClipPath(28, 32)).toBe("inset(-32px round 60px)");
  });

  it("takes longer when expressive, and exits faster than it enters", () => {
    const standard = getSearchMotionPreset("standard");
    const expressive = getSearchMotionPreset("expressive");

    expect(expressive.duration).toBeGreaterThan(standard.duration);
    for (const preset of [standard, expressive]) {
      expect(preset.exitDuration).toBeLessThan(preset.duration);
    }
  });
});

describe("search backend adapters", () => {
  it("normalizes arrays and wrapped responses", () => {
    expect(
      normalizeSearchResults({ results: [{ title: "A", href: "/a" }] }, 8)[0],
    ).toMatchObject({ title: "A", href: "/a", pageTitle: "A" });

    expect(
      normalizeSearchResults(
        [{ title: "B", url: "/b", content: "正文", id: "b" }],
        8,
      )[0],
    ).toMatchObject({ title: "B", href: "/b", excerpt: "正文", id: "b" });

    expect(normalizeSearchResults([{ title: "C" }], 8)).toHaveLength(0);
    expect(
      normalizeSearchResults([{ title: "D", href: "/d" }], 1),
    ).toHaveLength(1);
  });

  it("resolves endpoints against the site base", () => {
    expect(resolveSearchEndpoint("/search-index.json", "/docs/")).toBe(
      "/docs/search-index.json",
    );
    expect(resolveSearchEndpoint("search-index.json", "/")).toBe(
      "/search-index.json",
    );
    expect(resolveSearchEndpoint("https://api.example.com/search", "/docs/")).toBe(
      "https://api.example.com/search",
    );
  });

  it("builds GET and POST HTTP requests", () => {
    const get = buildHttpRequest(
      {
        type: "http",
        endpoint: "/api/search",
        queryParam: "keyword",
        limitParam: "size",
      },
      "按钮 配置",
      5,
      "/docs/",
    );

    expect(get.url).toBe(
      "/docs/api/search?keyword=%E6%8C%89%E9%92%AE+%E9%85%8D%E7%BD%AE&size=5",
    );
    expect(get.init.method).toBe("GET");

    const post = buildHttpRequest(
      { type: "http", endpoint: "/api/search", method: "POST" },
      "按钮",
      5,
    );

    expect(post.init.method).toBe("POST");
    expect(post.init.headers).toMatchObject({
      "Content-Type": "application/json",
    });
    expect(JSON.parse(String(post.init.body))).toEqual({
      q: "按钮",
      limit: 5,
    });
  });

  it("calls registered backends and reports missing IDs", async () => {
    registerSearchBackend("test-search", async (query) => [
      {
        id: "test",
        title: query,
        href: "/test",
        pageTitle: "测试",
        excerpt: "结果",
      },
    ]);

    const backend = createSearchBackend({
      type: "registered",
      id: "test-search",
    });
    const result = await backend.search("自定义", { limit: 5 });
    expect(result[0]).toMatchObject({
      title: "自定义",
      href: "/test",
    });

    const missing = createSearchBackend({
      type: "registered",
      id: "does-not-exist",
    });
    await expect(
      missing.search("x", { limit: 5 }),
    ).rejects.toMatchObject({
      code: "backend-missing",
      params: { id: "does-not-exist" },
    });
  });

  it("passes the locale being read to registered backends", async () => {
    let received: unknown;
    registerSearchBackend("locale-search", (_query, context) => {
      received = context;
      return [];
    });

    await createSearchBackend({ type: "registered", id: "locale-search" })
      .search("x", { limit: 3, lang: "en-US", locale: "en-US" });

    expect(received).toMatchObject({ lang: "en-US", locale: "en-US" });
  });

  it("keeps local results inside the locale being read", async () => {
    const page = (id: string, href: string): SearchIndexEntry => ({
      id,
      pageTitle: "Theme",
      title: "Theme",
      heading: "",
      href,
      content: "",
      level: 0,
    });
    const index = [
      page("zh", "/guide"),
      page("en", "/en-US/guide"),
      page("en-home", "/en-US/"),
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ version: 1, entries: index })),
    );

    try {
      const backend = createSearchBackend(
        { type: "local", endpoint: "/index.json" },
        { locales: ["root", "en-US"] },
      );
      const ids = async (locale: string) =>
        (await backend.search("theme", { limit: 10, locale })).map(
          (result) => result.id,
        );

      expect(await ids("root")).toEqual(["zh"]);
      expect((await ids("en-US")).sort()).toEqual(["en", "en-home"]);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("describes built-in failures in the reader's language", () => {
    const zh = resolveMessages("zh-CN");
    const en = resolveMessages("en");

    const unavailable = new AkariSearchError("index-unavailable", {
      status: 404,
    });
    const missing = new AkariSearchError("backend-missing", { id: "x" });

    expect(describeSearchError(unavailable, zh)).toBe(
      "无法加载本地搜索索引（HTTP 404）。",
    );
    expect(describeSearchError(missing, en)).toBe(
      'No search backend is registered as "x".',
    );
    expect(describeSearchError(new Error("Custom failure"), zh)).toBe(
      "Custom failure",
    );
    expect(describeSearchError("unknown", zh)).toBe("搜索失败，请稍后重试。");
  });
});
