import { inBrowser, type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";

import { provideAkariSiteData } from "./composables/useLocales";
import SearchDock from "./search/components/SearchDock.vue";
import Layout from "./layouts/AkariLayout.vue";
import { routeComponentLinks } from "./links";
import "./styles/index.css";

if (!import.meta.env.SSR) {
  void import("./m3e").then(() => {
    document.documentElement.dataset.akariReady = "";
    window.dispatchEvent(new Event("akari-ready"));
  });
}

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    provideAkariSiteData(app, siteData);
    app.component("SearchDock", SearchDock);
    app.component("AkariSearchDock", SearchDock);
    if (inBrowser) routeComponentLinks(router);
  },
} satisfies Theme;

export * from "./types";
export { defineAkariConfig, defineAkariThemeConfig } from "./config";
export { defineAkariLanguage } from "./define";
export { AKARI_LANGUAGES, resolveLanguage } from "./i18n";
export {
  AKARI_CONTENT_ID,
  AKARI_SETTINGS_ID,
  AKARI_SIDEBAR_ID,
} from "./constants";
export {
  provideAkariComponents,
  useAkariConfig,
} from "./composables/useAkariConfig";
export { useAkariColorScheme } from "./composables/useColorScheme";
export { useAkariI18n } from "./composables/useI18n";
export { useAkariLocales } from "./composables/useLocales";
export type { AkariLocaleOption } from "./composables/useLocales";
export { useAkariSettings } from "./composables/useSettings";
export { useSidebar } from "./composables/useSidebar";
export { registerSearchBackend } from "./search/registry";
export { useAkariSearch } from "./search/useSearch";
export type { AkariSearchTriggerRole } from "./search/useSearch";
export { useAkariSearchDock } from "./search/useSearchDock";
export type { AkariSearchDockApi } from "./search/useSearchDock";
export type {
  AkariSearchBackend,
  AkariSearchHandler,
} from "./search/types";
