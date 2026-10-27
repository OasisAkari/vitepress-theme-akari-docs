import type {
  M3eColorScheme,
  M3eContrastLevel,
  M3eDirection,
  M3eMotionScheme,
  M3eTextSize,
  M3eThemeSettings,
  M3eThemeVariant,
  SettingsSectionKey,
} from "./types";

export const M3E_CONTENT_ID = "m3e-doc-content";
export const M3E_SIDEBAR_ID = "m3e-sidebar";
export const M3E_SETTINGS_ID = "m3e-settings";
export const SETTINGS_STORAGE_KEY = "m3e-docs-settings";

export const DEFAULT_SEARCH_ENDPOINT = "/search-index.json";
export const DEFAULT_SEARCH_PLACEHOLDER = "搜索文档";
export const DEFAULT_SEARCH_SHORTCUT = "k";
export const DEFAULT_SEARCH_MAX_RESULTS = 8;
export const DEFAULT_SEARCH_DEBOUNCE = 180;

export const SETTINGS_SECTION_KEYS: SettingsSectionKey[] = [
  "color",
  "variant",
  "scheme",
  "contrast",
  "motion",
  "direction",
  "textSize",
];

export const DEFAULT_SECTION_LABELS: Record<SettingsSectionKey, string> = {
  color: "颜色",
  variant: "色调变体",
  scheme: "明暗模式",
  contrast: "对比度",
  motion: "动效",
  direction: "文字方向",
  textSize: "字号",
};

export const DEFAULT_SETTINGS: M3eThemeSettings = {
  color: "#6750a4",
  variant: "tonal-spot",
  scheme: "auto",
  contrast: "standard",
  motion: "expressive",
  direction: "ltr",
  textSize: "16px",
};

export const VARIANT_VALUES: M3eThemeVariant[] = [
  "tonal-spot",
  "vibrant",
  "fidelity",
  "expressive",
  "monochrome",
  "neutral",
  "rainbow",
  "fruit-salad",
];

export const VARIANT_OPTIONS: ReadonlyArray<{
  value: M3eThemeVariant;
  label: string;
}> = [
  { value: "tonal-spot", label: "Tonal Spot" },
  { value: "vibrant", label: "Vibrant" },
  { value: "fidelity", label: "Fidelity" },
  { value: "expressive", label: "Expressive" },
  { value: "monochrome", label: "Monochrome" },
  { value: "neutral", label: "Neutral" },
  { value: "rainbow", label: "Rainbow" },
  { value: "fruit-salad", label: "Fruit Salad" },
];

export const SCHEME_VALUES: M3eColorScheme[] = ["light", "auto", "dark"];

export const SCHEME_OPTIONS: ReadonlyArray<{
  value: M3eColorScheme;
  label: string;
  icon: string;
}> = [
  { value: "light", label: "浅色", icon: "light_mode" },
  { value: "auto", label: "跟随系统", icon: "settings_brightness" },
  { value: "dark", label: "深色", icon: "dark_mode" },
];

export const CONTRAST_VALUES: M3eContrastLevel[] = [
  "standard",
  "medium",
  "high",
];

export const CONTRAST_OPTIONS: ReadonlyArray<{
  value: M3eContrastLevel;
  label: string;
}> = [
  { value: "standard", label: "默认" },
  { value: "medium", label: "中等" },
  { value: "high", label: "高" },
];

export const MOTION_VALUES: M3eMotionScheme[] = ["standard", "expressive"];

export const MOTION_OPTIONS: ReadonlyArray<{
  value: M3eMotionScheme;
  label: string;
}> = [
  { value: "standard", label: "标准" },
  { value: "expressive", label: "表现力" },
];

export const DIRECTION_VALUES: M3eDirection[] = ["ltr", "rtl"];

export const DIRECTION_OPTIONS: ReadonlyArray<{
  value: M3eDirection;
  label: string;
  icon: string;
}> = [
  { value: "ltr", label: "从左到右", icon: "format_textdirection_l_to_r" },
  { value: "rtl", label: "从右到左", icon: "format_textdirection_r_to_l" },
];

export const TEXT_SIZE_VALUES: M3eTextSize[] = ["16px", "24px", "32px"];

export const TEXT_SIZE_OPTIONS: ReadonlyArray<{
  value: M3eTextSize;
  label: string;
}> = [
  { value: "16px", label: "100%" },
  { value: "24px", label: "150%" },
  { value: "32px", label: "200%" },
];
