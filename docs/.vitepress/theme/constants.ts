import type {
  AkariColorScheme,
  AkariContrastLevel,
  AkariDirection,
  AkariMessages,
  AkariMotionScheme,
  AkariTextSize,
  AkariThemeSettings,
  AkariThemeVariant,
  SettingsSectionKey,
} from "./types";

export const AKARI_CONTENT_ID = "akari-doc-content";
export const AKARI_SIDEBAR_ID = "akari-sidebar";
export const AKARI_SETTINGS_ID = "akari-settings";
export const SETTINGS_STORAGE_KEY = "akari-docs-settings";

// Navigation layout breakpoints, aligned with the M3 window size classes
// used by m3.material.io. Keep in sync with the media queries in base.css.
export const AKARI_NAV_RAIL_QUERY = "(min-width: 960px)";
export const AKARI_NAV_DRAWER_PINNED_QUERY = "(min-width: 1600px)";

export const DEFAULT_SEARCH_ENDPOINT = "/search-index.json";
export const DEFAULT_SEARCH_SHORTCUT = "k";
export const DEFAULT_SEARCH_MAX_RESULTS = 8;
export const DEFAULT_SEARCH_DEBOUNCE = 180;

// Appearance has a button of its own and is not a section of the dialog.
export const SETTINGS_SECTION_KEYS: SettingsSectionKey[] = [
  "color",
  "variant",
  "contrast",
  "motion",
  "direction",
  "textSize",
];

/** Message holding the default heading of each settings section. */
export const SECTION_LABEL_MESSAGES: Record<
  SettingsSectionKey,
  keyof AkariMessages
> = {
  color: "settingsColor",
  variant: "settingsVariant",
  contrast: "settingsContrast",
  motion: "settingsMotion",
  direction: "settingsDirection",
  textSize: "settingsTextSize",
};

export const DEFAULT_SETTINGS: AkariThemeSettings = {
  color: "#6750a4",
  variant: "tonal-spot",
  scheme: "auto",
  contrast: "standard",
  motion: "expressive",
  direction: "auto",
  textSize: "16px",
};

export const VARIANT_VALUES: AkariThemeVariant[] = [
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
  value: AkariThemeVariant;
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

export const SCHEME_VALUES: AkariColorScheme[] = [
  "light",
  "auto",
  "dark",
  "time",
];

/** Name and icon of each appearance mode, for the appearance button. */
export const SCHEME_OPTIONS: Readonly<
  Record<AkariColorScheme, { message: keyof AkariMessages; icon: string }>
> = {
  auto: { message: "schemeAuto", icon: "brightness_auto" },
  light: { message: "schemeLight", icon: "light_mode" },
  dark: { message: "schemeDark", icon: "dark_mode" },
  time: { message: "schemeTime", icon: "schedule" },
};

export const CONTRAST_VALUES: AkariContrastLevel[] = [
  "standard",
  "medium",
  "high",
];

export const CONTRAST_OPTIONS: ReadonlyArray<{
  value: AkariContrastLevel;
  message: keyof AkariMessages;
}> = [
  { value: "standard", message: "contrastStandard" },
  { value: "medium", message: "contrastMedium" },
  { value: "high", message: "contrastHigh" },
];

export const MOTION_VALUES: AkariMotionScheme[] = ["standard", "expressive"];

export const MOTION_OPTIONS: ReadonlyArray<{
  value: AkariMotionScheme;
  message: keyof AkariMessages;
}> = [
  { value: "standard", message: "motionStandard" },
  { value: "expressive", message: "motionExpressive" },
];

export const DIRECTION_VALUES: AkariDirection[] = ["auto", "ltr", "rtl"];

export const DIRECTION_OPTIONS: ReadonlyArray<{
  value: AkariDirection;
  message: keyof AkariMessages;
  icon: string;
}> = [
  {
    value: "auto",
    message: "directionAuto",
    icon: "translate",
  },
  {
    value: "ltr",
    message: "directionLtr",
    icon: "format_textdirection_l_to_r",
  },
  {
    value: "rtl",
    message: "directionRtl",
    icon: "format_textdirection_r_to_l",
  },
];

export const TEXT_SIZE_VALUES: AkariTextSize[] = ["16px", "24px", "32px"];

export const TEXT_SIZE_OPTIONS: ReadonlyArray<{
  value: AkariTextSize;
  label: string;
}> = [
  { value: "16px", label: "100%" },
  { value: "24px", label: "150%" },
  { value: "32px", label: "200%" },
];
