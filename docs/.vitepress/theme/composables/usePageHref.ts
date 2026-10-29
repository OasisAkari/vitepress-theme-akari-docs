import { useData, withBase } from "vitepress";

import { isExternalLink, pageLink } from "../sidebar";

/**
 * The href of a link in the theme's navigation: a page's under the site's
 * base and, with clean URLs off, ending in `.html`; an external one as it
 * is.
 */
export function usePageHref(): (link: string) => string {
  const { site } = useData();
  return (link) =>
    isExternalLink(link) ? link : withBase(pageLink(link, site.value.cleanUrls));
}
