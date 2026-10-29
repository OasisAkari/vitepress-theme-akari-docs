<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from "vue";

import { useAkariConfig } from "../../composables/useAkariConfig";
import { useAkariSettingsDialog } from "../../composables/useSettingsDialog";
import { AKARI_SETTINGS_ID } from "../../constants";
import SocialIcon from "./SocialIcon.vue";

const config = useAkariConfig();
const settingsDialog = useAkariSettingsDialog();

const showSettings = computed(
  () => config.value.settings.enabled && config.value.appBar.showSettingsToggle,
);
const hasItems = computed(
  () => showSettings.value || config.value.appBar.socialLinks.length > 0,
);

// The settings dialog grows out of the menu's button, as it would out of
// the settings button it stands in for.
function openSettings(): void {
  const button = document.getElementById("akari-more-button");
  if (button) settingsDialog.open(button);
}

/*
 * m3e moves focus through the items itself, without preventScroll. Under
 * the root's scroll-padding (there for anchors, clear of the app bar) an
 * item at the top of the window counts as hidden, and the browser then
 * scrolls the page to centre it, which closes the menu again: the menu
 * would only flash open on a scrolled page. The items here focus in place.
 */
const menu = ref<HTMLElement | null>(null);

function focusInPlace(): void {
  for (const item of menu.value?.querySelectorAll<HTMLElement>("m3e-menu-item") ?? []) {
    item.focus = (options) =>
      HTMLElement.prototype.focus.call(item, { ...options, preventScroll: true });
  }
}

onMounted(focusInPlace);
onUpdated(focusInPlace);
</script>

<template>
  <!--
    The app bar's overflow menu, opened by its "more" button (through
    m3e-menu-trigger, by id). It lives at the top of the layout rather than
    in the app bar: m3e positions a menu against its offset parent, and the
    sticky app bar as one would put it off by however far the page has
    scrolled (the menu itself shows in the top layer, against the page).
  -->
  <m3e-menu
    v-if="hasItems"
    id="akari-more-menu"
    ref="menu"
    position-x="before"
  >
    <m3e-menu-item
      v-for="(link, index) in config.appBar.socialLinks"
      :key="`${link.icon}-${index}`"
      :href="link.link"
      target="_blank"
      rel="noreferrer"
    >
      <span slot="icon" class="akari-app-bar-menu__icon">
        <SocialIcon :icon="link.icon" />
      </span>
      {{ link.label || link.icon }}
    </m3e-menu-item>
    <m3e-menu-item
      v-if="showSettings"
      aria-haspopup="dialog"
      :aria-controls="AKARI_SETTINGS_ID"
      @click="openSettings"
    >
      <m3e-icon slot="icon" name="settings"></m3e-icon>
      {{ config.settings.title }}
    </m3e-menu-item>
  </m3e-menu>
</template>

<style scoped>
/* Brand marks and icons alike, at the menu's icon size. */
.akari-app-bar-menu__icon {
  display: inline-flex;
  width: 24px;
  height: 24px;
}

.akari-app-bar-menu__icon > :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
