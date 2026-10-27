<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { Content, onContentUpdated, useData, withBase } from "vitepress";

import DefaultAppBar from "../components/shell/AppBar.vue";
import DefaultSidebar from "../components/sidebar/SidebarNav.vue";
import DefaultSettings from "../components/settings/SettingsDrawer.vue";
import DefaultToc from "../components/content/DocToc.vue";
import DefaultFooter from "../components/content/DocFooter.vue";
import { provideM3eConfig } from "../composables/useM3eConfig";
import { provideM3eSettings } from "../composables/useSettings";
import SearchDialog from "../search/components/SearchDialog.vue";
import { provideM3eSearch } from "../search/useSearch";
import {
  M3E_CONTENT_ID,
  M3E_SETTINGS_ID,
  M3E_SIDEBAR_ID,
} from "../constants";

const config = provideM3eConfig();
const { settings } = provideM3eSettings(config.value);
provideM3eSearch(config.value);
const { page } = useData();
const themeElement = ref<HTMLElement | null>(null);
const isNotFound = computed(() => page.value.isNotFound === true);
const homeHref = withBase("/");

const components = computed(() => ({
  AppBar: config.value.components.AppBar ?? DefaultAppBar,
  Sidebar: config.value.components.Sidebar ?? DefaultSidebar,
  Settings: config.value.components.Settings ?? DefaultSettings,
  Toc: config.value.components.Toc ?? DefaultToc,
  Footer: config.value.components.Footer ?? DefaultFooter,
  Content: config.value.components.Content ?? "div",
}));

function resetContentScroll(): void {
  requestAnimationFrame(() => {
    const pane = document.getElementById(M3E_CONTENT_ID);
    const scroller = pane?.shadowRoot?.querySelector<HTMLElement>(
      ".scroll-container",
    );
    scroller?.scrollTo({ top: 0 });
  });
}

function handleContentUpdated(): void {
  if (typeof window !== "undefined" && window.location.hash) return;
  resetContentScroll();
}

onContentUpdated(handleContentUpdated);

const darkMedia =
  typeof window === "undefined"
    ? undefined
    : window.matchMedia("(prefers-color-scheme: dark)");

function isDarkScheme(): boolean {
  return (
    settings.scheme === "dark" ||
    (settings.scheme === "auto" && !!darkMedia?.matches)
  );
}

const SHELL_COLOR_TOKENS = [
  "--md-sys-color-surface-container-low",
  "--md-sys-color-on-surface",
  "--md-sys-color-outline",
  "--m3e-scrollbar-thumb-color",
] as const;

function copyThemeColorTokens(theme: HTMLElement): void {
  const computed = getComputedStyle(theme);
  const rootStyle = document.documentElement.style;

  for (const token of SHELL_COLOR_TOKENS) {
    const value = computed.getPropertyValue(token).trim();
    if (value) rootStyle.setProperty(token, value);
  }
}

function syncBodyTheme(): void {
  if (typeof document === "undefined") return;

  const dark = isDarkScheme();
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";

  const theme = themeElement.value;
  if (!theme) return;

  // m3e-theme is nested inside #app, so the palette it publishes on its
  // shadow host never reaches html/body on its own. Copy the active color
  // tokens to the document root; html/body then resolve their background and
  // foreground from the same dynamic palette as everything inside the theme.
  copyThemeColorTokens(theme);
}

function syncThemeAttributes(): void {
  const theme = themeElement.value;
  if (!theme) return;

  theme.setAttribute("color", settings.color);
  theme.setAttribute("variant", settings.variant);
  theme.setAttribute("scheme", settings.scheme);
  theme.setAttribute("contrast", settings.contrast);
  theme.setAttribute("motion", settings.motion);
}

watch(
  () => settings.scheme,
  () => syncBodyTheme(),
  { immediate: true },
);
watch(
  () => [
    settings.color,
    settings.variant,
    settings.scheme,
    settings.contrast,
    settings.motion,
  ],
  syncThemeAttributes,
  { flush: "post" },
);
onMounted(() => {
  darkMedia?.addEventListener("change", syncBodyTheme);
  syncThemeAttributes();
  requestAnimationFrame(syncBodyTheme);
});
onUnmounted(() => darkMedia?.removeEventListener("change", syncBodyTheme));
</script>

<template>
  <m3e-theme
    ref="themeElement"
    :color="settings.color"
    :variant="settings.variant"
    :scheme="settings.scheme"
    :contrast="settings.contrast"
    :motion="settings.motion"
    strong-focus
    @change="syncBodyTheme"
  >
    <component :is="components.AppBar" />
    <m3e-drawer-container
      class="m3e-shell"
      :style="{
        '--m3e-drawer-container-width': `min(${config.sidebar.width}px, 90vw)`,
      }"
      start
      start-mode="auto"
      end-mode="auto"
    >
      <div :id="M3E_SIDEBAR_ID" class="m3e-sidebar-slot" slot="start">
        <component :is="components.Sidebar" />
      </div>
      <main class="m3e-main">
        <div class="m3e-panes">
          <m3e-content-pane :id="M3E_CONTENT_ID" class="m3e-content-pane">
            <component :is="components.Content" class="m3e-content">
              <div v-if="isNotFound" class="m3e-not-found">
                <p class="m3e-not-found__code">404</p>
                <h1>页面不存在</h1>
                <p>你访问的页面可能已被移动或删除。</p>
                <a class="m3e-not-found__link" :href="homeHref">
                  返回首页
                </a>
              </div>
              <div v-else class="m3e-prose">
                <Content />
              </div>
            </component>
            <component :is="components.Footer" />
          </m3e-content-pane>
          <component :is="components.Toc" />
        </div>
      </main>
      <div :id="M3E_SETTINGS_ID" class="m3e-settings-slot" slot="end">
        <component :is="components.Settings" />
      </div>
    </m3e-drawer-container>
    <SearchDialog v-if="config.search.enabled" />
  </m3e-theme>
</template>
