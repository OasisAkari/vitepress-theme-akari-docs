import { resolveAkariConfig } from "./config";
import {
  flattenSidebar,
  isExternalLink,
  normalizePath,
  resolveSidebarItems,
} from "./sidebar";

export interface LocaleConfigLike {
  label?: string;
  lang?: string;
  link?: string;
  themeConfig?: unknown;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

/**
 * Layers a locale's theme config over the root one the way VitePress does:
 * plain objects merge key by key, any other value (arrays included) replaces
 * the root value.
 */
export function layerThemeConfig(top: unknown, bottom: unknown): unknown {
  if (top === undefined) return bottom;
  if (!isPlainObject(top) || !isPlainObject(bottom)) return top;

  const result: Record<string, unknown> = { ...bottom };
  for (const [key, value] of Object.entries(top)) {
    result[key] = layerThemeConfig(value, bottom[key]);
  }
  return result;
}

/**
 * The locale a path belongs to. As in VitePress, a locale other than `root`
 * owns every path under `/<key>/`; everything else belongs to `root`.
 */
export function localeKeyForPath(
  path: string,
  keys: readonly string[],
  base = "/",
): string {
  const current = `${normalizePath(path, base).replace(/\/$/, "")}/`;

  return (
    keys.find(
      (key) =>
        key !== "root" &&
        !isExternalLink(key) &&
        current.startsWith(`/${key}/`),
    ) ?? "root"
  );
}

/** Landing page of a locale: its `link`, or the root of its path space. */
export function localeHomePath(
  key: string,
  locale: LocaleConfigLike | undefined,
): string {
  if (locale?.link && !isExternalLink(locale.link)) return locale.link;
  return key === "root" ? "/" : `/${key}/`;
}

/** Moves a path from one locale's path space into another's. */
export function translateLocalePath(
  path: string,
  from: string,
  to: string,
  base = "/",
): string {
  const current = normalizePath(path, base);
  const inner =
    from === "root"
      ? current
      : current.slice(`/${from}`.length) || "/";

  if (to === "root") return inner;
  return inner === "/" ? `/${to}/` : `/${to}${inner}`;
}

/**
 * Page to open when switching to another locale: the same page when that
 * locale lists it in its navigation, otherwise the locale's landing page.
 */
export function resolveLocaleLink(options: {
  path: string;
  from: string;
  to: string;
  home: string;
  pages: readonly string[];
  base?: string;
}): string {
  const { path, from, to, home, pages, base = "/" } = options;
  const target = translateLocalePath(path, from, to, base);
  const key = normalizePath(target);

  if (key === normalizePath(home)) return home;
  return pages.some((page) => normalizePath(page) === key) ? target : home;
}

/** Internal links in the navigation a locale shows for `path`. */
export function localePages(
  themeConfig: unknown,
  path: string,
  base = "/",
): string[] {
  const config = resolveAkariConfig(
    isPlainObject(themeConfig) ? themeConfig : {},
  );

  return flattenSidebar(resolveSidebarItems(config.sidebar, path, base))
    .map((item) => item.link)
    .filter(
      (link): link is string => !!link && !isExternalLink(link),
    );
}
