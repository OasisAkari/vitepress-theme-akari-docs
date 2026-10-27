import { describe, expect, it } from "vitest";

import {
  defineM3eThemeConfig,
  resolveM3eConfig,
} from "../docs/.vitepress/theme/config";
import {
  DEFAULT_SECTION_LABELS,
  DEFAULT_SETTINGS,
  SETTINGS_SECTION_KEYS,
  SETTINGS_STORAGE_KEY,
} from "../docs/.vitepress/theme/constants";
import { normalizeSettings } from "../docs/.vitepress/theme/settings";
import type {
  M3eSocialLink,
  M3eThemeConfig,
  M3eThemeSettings,
  SettingsSectionKey,
} from "../docs/.vitepress/theme/types";

const ALL_SECTIONS: SettingsSectionKey[] = [
  "color",
  "variant",
  "scheme",
  "contrast",
  "motion",
  "direction",
  "textSize",
];

function configWithSections(sections: unknown) {
  return resolveM3eConfig({
    m3e: {
      settings: {
        sections: sections as SettingsSectionKey[],
      },
    },
  });
}

describe("resolveM3eConfig defaults", () => {
  it("provides app bar defaults", () => {
    const { appBar } = resolveM3eConfig();

    expect(appBar.title).toBe("Documentation");
    expect(appBar.version).toBeUndefined();
    expect(appBar.logo).toBeUndefined();
    expect(appBar.showSidebarToggle).toBe(true);
    expect(appBar.showSettingsToggle).toBe(true);
    expect(appBar.socialLinks).toEqual([]);
  });

  it("provides the seven settings sections in the documented order", () => {
    const { settings } = resolveM3eConfig();

    expect(settings.sections).toEqual(ALL_SECTIONS);
    expect(settings.sections).toHaveLength(7);
    expect(settings.enabled).toBe(true);
    expect(settings.title).toBe("设置");
    expect(settings.labels).toEqual(DEFAULT_SECTION_LABELS);
    expect(settings.persist).toBe(true);
    expect(settings.storageKey).toBe(SETTINGS_STORAGE_KEY);
  });

  it("normalizes the default settings used by the settings API", () => {
    const { settings } = resolveM3eConfig();

    expect(settings.defaults).toEqual({
      ...DEFAULT_SETTINGS,
      color: "#6750a4",
    });
    expect(settings.defaults).toEqual(normalizeSettings(DEFAULT_SETTINGS));
  });

  it("provides TOC defaults", () => {
    expect(resolveM3eConfig().toc).toEqual({
      enabled: true,
      maxDepth: 3,
      overline: "本页内容",
    });
  });

  it("provides footer defaults", () => {
    expect(resolveM3eConfig().footer).toEqual({
      message: "基于 VitePress 与 M3E 构建",
      copyright: "",
      showPrevNext: true,
    });
  });

  it("defaults the sidebar to native mode with no items", () => {
    const { sidebar } = resolveM3eConfig();

    expect(sidebar.source).toBe("native");
    expect(sidebar.m3eItems).toBeUndefined();
    expect(sidebar.nativeItems).toBeUndefined();
    expect(sidebar.width).toBe(320);
  });

  it("defaults components to an empty object", () => {
    expect(resolveM3eConfig().components).toEqual({});
  });
});

describe("resolveM3eConfig app bar", () => {
  it("prefers appBar.title over the site title", () => {
    const config = resolveM3eConfig(
      { m3e: { appBar: { title: "主题文档" } } },
      { title: "站点标题" },
    );

    expect(config.appBar.title).toBe("主题文档");
  });

  it("falls back to the site title", () => {
    expect(resolveM3eConfig({}, { title: "站点标题" }).appBar.title).toBe(
      "站点标题",
    );
  });

  it("prefers appBar.logo over the site logo", () => {
    const config = resolveM3eConfig({
      logo: "/site-logo.svg",
      m3e: { appBar: { logo: "/app-logo.svg" } },
    });

    expect(config.appBar.logo).toBe("/app-logo.svg");
    expect(resolveM3eConfig({ logo: "/site-logo.svg" }).appBar.logo).toBe(
      "/site-logo.svg",
    );
  });

  it("keeps explicit false toggles and custom version", () => {
    const config = resolveM3eConfig({
      m3e: {
        appBar: {
          version: "1.2.3",
          showSidebarToggle: false,
          showSettingsToggle: false,
        },
      },
    });

    expect(config.appBar.version).toBe("1.2.3");
    expect(config.appBar.showSidebarToggle).toBe(false);
    expect(config.appBar.showSettingsToggle).toBe(false);
  });
});

describe("resolveM3eConfig sidebar source", () => {
  it("keeps a native array sidebar and reports native mode", () => {
    const nativeItems = [{ text: "Home", link: "/" }];
    const { sidebar } = resolveM3eConfig({ sidebar: nativeItems });

    expect(sidebar.source).toBe("native");
    expect(sidebar.nativeItems).toBe(nativeItems);
    expect(sidebar.m3eItems).toBeUndefined();
  });

  it("keeps a native dictionary sidebar and reports native mode", () => {
    const nativeItems = {
      "/": [{ text: "Home", link: "/" }],
    };
    const { sidebar } = resolveM3eConfig({ sidebar: nativeItems });

    expect(sidebar.source).toBe("native");
    expect(sidebar.nativeItems).toBe(nativeItems);
  });

  it("uses m3e mode when rich sidebar items exist", () => {
    const items = [{ text: "Home", link: "/" }];
    const nativeItems = [{ text: "Native", link: "/native" }];
    const { sidebar } = resolveM3eConfig({
      sidebar: nativeItems,
      m3e: { sidebar: { items } },
    });

    expect(sidebar.source).toBe("m3e");
    expect(sidebar.m3eItems).toBe(items);
    expect(sidebar.nativeItems).toBe(nativeItems);
  });

  it("uses m3e mode for a non-empty dictionary", () => {
    const items = {
      "/": [{ text: "Home", link: "/" }],
    };
    const { sidebar } = resolveM3eConfig({
      m3e: { sidebar: { items, width: 300 } },
    });

    expect(sidebar.source).toBe("m3e");
    expect(sidebar.m3eItems).toBe(items);
    expect(sidebar.width).toBe(300);
  });
});

describe("resolveM3eConfig settings.sections", () => {
  it("filters invalid keys, dedupes and preserves first-seen order", () => {
    const { settings } = configWithSections([
      "scheme",
      "color",
      "scheme",
      "bogus",
      42,
    ]);

    expect(settings.sections).toEqual(["scheme", "color"]);
  });

  it("falls back to all sections when every key is invalid", () => {
    expect(configWithSections(["bogus", null, 42]).settings.sections).toEqual(
      ALL_SECTIONS,
    );
  });

  it("falls back to all sections for an empty array", () => {
    expect(configWithSections([]).settings.sections).toEqual(ALL_SECTIONS);
  });

  it("falls back to all sections for a non-array value", () => {
    expect(configWithSections("color").settings.sections).toEqual(
      ALL_SECTIONS,
    );
  });

  it("returns a fresh array that cannot corrupt the defaults", () => {
    const first = resolveM3eConfig().settings.sections;

    expect(first).not.toBe(SETTINGS_SECTION_KEYS);

    first.length = 0;

    expect(resolveM3eConfig().settings.sections).toEqual(ALL_SECTIONS);
    expect(SETTINGS_SECTION_KEYS).toHaveLength(7);
  });
});

describe("resolveM3eConfig settings.labels", () => {
  it("merges custom labels with the defaults", () => {
    const { settings } = resolveM3eConfig({
      m3e: {
        settings: {
          labels: { color: "主题色", textSize: "文字大小" },
        },
      },
    });

    expect(settings.labels).toEqual({
      ...DEFAULT_SECTION_LABELS,
      color: "主题色",
      textSize: "文字大小",
    });
  });

  it("keeps every default label when only one is overridden", () => {
    const { settings } = resolveM3eConfig({
      m3e: { settings: { labels: { scheme: "模式" } } },
    });

    expect(settings.labels.scheme).toBe("模式");
    expect(settings.labels.color).toBe(DEFAULT_SECTION_LABELS.color);
    expect(settings.labels.motion).toBe(DEFAULT_SECTION_LABELS.motion);
  });
});

describe("resolveM3eConfig appBar.socialLinks", () => {
  const github: M3eSocialLink = {
    icon: "github",
    link: "https://github.com/vuejs",
    label: "GitHub",
  };
  const npmLink: M3eSocialLink = {
    icon: "npm",
    link: "https://www.npmjs.com/package/example",
    label: "npm",
  };

  it("filters entries with missing or wrongly typed fields", () => {
    const entries = [
      { icon: "github", link: "https://github.com/vuejs" },
      github,
      { icon: "github", link: 42, label: "Broken" },
      null,
      npmLink,
    ];
    const { appBar } = resolveM3eConfig({
      m3e: {
        appBar: {
          socialLinks: entries as unknown as M3eSocialLink[],
        },
      },
    });

    expect(appBar.socialLinks).toEqual([github, npmLink]);
    expect(appBar.socialLinks[0]).toBe(github);
  });

  it("returns an empty array for a non-array value", () => {
    const { appBar } = resolveM3eConfig({
      m3e: {
        appBar: {
          socialLinks: "github" as unknown as M3eSocialLink[],
        },
      },
    });

    expect(appBar.socialLinks).toEqual([]);
  });
});

describe("resolveM3eConfig settings passthrough", () => {
  it("keeps explicit settings flags, title and storage key", () => {
    const { settings } = resolveM3eConfig({
      m3e: {
        settings: {
          enabled: false,
          title: "偏好",
          persist: false,
          storageKey: "custom-key",
        },
      },
    });

    expect(settings.enabled).toBe(false);
    expect(settings.title).toBe("偏好");
    expect(settings.persist).toBe(false);
    expect(settings.storageKey).toBe("custom-key");
  });

  it("merges valid partial defaults and keeps the canonical default color", () => {
    const { settings } = resolveM3eConfig({
      m3e: {
        settings: {
          defaults: {
            scheme: "dark",
            variant: "fidelity",
            textSize: "32px",
          },
        },
      },
    });

    expect(settings.defaults).toEqual({
      ...DEFAULT_SETTINGS,
      color: "#6750a4",
      scheme: "dark",
      variant: "fidelity",
      textSize: "32px",
    });
  });

  it("falls back to the canonical lowercase color for an invalid color override", () => {
    // Regression guard: every normalization path must yield lowercase hex
    // colors, including the invalid-value fallback used by mergeSettings.
    const { settings } = resolveM3eConfig({
      m3e: {
        settings: {
          defaults: {
            color: "red",
          } as unknown as Partial<M3eThemeSettings>,
        },
      },
    });

    expect(settings.defaults.color).toBe("#6750a4");
  });
});

describe("resolveM3eConfig sidebar width clamp", () => {
  const widthCases: Array<[unknown, number]> = [
    [0, 240],
    [239, 240],
    [240, 240],
    [320, 320],
    [399, 399],
    [400, 400],
    [401, 400],
    [1000, 400],
    [-10, 240],
    [Number.NaN, 320],
    [Number.POSITIVE_INFINITY, 320],
    ["360", 320],
    [null, 320],
    [undefined, 320],
  ];

  it.each(widthCases)("clamps width %s to %s", (width, expected) => {
    const config = resolveM3eConfig({
      m3e: { sidebar: { width: width as number | undefined } },
    });

    expect(config.sidebar.width).toBe(expected);
  });
});

describe("resolveM3eConfig toc", () => {
  const depthCases: Array<[unknown, number]> = [
    [0, 1],
    [1, 1],
    [3, 3],
    [4, 4],
    [6, 6],
    [7, 6],
    [-4, 1],
    [2.5, 3],
    [Number.NaN, 3],
    [Number.POSITIVE_INFINITY, 3],
    ["4", 3],
    [undefined, 3],
  ];

  it.each(depthCases)("clamps maxDepth %s to %s", (maxDepth, expected) => {
    const config = resolveM3eConfig({
      m3e: { toc: { maxDepth: maxDepth as number | undefined } },
    });

    expect(config.toc.maxDepth).toBe(expected);
  });

  it("keeps explicit toc flags and overline", () => {
    const { toc } = resolveM3eConfig({
      m3e: { toc: { enabled: false, overline: "目录" } },
    });

    expect(toc).toEqual({ enabled: false, maxDepth: 3, overline: "目录" });
  });
});

describe("resolveM3eConfig footer", () => {
  it("keeps explicit footer values including false", () => {
    const { footer } = resolveM3eConfig({
      m3e: {
        footer: {
          message: "自定义信息",
          copyright: "© 2026",
          showPrevNext: false,
        },
      },
    });

    expect(footer).toEqual({
      message: "自定义信息",
      copyright: "© 2026",
      showPrevNext: false,
    });
  });
});

describe("resolveM3eConfig components", () => {
  it("passes the components map through by reference", () => {
    const components: M3eThemeConfig["components"] = {};
    const { components: resolved } = resolveM3eConfig({
      m3e: { components },
    });

    expect(resolved).toBe(components);
  });
});

describe("defineM3eThemeConfig", () => {
  it("returns the input object unchanged", () => {
    const input: M3eThemeConfig = {
      appBar: { title: "主题文档", socialLinks: [] },
      sidebar: { width: 300 },
      settings: { sections: ["color", "scheme"] },
      toc: { maxDepth: 4 },
      footer: { showPrevNext: false },
    };

    const output = defineM3eThemeConfig(input);

    expect(output).toBe(input);
    expect(output).toEqual(input);
  });
});
