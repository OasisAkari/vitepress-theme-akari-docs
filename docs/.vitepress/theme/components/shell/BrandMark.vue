<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";

import { useM3eConfig } from "../../composables/useM3eConfig";

const config = useM3eConfig();

const logo = computed(() => {
  const value = config.value.appBar.logo;
  return value ? withBase(value) : "";
});
</script>

<template>
  <span class="m3e-title">
    <img
      v-if="logo"
      class="m3e-title__logo"
      :src="logo"
      alt=""
      aria-hidden="true"
      decoding="async"
    />
    <span class="m3e-title__text">{{ config.appBar.title }}</span>
    <m3e-chip v-if="config.appBar.version" class="m3e-title__version">
      {{ config.appBar.version }}
    </m3e-chip>
  </span>
</template>

<style scoped>
.m3e-title {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.m3e-title__logo {
  flex: none;
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.m3e-title__text {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m3e-title__version {
  flex: none;
}

@media (max-width: 600px) {
  .m3e-title {
    gap: 6px;
  }

  .m3e-title__logo {
    width: 24px;
    height: 24px;
  }
}
</style>
