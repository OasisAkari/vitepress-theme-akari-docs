import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import "@fontsource-variable/roboto";

import Layout from "./layouts/M3eLayout.vue";
import "./styles/index.css";

if (!import.meta.env.SSR) {
  void import("./m3e").then(() => {
    document.documentElement.dataset.m3eReady = "";
    window.dispatchEvent(new Event("m3e-ready"));
  });
}

export default {
  extends: DefaultTheme,
  Layout,
} satisfies Theme;

export * from "./types";
export { defineM3eThemeConfig } from "./config";
export {
  M3E_CONTENT_ID,
  M3E_SETTINGS_ID,
  M3E_SIDEBAR_ID,
} from "./constants";
export { useM3eConfig } from "./composables/useM3eConfig";
export { useM3eSettings } from "./composables/useSettings";
export { useSidebar } from "./composables/useSidebar";
export { registerSearchBackend } from "./search/registry";
export { useM3eSearch } from "./search/useSearch";
export type {
  M3eSearchBackend,
  M3eSearchHandler,
} from "./search/types";
