import { describe, expect, it } from "vitest";

import { resolveM3eConfig } from "../docs/.vitepress/theme/config";
import {
  computeMorphTransform,
  getSearchMotionPreset,
} from "../docs/.vitepress/theme/search/animation";
import {
  buildHttpRequest,
  createSearchBackend,
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
    content: "使用 themeConfig.m3e.sidebar 配置导航。",
    level: 2,
  },
];

describe("resolveM3eConfig search", () => {
  it("uses local defaults", () => {
    expect(resolveM3eConfig().search).toEqual({
      enabled: true,
      placeholder: "搜索文档",
      shortcut: "k",
      maxResults: 8,
      debounce: 180,
      backend: { type: "local", endpoint: "/search-index.json" },
    });
  });

  it("clamps numbers and rejects invalid backends", () => {
    const { search } = resolveM3eConfig({
      m3e: {
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
    expect(search.backend).toEqual({
      type: "local",
      endpoint: "/search-index.json",
    });
  });

  it("keeps a valid http backend and applies defaults", () => {
    const { search } = resolveM3eConfig({
      m3e: {
        search: {
          backend: {
            type: "http",
            endpoint: " /api/search ",
            method: "POST",
            headers: { Authorization: "Bearer x" },
          },
        },
      },
    });

    expect(search.backend).toMatchObject({
      type: "http",
      endpoint: "/api/search",
      method: "POST",
      headers: { Authorization: "Bearer x" },
      credentials: "same-origin",
      queryParam: "q",
      limitParam: "limit",
    });
  });

  it("accepts a registered backend and allows disabling the shortcut", () => {
    const { search } = resolveM3eConfig({
      m3e: {
        search: {
          shortcut: "",
          backend: { type: "registered", id: " my-search " },
        },
      },
    });

    expect(search.shortcut).toBe("");
    expect(search.backend).toEqual({
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
  });

  it("maps index files to clean routes", () => {
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
});

describe("local search", () => {
  it("matches Chinese substrings and ranks title hits", () => {
    const results = searchLocal(entries, "变体", 5);
    expect(results[0].href).toBe("/components/button#变体");
  });

  it("requires every whitespace token", () => {
    expect(searchLocal(entries, "按钮 不存在的词", 5)).toHaveLength(0);
    expect(searchLocal(entries, "配置 导航", 5)).toHaveLength(1);
    expect(searchLocal(entries, "配置 导航", 5)[0].href).toBe(
      "/theme/sidebar#配置",
    );
  });

  it("returns excerpts with context and respects the limit", () => {
    const results = searchLocal(entries, "filled", 1);
    expect(results).toHaveLength(1);
    expect(results[0].excerpt).toContain("filled");
  });
});

describe("highlight splitting", () => {
  it("splits case-insensitive highlights", () => {
    expect(splitHighlight("Filled 和 filled", "filled")).toEqual([
      { text: "Filled", match: true },
      { text: " 和 ", match: false },
      { text: "filled", match: true },
    ]);
  });

  it("returns a single non-match part for an empty query", () => {
    expect(splitHighlight("文档搜索", "   ")).toEqual([
      { text: "文档搜索", match: false },
    ]);
  });
});

describe("search morph animation", () => {
  it("maps the trigger rect onto the dialog rect", () => {
    const morph = computeMorphTransform(
      { left: 100, top: 20, width: 300, height: 40 },
      { left: 360, top: 160, width: 720, height: 300 },
    );

    expect(morph.scaleX).toBeCloseTo(300 / 720);
    expect(morph.scaleY).toBeCloseTo(40 / 300);
    expect(morph.translateX).toBe(-260);
    expect(morph.translateY).toBe(-140);
    expect(morph.transform).toBe(
      "translate(-260px, -140px) scale(0.4166666666666667, 0.13333333333333333)",
    );
  });

  it("keeps a minimum scale for tiny triggers", () => {
    const morph = computeMorphTransform(
      { left: 0, top: 0, width: 0, height: 0 },
      { left: 0, top: 0, width: 720, height: 600 },
    );

    expect(morph.scaleX).toBe(0.02);
    expect(morph.scaleY).toBe(0.02);
  });

  it("provides distinct standard and expressive MD3 presets", () => {
    const standard = getSearchMotionPreset("standard");
    const expressive = getSearchMotionPreset("expressive");

    expect(standard.easing).toBe("cubic-bezier(0.2, 0, 0, 1)");
    expect(expressive.easing).toBe("cubic-bezier(0.38, 1.21, 0.22, 1)");
    expect(expressive.duration).toBeGreaterThan(standard.duration);
    expect(expressive.contentDuration).toBeGreaterThan(
      standard.contentDuration,
    );
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
    registerSearchBackend("test-search", async (query, { limit }) => [
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
    ).rejects.toThrow('未找到搜索后端 "does-not-exist"');
  });
});
