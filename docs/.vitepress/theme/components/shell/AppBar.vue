<script setup lang="ts">
import { computed } from "vue";

import { useM3eConfig } from "../../composables/useM3eConfig";
import { M3E_SETTINGS_ID, M3E_SIDEBAR_ID } from "../../constants";
import SearchTrigger from "../../search/components/SearchTrigger.vue";
import BrandMark from "./BrandMark.vue";
import SocialActions from "./SocialActions.vue";

const config = useM3eConfig();

const showSettings = computed(
  () => config.value.settings.enabled && config.value.appBar.showSettingsToggle,
);

const settingsLabel = computed(() => config.value.settings.title);
</script>

<template>
  <m3e-app-bar class="m3e-app-bar">
    <m3e-icon-button
      v-if="config.appBar.showSidebarToggle"
      slot="leading"
      aria-label="切换导航"
      toggle
    >
      <m3e-icon name="menu"></m3e-icon>
      <m3e-icon slot="selected" name="menu_open"></m3e-icon>
      <m3e-drawer-toggle :for="M3E_SIDEBAR_ID"></m3e-drawer-toggle>
    </m3e-icon-button>

    <span slot="title" class="m3e-app-bar__title">
      <BrandMark />
    </span>

    <span slot="trailing" class="m3e-actions">
      <SearchTrigger v-if="config.search.enabled" />
      <span class="m3e-actions__social">
        <SocialActions :links="config.appBar.socialLinks" />
      </span>
      <m3e-icon-button
        v-if="showSettings"
        id="m3e-settings-button"
        :aria-label="settingsLabel"
        toggle
      >
        <m3e-icon name="settings"></m3e-icon>
        <m3e-drawer-toggle :for="M3E_SETTINGS_ID"></m3e-drawer-toggle>
      </m3e-icon-button>
      <m3e-tooltip v-if="showSettings" for="m3e-settings-button">
        {{ settingsLabel }}
      </m3e-tooltip>
    </span>
  </m3e-app-bar>
</template>

<style scoped>
.m3e-app-bar__title {
  display: flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.m3e-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.m3e-actions__social {
  display: inline-flex;
  align-items: center;
}

@media (max-width: 767px) {
  .m3e-actions__social {
    display: none;
  }

  .m3e-actions {
    gap: 2px;
  }
}

@media (max-width: 600px) {
  .m3e-actions {
    gap: 0;
  }
}
</style>
