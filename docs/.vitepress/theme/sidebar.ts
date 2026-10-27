import type {
  M3eSidebarItem,
  ResolvedSidebarConfig,
} from "./types";

interface NativeSidebarItem {
  text?: string;
  link?: string;
  items?: NativeSidebarItem[];
  collapsed?: boolean;
  base?: string;
  icon?: string;
  badge?: string;
}

type NativeSidebarItems =
  | NativeSidebarItem[]
  | Record<string, NativeSidebarItem[]>;

function stripQueryAndHash(input: string): string {
  return input.split(/[?#]/)[0] ?? "";
}

export function normalizePath(input: string, base = "/"): string {
  let path = stripQueryAndHash(input || "/");
  const normalizedBase =
    base === "/" ? "" : stripQueryAndHash(base).replace(/\/+$/, "");

  if (
    normalizedBase &&
    (path === normalizedBase || path.startsWith(`${normalizedBase}/`))
  ) {
    path = path.slice(normalizedBase.length) || "/";
  }

  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/+$/, "");
  path = path.replace(/\.html$/, "");

  return path || "/";
}

export function isExternalLink(link: string): boolean {
  if (!link) return false;
  return link.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(link);
}

function joinLink(base: string, link: string): string {
  if (
    !link ||
    isExternalLink(link) ||
    link.startsWith("/") ||
    link.startsWith("#")
  ) {
    return link;
  }

  const prefix = base.replace(/\/+$/, "");
  return `${prefix}/${link.replace(/^\/+/, "")}`;
}

function pickItems<T>(
  config: T[] | Record<string, T[]>,
  path: string,
  base: string,
): T[] {
  if (Array.isArray(config)) return config;

  const current = normalizePath(path, base);
  const entries = Object.entries(config)
    .map(([key, items]) => ({ key: normalizePath(key, base), items }))
    .sort((a, b) => b.key.length - a.key.length);

  const match = entries.find(({ key }) =>
    key === "/"
      ? current.startsWith("/")
      : current === key || current.startsWith(`${key}/`),
  );

  return match?.items ?? [];
}

function normalizeNativeItems(
  items: NativeSidebarItem[],
  parentBase = "",
): M3eSidebarItem[] {
  return items.map((item) => {
    const childBase = item.base ? joinLink(parentBase, item.base) : parentBase;
    const children = Array.isArray(item.items)
      ? normalizeNativeItems(item.items, childBase)
      : undefined;

    return {
      text: item.text ?? item.link ?? "",
      link: item.link ? joinLink(parentBase, item.link) : undefined,
      icon: item.icon,
      badge: item.badge,
      collapsed: item.collapsed,
      ...(children ? { items: children } : {}),
    };
  });
}

function isNativeSidebar(value: unknown): value is NativeSidebarItems {
  return Array.isArray(value) || (!!value && typeof value === "object");
}

export function resolveSidebarItems(
  config: ResolvedSidebarConfig,
  path: string,
  base = "/",
): M3eSidebarItem[] {
  if (config.source === "m3e" && config.m3eItems) {
    return pickItems<M3eSidebarItem>(config.m3eItems, path, base);
  }

  if (!isNativeSidebar(config.nativeItems)) return [];

  return normalizeNativeItems(
    pickItems<NativeSidebarItem>(config.nativeItems, path, base),
  );
}

export function isActiveLink(
  currentPath: string,
  target: string,
  base = "/",
): boolean {
  if (!target || isExternalLink(target) || target.startsWith("#")) return false;
  return normalizePath(currentPath, base) === normalizePath(target, base);
}

export function hasActiveItem(
  item: M3eSidebarItem,
  currentPath: string,
  base = "/",
): boolean {
  if (item.link && isActiveLink(currentPath, item.link, base)) return true;
  return (
    item.items?.some((child) =>
      hasActiveItem(child, currentPath, base),
    ) ?? false
  );
}

export function flattenSidebar(items: M3eSidebarItem[]): M3eSidebarItem[] {
  const result: M3eSidebarItem[] = [];

  for (const item of items) {
    if (item.link) result.push(item);
    if (item.items) result.push(...flattenSidebar(item.items));
  }

  return result;
}

export function findPrevNext(
  items: M3eSidebarItem[],
  currentPath: string,
  base = "/",
): { prev?: M3eSidebarItem; next?: M3eSidebarItem } {
  const flat = flattenSidebar(items);
  const index = flat.findIndex(
    (item) => item.link && isActiveLink(currentPath, item.link, base),
  );

  if (index < 0) return {};

  return {
    prev: index > 0 ? flat[index - 1] : undefined,
    next: index < flat.length - 1 ? flat[index + 1] : undefined,
  };
}
