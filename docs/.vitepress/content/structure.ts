import type { AkariSidebarCategory, AkariSidebarItem } from "../theme/types";

/** A language folder of the docs, one with its own `config.ts`. */
export interface ContentLanguage {
  /** The folder, e.g. `zh`. */
  folder: string;
  /** Its VitePress locale: `root` for the root language, else the folder. */
  key: string;
  /** What its served paths start with: nothing, or the folder and a slash. */
  prefix: string;
}

/** A markdown page as the navigation sees it. */
export interface ContentPage {
  /** Its path in the docs, e.g. `zh-CN/theme/layout/index.md`. */
  source: string;
  frontmatter: Record<string, unknown>;
  /** The text of its first `#` heading. */
  heading?: string;
}

export interface ContentLogger {
  warn(message: string): void;
}

/**
 * The language folders, the root one first: `root` names it, or else it
 * is the first in alphabetical order. The others follow alphabetically.
 */
export function contentLanguages(
  folders: readonly string[],
  root?: string,
): ContentLanguage[] {
  const sorted = [...folders].sort();
  const first = root && sorted.includes(root) ? root : sorted[0];
  if (first === undefined) return [];

  return [first, ...sorted.filter((folder) => folder !== first)].map(
    (folder) =>
      folder === first
        ? { folder, key: "root", prefix: "" }
        : { folder, key: folder, prefix: `${folder}/` },
  );
}

/**
 * Where VitePress serves a page of the docs (its rewrite): out of its
 * language folder, the root language's at the site root, and an article's
 * `index.md` under the article folder's name, so `zh-CN/theme/layout/index.md`
 * is served as `theme/layout.md`, at /theme/layout. Pages outside the
 * language folders stay where they are.
 */
export function rewritePage(
  page: string,
  languages: readonly ContentLanguage[],
): string {
  const slash = page.indexOf("/");
  const language =
    slash > 0
      ? languages.find((entry) => entry.folder === page.slice(0, slash))
      : undefined;
  if (!language) return page;

  const inner = page.slice(slash + 1);
  const article = /^([^/]+\/[^/]+)\/index\.md$/.exec(inner);
  return language.prefix + (article ? `${article[1]}.md` : inner);
}

/** The route of a served page: `theme/layout.md` → `/theme/layout`. */
export function pageRoute(page: string): string {
  return `/${page.replace(/\.md$/, "").replace(/(^|\/)index$/, "$1")}`;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

interface Article {
  /** The article's folder, or nothing for the language's home page. */
  folder: string;
  /** Its page's path in the language folder. */
  inner: string;
  page: ContentPage;
}

/**
 * The navigation of a language from its folders. Each folder in the
 * language folder is a rail category, each folder in a category an
 * article, and the article's `index.md` its page. The page's frontmatter
 * names it in the navigation (`title`, else its first heading), gives it
 * an `icon`, a `badge` and an `order`, and may list `parallel` pages: other
 * files in its folder, switched with a tab bar and not in the sidebar,
 * each labelled by its `tab` (else its title). The language's home page
 * joins the category its `category` names, if any.
 *
 * Categories go in the order of `categories`, the others after them in
 * alphabetical order; `categories` also names them and gives their icons.
 */
export function buildSidebar(
  language: ContentLanguage,
  pages: readonly ContentPage[],
  categories: Readonly<Record<string, AkariSidebarCategory>> = {},
  logger?: ContentLogger,
): AkariSidebarItem[] {
  const own = new Map<string, ContentPage>();
  for (const page of pages) {
    if (page.source.startsWith(`${language.folder}/`)) {
      own.set(page.source.slice(language.folder.length + 1), page);
    }
  }

  const route = (inner: string) =>
    pageRoute(rewritePage(`${language.folder}/${inner}`, [language]));
  const titleOf = (page: ContentPage, fallback: string) =>
    text(page.frontmatter.title) ?? page.heading ?? fallback;
  const tabOf = (page: ContentPage, fallback: string) =>
    text(page.frontmatter.tab) ?? titleOf(page, fallback);

  const grouped = new Map<string, Article[]>();
  const add = (category: string, article: Article) => {
    const list = grouped.get(category) ?? [];
    list.push(article);
    grouped.set(category, list);
  };

  for (const [inner, page] of own) {
    const parts = inner.split("/");
    if (parts.length === 3 && parts[2] === "index.md") {
      add(parts[0]!, { folder: parts[1]!, inner, page });
    } else if (inner === "index.md") {
      const category = text(page.frontmatter.category);
      if (category) add(category, { folder: "", inner, page });
    }
  }

  const linked = new Set<string>(["index.md"]);

  function parallelOf(article: Article): AkariSidebarItem[] {
    const { frontmatter, source } = article.page;
    const listed = frontmatter.parallel;
    if (listed === undefined) return [];
    const folder = article.inner.slice(0, -"index.md".length);
    const tabs: AkariSidebarItem[] = [];

    for (const value of Array.isArray(listed) ? listed : [listed]) {
      const name =
        typeof value === "string"
          ? value.trim().replace(/^\.\//, "").replace(/\.md$/, "")
          : "";
      const inner = `${folder}${name}.md`;
      const page = own.get(inner);
      if (!name || name.includes("/") || name === "index" || !page) {
        logger?.warn(
          `${source}: parallel page "${String(value)}" is not a markdown file in the article's folder.`,
        );
        continue;
      }
      if (linked.has(inner)) continue;
      linked.add(inner);
      tabs.push({ text: tabOf(page, name), link: route(inner) });
    }

    return tabs;
  }

  function itemOf(article: Article): AkariSidebarItem {
    const { page, inner } = article;
    const name = article.folder || language.folder;
    const item: AkariSidebarItem = { text: titleOf(page, name) };
    const icon = text(page.frontmatter.icon);
    const badge = text(page.frontmatter.badge);
    if (icon) item.icon = icon;
    if (badge) item.badge = badge;

    linked.add(inner);
    const parallel = parallelOf(article);
    if (parallel.length) {
      item.tabs = [{ text: tabOf(page, name), link: route(inner) }, ...parallel];
    } else {
      item.link = route(inner);
    }
    return item;
  }

  const rank = (article: Article) => {
    const order = article.page.frontmatter.order;
    if (typeof order === "number" && Number.isFinite(order)) return order;
    return article.folder ? Infinity : -Infinity;
  };

  const keys = [
    ...Object.keys(categories).filter((key) => grouped.has(key)),
    ...[...grouped.keys()].filter((key) => !(key in categories)).sort(),
  ];

  const sidebar = keys.map((key): AkariSidebarItem => {
    const config = categories[key] ?? {};
    const articles = grouped
      .get(key)!
      .sort(
        (a, b) => rank(a) - rank(b) || a.folder.localeCompare(b.folder),
      );
    return {
      text: text(config.text) ?? key,
      ...(config.icon ? { icon: config.icon } : {}),
      ...(config.collapsed !== undefined ? { collapsed: config.collapsed } : {}),
      items: articles.map(itemOf),
    };
  });

  for (const inner of own.keys()) {
    if (!linked.has(inner)) {
      logger?.warn(
        `${language.folder}/${inner} is not in the navigation: an article is <category>/<article>/index.md, and a parallel page is listed in its article's "parallel".`,
      );
    }
  }

  return sidebar;
}

/**
 * The categories of a language: the shared ones with the language's laid
 * over them, field by field, in the shared order.
 */
export function mergeCategories(
  shared: Readonly<Record<string, AkariSidebarCategory>> = {},
  own: Readonly<Record<string, AkariSidebarCategory>> = {},
): Record<string, AkariSidebarCategory> {
  const merged: Record<string, AkariSidebarCategory> = {};
  for (const key of new Set([...Object.keys(shared), ...Object.keys(own)])) {
    merged[key] = { ...shared[key], ...own[key] };
  }
  return merged;
}
