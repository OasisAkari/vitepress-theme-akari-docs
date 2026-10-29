import { markdownItImageSize } from "markdown-it-image-size";
import type { MarkdownRenderer } from "vitepress";

/** The options of markdown-it-image-size, such as `cache` and `cacheDir`. */
export type AkariImageSizeOptions = NonNullable<
  Parameters<typeof markdownItImageSize>[1]
>;

export interface AkariMarkdownOptions {
  /**
   * Whether to give remote images their width and height, downloading each
   * one when a page renders; or the options to do it with. Defaults to true.
   */
  remoteImageSize?: boolean | AkariImageSizeOptions;
}

/**
 * The theme's Markdown setup; pass it to `markdown.config` in the site
 * config. It frames tables and gives remote images their size.
 */
export function akariMarkdown(
  md: MarkdownRenderer,
  options: AkariMarkdownOptions = {},
): void {
  frameTables(md);
  const { remoteImageSize = true } = options;
  if (remoteImageSize !== false) {
    sizeRemoteImages(md, remoteImageSize === true ? {} : remoteImageSize);
  }
}

/**
 * Wraps every table in a `.akari-table` frame: the frame draws the table's
 * rounded outline and scrolls sideways when the table is wider than the
 * column, so the table itself can keep the full column width.
 */
function frameTables(md: MarkdownRenderer): void {
  const open = md.renderer.rules.table_open;
  const close = md.renderer.rules.table_close;

  md.renderer.rules.table_open = (tokens, index, options, env, self) =>
    `<div class="akari-table">${
      open
        ? open(tokens, index, options, env, self)
        : self.renderToken(tokens, index, options)
    }`;

  md.renderer.rules.table_close = (tokens, index, options, env, self) =>
    `${
      close
        ? close(tokens, index, options, env, self)
        : self.renderToken(tokens, index, options)
    }</div>`;
}

const REMOTE = /^(?:https?:)?\/\//i;

/**
 * VitePress writes the width and height of local images (in the public
 * folder or beside the page) into their tags, so the page keeps their room
 * before they load. markdown-it-image-size does the same for remote images:
 * it downloads each one once and caches its size for a week, keyed by its
 * address, in `node_modules/markdown-it-image-size/.cache` unless `options`
 * say otherwise.
 */
function sizeRemoteImages(
  md: MarkdownRenderer,
  options: AkariImageSizeOptions,
): void {
  const local = md.renderer.rules.image;
  md.use(markdownItImageSize, options);
  const remote = md.renderer.rules.image!;

  md.renderer.rules.image = (tokens, index, options, env, self) => {
    const rule = REMOTE.test(tokens[index]?.attrGet("src") ?? "")
      ? remote
      : local;
    return rule
      ? rule(tokens, index, options, env, self)
      : self.renderToken(tokens, index, options);
  };
}
