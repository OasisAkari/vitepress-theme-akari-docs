import {
  DEFAULT_SEARCH_DEBOUNCE,
  DEFAULT_SEARCH_ENDPOINT,
  DEFAULT_SEARCH_MAX_RESULTS,
  DEFAULT_SEARCH_PLACEHOLDER,
  DEFAULT_SEARCH_SHORTCUT,
  DEFAULT_SECTION_LABELS,
  DEFAULT_SETTINGS,
  SETTINGS_SECTION_KEYS,
  SETTINGS_STORAGE_KEY,
} from "./constants";
import { mergeSettings } from "./settings";
import type {
  M3eSearchBackendConfig,
  M3eSocialLink,
  M3eThemeConfig,
  ResolvedM3eThemeConfig,
  SettingsSectionKey,
} from "./types";

interface ThemeConfigLike {
  logo?: string;
  sidebar?: unknown;
  m3e?: M3eThemeConfig;
}

export function defineM3eThemeConfig(config: M3eThemeConfig): M3eThemeConfig {
  return config;
}

function normalizeSections(
  value: SettingsSectionKey[] | undefined,
): SettingsSectionKey[] {
  if (!Array.isArray(value)) return [...SETTINGS_SECTION_KEYS];

  const filtered = value.filter((key): key is SettingsSectionKey =>
    SETTINGS_SECTION_KEYS.includes(key),
  );
  const unique = [...new Set(filtered)];
  return unique.length ? unique : [...SETTINGS_SECTION_KEYS];
}

function normalizeSocialLinks(
  value: M3eSocialLink[] | undefined,
): M3eSocialLink[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is M3eSocialLink =>
      !!item &&
      typeof item.icon === "string" &&
      typeof item.link === "string" &&
      typeof item.label === "string",
  );
}

function clampNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, Math.round(value)))
    : fallback;
}

function normalizeSearchBackend(
  value: M3eSearchBackendConfig | undefined,
): M3eSearchBackendConfig {
  if (value?.type === "http" && value.endpoint.trim()) {
    return {
      type: "http",
      endpoint: value.endpoint.trim(),
      method: value.method === "POST" ? "POST" : "GET",
      headers: value.headers ?? {},
      credentials: value.credentials ?? "same-origin",
      queryParam: value.queryParam?.trim() || "q",
      limitParam: value.limitParam?.trim() || "limit",
    };
  }

  if (value?.type === "registered" && value.id.trim()) {
    return { type: "registered", id: value.id.trim() };
  }

  if (value?.type === "local") {
    return {
      type: "local",
      endpoint: value.endpoint?.trim() || DEFAULT_SEARCH_ENDPOINT,
    };
  }

  return { type: "local", endpoint: DEFAULT_SEARCH_ENDPOINT };
}

export function resolveM3eConfig(
  themeConfig: ThemeConfigLike = {},
  site: { title?: string } = {},
): ResolvedM3eThemeConfig {
  const m3e = themeConfig.m3e ?? {};
  const appBar = m3e.appBar ?? {};
  const settings = m3e.settings ?? {};
  const toc = m3e.toc ?? {};
  const footer = m3e.footer ?? {};
  const search = m3e.search ?? {};

  const m3eSidebarItems = m3e.sidebar?.items;
  const hasM3eSidebar =
    !!m3eSidebarItems &&
    (Array.isArray(m3eSidebarItems) ||
      (typeof m3eSidebarItems === "object" &&
        Object.keys(m3eSidebarItems).length > 0));

  const width = Number.isFinite(m3e.sidebar?.width)
    ? Math.min(400, Math.max(240, Number(m3e.sidebar?.width)))
    : 320;

  const maxDepth = Number.isInteger(toc.maxDepth)
    ? Math.min(6, Math.max(1, Number(toc.maxDepth)))
    : 3;

  return {
    appBar: {
      title: appBar.title ?? site.title ?? "Documentation",
      version: appBar.version,
      logo: appBar.logo ?? themeConfig.logo,
      showSidebarToggle: appBar.showSidebarToggle ?? true,
      showSettingsToggle: appBar.showSettingsToggle ?? true,
      socialLinks: normalizeSocialLinks(appBar.socialLinks),
    },
    sidebar: {
      source: hasM3eSidebar ? "m3e" : "native",
      m3eItems: hasM3eSidebar ? m3eSidebarItems : undefined,
      nativeItems: themeConfig.sidebar,
      width,
    },
    settings: {
      enabled: settings.enabled ?? true,
      title: settings.title ?? "设置",
      sections: normalizeSections(settings.sections),
      labels: { ...DEFAULT_SECTION_LABELS, ...settings.labels },
      defaults: mergeSettings(DEFAULT_SETTINGS, settings.defaults),
      persist: settings.persist ?? true,
      storageKey: settings.storageKey ?? SETTINGS_STORAGE_KEY,
    },
    toc: {
      enabled: toc.enabled ?? true,
      maxDepth,
      overline: toc.overline ?? "本页内容",
    },
    footer: {
      message: footer.message ?? "基于 VitePress 与 M3E 构建",
      copyright: footer.copyright ?? "",
      showPrevNext: footer.showPrevNext ?? true,
    },
    search: {
      enabled: search.enabled ?? true,
      placeholder: search.placeholder?.trim() || DEFAULT_SEARCH_PLACEHOLDER,
      shortcut:
        typeof search.shortcut === "string"
          ? search.shortcut.trim().toLowerCase().slice(0, 1)
          : DEFAULT_SEARCH_SHORTCUT,
      maxResults: clampNumber(
        search.maxResults,
        DEFAULT_SEARCH_MAX_RESULTS,
        1,
        20,
      ),
      debounce: clampNumber(search.debounce, DEFAULT_SEARCH_DEBOUNCE, 0, 1000),
      backend: normalizeSearchBackend(search.backend),
    },
    components: m3e.components ?? {},
  };
}
