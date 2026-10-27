import { describe, expect, it } from "vitest";

import {
  findPrevNext,
  flattenSidebar,
  hasActiveItem,
  isActiveLink,
  isExternalLink,
  normalizePath,
  resolveSidebarItems,
} from "../docs/.vitepress/theme/sidebar";
import type {
  M3eSidebarItem,
  ResolvedSidebarConfig,
} from "../docs/.vitepress/theme/types";

const m3eConfig: ResolvedSidebarConfig = {
  source: "m3e",
  m3eItems: {
    "/": [{ text: "概览", link: "/" }],
    "/guide/": [
      {
        text: "指南",
        icon: "home",
        items: [
          { text: "安装", link: "/guide/install" },
          { text: "配置", link: "/guide/config" },
        ],
      },
    ],
    "/guide/advanced/": [{ text: "高级", link: "/guide/advanced/one" }],
  },
  width: 320,
};

const nestedItems: M3eSidebarItem[] = [
  { text: "A", link: "/a" },
  {
    text: "B",
    items: [
      { text: "B1", link: "/b1" },
      { text: "B2", items: [{ text: "B2a", link: "/b2a" }] },
    ],
  },
  { text: "C", link: "/c" },
];

describe("normalizePath", () => {
  const cases: Array<[string, string, string]> = [
    ["/guide/intro?tab=1#section", "/", "/guide/intro"],
    ["/guide/intro.html", "/", "/guide/intro"],
    ["/guide/intro.html/", "/", "/guide/intro"],
    ["/guide/intro.html?x=1#y", "/", "/guide/intro"],
    ["/guide/", "/", "/guide"],
    ["/guide", "/", "/guide"],
    ["/", "/", "/"],
    ["", "/", "/"],
    ["guide/intro", "/", "/guide/intro"],
    ["/docs/guide/", "/docs/", "/guide"],
    ["/docs/guide/install.html", "/docs/", "/guide/install"],
    ["/docs/guide?x#y", "/docs/", "/guide"],
    ["/docs", "/docs/", "/"],
    ["/docs/", "/docs/", "/"],
    ["/docs/guide/", "/docs", "/guide"],
    ["/docs-other/guide", "/docs/", "/docs-other/guide"],
  ];

  it.each(cases)("normalizes %s with base %s to %s", (input, base, expected) => {
    expect(normalizePath(input, base)).toBe(expected);
  });
});

describe("isExternalLink", () => {
  it.each(["https://example.com", "http://example.com", "//cdn.example.com/x", "mailto:a@b.c"])(
    "treats %s as external",
    (link) => {
      expect(isExternalLink(link)).toBe(true);
    },
  );

  it.each(["/guide", "guide", "#section", ""])(
    "treats %s as internal or non-external",
    (link) => {
      expect(isExternalLink(link)).toBe(false);
    },
  );
});

describe("isActiveLink", () => {
  const cases: Array<[string, string, string, boolean]> = [
    ["/guide/", "/guide", "/", true],
    ["/guide", "/guide/", "/", true],
    ["/guide/intro.html?x=1#section", "/guide/intro", "/", true],
    ["/docs/guide/install/", "/guide/install", "/docs/", true],
    ["/docs/guide/install", "/docs/guide/install", "/docs/", true],
    ["/guide/advanced", "/guide", "/", false],
    ["/guide/intro", "/guide/install", "/", false],
    ["/guide/intro", "https://github.com/vuejs", "/", false],
    ["/guide/intro", "mailto:docs@example.com", "/", false],
    ["/guide/intro", "#installation", "/", false],
    ["/guide/intro", "", "/", false],
  ];

  it.each(cases)(
    "isActiveLink(%s, %s, base %s) is %s",
    (current, target, base, expected) => {
      expect(isActiveLink(current, target, base)).toBe(expected);
    },
  );
});

describe("resolveSidebarItems", () => {
  it("picks the longest matching prefix in m3e mode", () => {
    expect(
      resolveSidebarItems(m3eConfig, "/guide/advanced/one"),
    ).toEqual([{ text: "高级", link: "/guide/advanced/one" }]);
  });

  it("picks the guide group for a direct child route", () => {
    const items = resolveSidebarItems(m3eConfig, "/guide/install");

    expect(items).toHaveLength(1);
    expect(items[0]?.text).toBe("指南");
    expect(items[0]?.icon).toBe("home");
    expect(items[0]?.items?.map((item) => item.text)).toEqual([
      "安装",
      "配置",
    ]);
  });

  it("matches a prefix without a trailing slash", () => {
    const items = resolveSidebarItems(m3eConfig, "/guide");

    expect(items[0]?.text).toBe("指南");
  });

  it("normalizes the route and site base before matching", () => {
    expect(
      resolveSidebarItems(
        m3eConfig,
        "/docs/guide/advanced/one.html?x=1#section",
        "/docs/",
      ),
    ).toEqual([{ text: "高级", link: "/guide/advanced/one" }]);
  });

  it("uses the / entry as a catch-all", () => {
    expect(resolveSidebarItems(m3eConfig, "/api/reference")).toEqual([
      { text: "概览", link: "/" },
    ]);
  });

  it("returns an empty array when no dictionary entry matches", () => {
    const config: ResolvedSidebarConfig = {
      source: "m3e",
      m3eItems: {
        "/guide/": [{ text: "安装", link: "/guide/install" }],
      },
      width: 320,
    };

    expect(resolveSidebarItems(config, "/api/reference")).toEqual([]);
  });

  it("converts native sidebar items and preserves extras", () => {
    const nativeItems = [
      { text: "Home", link: "/" },
      {
        text: "Guide",
        icon: "menu_book",
        badge: "New",
        collapsed: true,
        items: [
          { text: "Install", link: "/guide/install" },
          { link: "/guide/config" },
        ],
      },
    ];
    const config: ResolvedSidebarConfig = {
      source: "native",
      nativeItems,
      width: 320,
    };

    const items = resolveSidebarItems(config, "/guide/install");

    expect(items).toEqual([
      { text: "Home", link: "/" },
      {
        text: "Guide",
        icon: "menu_book",
        badge: "New",
        collapsed: true,
        items: [
          { text: "Install", link: "/guide/install" },
          { text: "/guide/config", link: "/guide/config" },
        ],
      },
    ]);
    expect(items[1]?.items?.[1]?.text).toBe("/guide/config");
  });

  it("applies group base to native child links", () => {
    const nativeItems = [
      {
        text: "指南",
        base: "/guide/",
        items: [
          { text: "安装", link: "install" },
          {
            text: "高级",
            base: "advanced/",
            items: [{ text: "One", link: "one" }],
          },
        ],
      },
      { text: "API", link: "/api" },
    ];
    const config: ResolvedSidebarConfig = {
      source: "native",
      nativeItems,
      width: 320,
    };

    const items = resolveSidebarItems(config, "/guide/install");

    expect(items).toEqual([
      {
        text: "指南",
        items: [
          { text: "安装", link: "/guide/install" },
          {
            text: "高级",
            items: [{ text: "One", link: "/guide/advanced/one" }],
          },
        ],
      },
      { text: "API", link: "/api" },
    ]);

    // Conversion must not mutate the user's native config.
    expect(nativeItems[0]?.items?.[0]?.link).toBe("install");
  });

  it("picks the longest prefix for native dictionary configs", () => {
    const nativeItems = {
      "/": [{ text: "Home", link: "/" }],
      "/guide/": [{ text: "Install", link: "/guide/install" }],
      "/guide/advanced/": [
        { text: "Advanced", link: "/guide/advanced/one" },
      ],
    };
    const config: ResolvedSidebarConfig = {
      source: "native",
      nativeItems,
      width: 320,
    };

    expect(
      resolveSidebarItems(config, "/guide/advanced/one"),
    ).toEqual([{ text: "Advanced", link: "/guide/advanced/one" }]);
    expect(resolveSidebarItems(config, "/guide/install")).toEqual([
      { text: "Install", link: "/guide/install" },
    ]);
    expect(resolveSidebarItems(config, "/api")).toEqual([
      { text: "Home", link: "/" },
    ]);
  });

  it("returns an empty array for a native dictionary with no match", () => {
    const config: ResolvedSidebarConfig = {
      source: "native",
      nativeItems: {
        "/guide/": [{ text: "Install", link: "/guide/install" }],
      },
      width: 320,
    };

    expect(resolveSidebarItems(config, "/api")).toEqual([]);
  });

  it.each([undefined, null, "not-a-sidebar", 42])(
    "returns an empty array for invalid native sidebar %j",
    (nativeItems) => {
      const config: ResolvedSidebarConfig = {
        source: "native",
        nativeItems,
        width: 320,
      };

      expect(resolveSidebarItems(config, "/guide")).toEqual([]);
    },
  );

  it("falls back to native items when m3e source has no items", () => {
    const config: ResolvedSidebarConfig = {
      source: "m3e",
      nativeItems: [{ text: "Home", link: "/" }],
      width: 320,
    };

    expect(resolveSidebarItems(config, "/")).toEqual([
      { text: "Home", link: "/" },
    ]);
  });
});

describe("flattenSidebar", () => {
  it("flattens depth-first in document order", () => {
    expect(flattenSidebar(nestedItems).map((item) => item.text)).toEqual([
      "A",
      "B1",
      "B2a",
      "C",
    ]);
  });

  it("keeps a group with a link before its children", () => {
    const items: M3eSidebarItem[] = [
      { text: "G", link: "/g", items: [{ text: "G1", link: "/g1" }] },
    ];

    expect(flattenSidebar(items).map((item) => item.text)).toEqual([
      "G",
      "G1",
    ]);
  });

  it("returns an empty array for an empty sidebar", () => {
    expect(flattenSidebar([])).toEqual([]);
  });

  it("does not mutate the input tree", () => {
    flattenSidebar(nestedItems);

    expect(nestedItems).toHaveLength(3);
    expect(nestedItems[1]?.items).toHaveLength(2);
  });
});

describe("findPrevNext", () => {
  it("returns the adjacent flat items for a middle item", () => {
    const { prev, next } = findPrevNext(nestedItems, "/b1");

    expect(prev?.text).toBe("A");
    expect(next?.text).toBe("B2a");
  });

  it("returns no previous item for the first entry", () => {
    const { prev, next } = findPrevNext(nestedItems, "/a");

    expect(prev).toBeUndefined();
    expect(next?.text).toBe("B1");
  });

  it("returns no next item for the last entry", () => {
    const { prev, next } = findPrevNext(nestedItems, "/c");

    expect(prev?.text).toBe("B2a");
    expect(next).toBeUndefined();
  });

  it("skips groups without links", () => {
    const { prev, next } = findPrevNext(nestedItems, "/b2a");

    expect(prev?.text).toBe("B1");
    expect(next?.text).toBe("C");
  });

  it("matches routes with base, trailing slash, query and hash", () => {
    const { prev, next } = findPrevNext(
      nestedItems,
      "/docs/b1/?x=1#section",
      "/docs/",
    );

    expect(prev?.text).toBe("A");
    expect(next?.text).toBe("B2a");
  });

  it("returns empty results when the route is not in the sidebar", () => {
    const { prev, next } = findPrevNext(nestedItems, "/missing");

    expect(prev).toBeUndefined();
    expect(next).toBeUndefined();
  });

  it("treats a group link as a navigation step", () => {
    const items: M3eSidebarItem[] = [
      { text: "G", link: "/g", items: [{ text: "G1", link: "/g1" }] },
    ];

    const { prev, next } = findPrevNext(items, "/g");

    expect(prev).toBeUndefined();
    expect(next?.text).toBe("G1");
  });
});

describe("hasActiveItem", () => {
  const group: M3eSidebarItem = {
    text: "Guide",
    items: [
      {
        text: "Advanced",
        items: [{ text: "One", link: "/guide/advanced/one" }],
      },
      { text: "Install", link: "/guide/install" },
    ],
  };

  it("detects a deeply nested active item", () => {
    expect(hasActiveItem(group, "/guide/advanced/one")).toBe(true);
  });

  it("detects an active item under a site base", () => {
    expect(
      hasActiveItem(group, "/docs/guide/install/", "/docs/"),
    ).toBe(true);
  });

  it("returns false when no descendant matches", () => {
    expect(hasActiveItem(group, "/guide/config")).toBe(false);
  });

  it("detects a link on the item itself", () => {
    const item: M3eSidebarItem = { text: "Guide", link: "/guide/" };

    expect(hasActiveItem(item, "/guide")).toBe(true);
  });

  it("ignores external and hash-only descendants", () => {
    const item: M3eSidebarItem = {
      text: "Links",
      items: [
        { text: "GitHub", link: "https://github.com/vuejs" },
        { text: "Anchor", link: "#top" },
      ],
    };

    expect(hasActiveItem(item, "/guide")).toBe(false);
  });

  it("handles a group without its own link", () => {
    const item: M3eSidebarItem = {
      text: "Group",
      items: [{ text: "Child", link: "/child" }],
    };

    expect(hasActiveItem(item, "/child")).toBe(true);
    expect(hasActiveItem(item, "/other")).toBe(false);
  });
});
