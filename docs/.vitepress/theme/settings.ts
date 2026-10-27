import {
  CONTRAST_VALUES,
  DEFAULT_SETTINGS,
  DIRECTION_VALUES,
  MOTION_VALUES,
  SCHEME_VALUES,
  TEXT_SIZE_VALUES,
  VARIANT_VALUES,
} from "./constants";
import type { M3eThemeSettings, StorageLike } from "./types";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function copySettings(settings: M3eThemeSettings): M3eThemeSettings {
  return { ...settings };
}

function includes<T extends string>(values: T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function normalizeSettings(
  input: unknown,
  defaults: M3eThemeSettings = DEFAULT_SETTINGS,
): M3eThemeSettings {
  const source =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : ({} as Record<string, unknown>);

  return {
    color:
      typeof source.color === "string" && HEX_COLOR.test(source.color)
        ? source.color.toLowerCase()
        : defaults.color,
    variant: includes(VARIANT_VALUES, source.variant)
      ? source.variant
      : defaults.variant,
    scheme: includes(SCHEME_VALUES, source.scheme)
      ? source.scheme
      : defaults.scheme,
    contrast: includes(CONTRAST_VALUES, source.contrast)
      ? source.contrast
      : defaults.contrast,
    motion: includes(MOTION_VALUES, source.motion)
      ? source.motion
      : defaults.motion,
    direction: includes(DIRECTION_VALUES, source.direction)
      ? source.direction
      : defaults.direction,
    textSize: includes(TEXT_SIZE_VALUES, source.textSize)
      ? source.textSize
      : defaults.textSize,
  };
}

export function mergeSettings(
  base: M3eThemeSettings,
  overrides?: Partial<M3eThemeSettings> | null,
): M3eThemeSettings {
  const normalizedBase = normalizeSettings(base, base);
  return normalizeSettings(
    { ...normalizedBase, ...overrides },
    normalizedBase,
  );
}

export function parseStoredSettings(
  raw: string | null,
  defaults: M3eThemeSettings = DEFAULT_SETTINGS,
): M3eThemeSettings {
  if (!raw) return copySettings(defaults);

  try {
    return normalizeSettings(JSON.parse(raw), defaults);
  } catch {
    return copySettings(defaults);
  }
}

export function readStoredSettings(
  storage: StorageLike | undefined,
  key: string,
  defaults: M3eThemeSettings = DEFAULT_SETTINGS,
): M3eThemeSettings {
  if (!storage) return copySettings(defaults);

  try {
    return parseStoredSettings(storage.getItem(key), defaults);
  } catch {
    return copySettings(defaults);
  }
}

export function writeStoredSettings(
  storage: StorageLike | undefined,
  key: string,
  settings: M3eThemeSettings,
): void {
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable in private mode or when quota is exhausted.
  }
}
