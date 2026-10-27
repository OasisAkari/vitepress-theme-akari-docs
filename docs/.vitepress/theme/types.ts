import type { Component } from "vue";

export type M3eThemeVariant =
  | "tonal-spot"
  | "vibrant"
  | "fidelity"
  | "expressive"
  | "monochrome"
  | "neutral"
  | "rainbow"
  | "fruit-salad";

export type M3eColorScheme = "light" | "dark" | "auto";
export type M3eContrastLevel = "standard" | "medium" | "high";
export type M3eMotionScheme = "standard" | "expressive";
export type M3eDirection = "ltr" | "rtl";
export type M3eTextSize = "16px" | "24px" | "32px";

export type SettingsSectionKey =
  | "color"
  | "variant"
  | "scheme"
  | "contrast"
  | "motion"
  | "direction"
  | "textSize";

export interface M3eThemeSettings {
  color: string;
  variant: M3eThemeVariant;
  scheme: M3eColorScheme;
  contrast: M3eContrastLevel;
  motion: M3eMotionScheme;
  direction: M3eDirection;
  textSize: M3eTextSize;
}

export interface M3eSidebarItem {
  text: string;
  link?: string;
  icon?: string;
  badge?: string;
  collapsed?: boolean;
  items?: M3eSidebarItem[];
}

export type M3eSidebarItems =
  | M3eSidebarItem[]
  | Record<string, M3eSidebarItem[]>;

export interface M3eSocialLink {
  icon: string;
  link: string;
  label: string;
}

export interface M3eAppBarConfig {
  title?: string;
  version?: string;
  logo?: string;
  showSidebarToggle?: boolean;
  showSettingsToggle?: boolean;
  socialLinks?: M3eSocialLink[];
}

export interface M3eSidebarConfig {
  items?: M3eSidebarItems;
  width?: number;
}

export interface M3eSettingsConfig {
  enabled?: boolean;
  title?: string;
  sections?: SettingsSectionKey[];
  labels?: Partial<Record<SettingsSectionKey, string>>;
  defaults?: Partial<M3eThemeSettings>;
  persist?: boolean;
  storageKey?: string;
}

export interface M3eTocConfig {
  enabled?: boolean;
  maxDepth?: number;
  overline?: string;
}

export interface M3eFooterConfig {
  message?: string;
  copyright?: string;
  showPrevNext?: boolean;
}

export type M3eComponentSlot =
  | "AppBar"
  | "Sidebar"
  | "Settings"
  | "Toc"
  | "Footer"
  | "Content";

export interface M3eSearchResult {
  id: string;
  title: string;
  href: string;
  pageTitle?: string;
  heading?: string;
  excerpt?: string;
}

export type M3eSearchBackendConfig =
  | { type: "local"; endpoint?: string }
  | {
      type: "http";
      endpoint: string;
      method?: "GET" | "POST";
      headers?: Record<string, string>;
      credentials?: RequestCredentials;
      queryParam?: string;
      limitParam?: string;
    }
  | { type: "registered"; id: string };

export interface M3eSearchConfig {
  enabled?: boolean;
  placeholder?: string;
  shortcut?: string;
  maxResults?: number;
  debounce?: number;
  backend?: M3eSearchBackendConfig;
}

export interface ResolvedM3eSearchConfig {
  enabled: boolean;
  placeholder: string;
  shortcut: string;
  maxResults: number;
  debounce: number;
  backend: M3eSearchBackendConfig;
}

export interface M3eThemeConfig {
  appBar?: M3eAppBarConfig;
  sidebar?: M3eSidebarConfig;
  settings?: M3eSettingsConfig;
  toc?: M3eTocConfig;
  footer?: M3eFooterConfig;
  search?: M3eSearchConfig;
  components?: Partial<Record<M3eComponentSlot, Component>>;
}

export interface ResolvedSidebarConfig {
  source: "m3e" | "native";
  m3eItems?: M3eSidebarItems;
  nativeItems?: unknown;
  width: number;
}

export interface ResolvedM3eThemeConfig {
  appBar: {
    title: string;
    version?: string;
    logo?: string;
    showSidebarToggle: boolean;
    showSettingsToggle: boolean;
    socialLinks: M3eSocialLink[];
  };
  sidebar: ResolvedSidebarConfig;
  settings: {
    enabled: boolean;
    title: string;
    sections: SettingsSectionKey[];
    labels: Record<SettingsSectionKey, string>;
    defaults: M3eThemeSettings;
    persist: boolean;
    storageKey: string;
  };
  toc: {
    enabled: boolean;
    maxDepth: number;
    overline: string;
  };
  footer: {
    message: string;
    copyright: string;
    showPrevNext: boolean;
  };
  search: ResolvedM3eSearchConfig;
  components: Partial<Record<M3eComponentSlot, Component>>;
}

export interface M3eSettingsApi {
  settings: M3eThemeSettings;
  sections: SettingsSectionKey[];
  labels: Record<SettingsSectionKey, string>;
  defaults: M3eThemeSettings;
  setSetting<K extends keyof M3eThemeSettings>(
    key: K,
    value: M3eThemeSettings[K],
  ): void;
  reset(): void;
  isDefault(): boolean;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
