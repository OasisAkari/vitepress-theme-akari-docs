import {
  computed,
  inject,
  type App,
  type InjectionKey,
  type Ref,
} from "vue";
import { useData, useRoute, withBase, type SiteData } from "vitepress";

import {
  layerThemeConfig,
  localeHomePath,
  localePages,
  resolveLocaleLink,
  translateLocalePath,
} from "../locales";

const siteDataKey: InjectionKey<Readonly<Ref<SiteData>>> =
  Symbol("akari-site-data");

/**
 * Called from the theme's `enhanceApp`, the only place VitePress hands out
 * the site data before the current locale is layered over it. The language
 * switcher needs it to know what the other locales' navigation contains.
 */
export function provideAkariSiteData(
  app: App,
  siteData: Readonly<Ref<SiteData>>,
): void {
  app.provide(siteDataKey, siteData);
}

export interface AkariLocaleOption {
  key: string;
  label: string;
  lang?: string;
  /** The current page in this locale, or the locale's landing page. */
  href: string;
  current: boolean;
}

export function useAkariLocales() {
  const { site, localeIndex } = useData();
  const route = useRoute();
  const rawSite = inject(siteDataKey, undefined);

  const base = computed(() => site.value.base ?? "/");

  const homeHref = computed(() => {
    const key = localeIndex.value;
    return withBase(localeHomePath(key, site.value.locales?.[key]));
  });

  function themeConfigFor(key: string): unknown {
    return layerThemeConfig(
      site.value.locales?.[key]?.themeConfig,
      rawSite?.value.themeConfig,
    );
  }

  const locales = computed<AkariLocaleOption[]>(() => {
    const entries = Object.entries(site.value.locales ?? {});
    if (entries.length < 2) return [];

    const from = localeIndex.value;

    return entries.map(([key, locale]) => {
      const home = localeHomePath(key, locale);
      const target = translateLocalePath(route.path, from, key, base.value);
      const link =
        key === from
          ? target
          : resolveLocaleLink({
              path: route.path,
              from,
              to: key,
              home,
              pages: localePages(themeConfigFor(key), target),
              base: base.value,
            });

      return {
        key,
        label: locale.label || locale.lang || key,
        lang: locale.lang,
        href: withBase(link),
        current: key === from,
      };
    });
  });

  return { locales, homeHref };
}
