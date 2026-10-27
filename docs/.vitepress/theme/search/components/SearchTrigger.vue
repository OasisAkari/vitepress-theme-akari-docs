<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

import { useM3eConfig } from "../../composables/useM3eConfig";
import { useM3eSearch } from "../useSearch";

const config = useM3eConfig();
const { isOpen, openSearch, setTrigger } = useM3eSearch();
const trigger = ref<HTMLButtonElement | null>(null);

const shortcutLabel = ref("⌘K");

const shortcutKeys = computed(() =>
  config.value.search.shortcut
    ? `Meta+${config.value.search.shortcut.toUpperCase()} Control+${config.value.search.shortcut.toUpperCase()}`
    : undefined,
);

const ariaLabel = computed(() =>
  config.value.search.shortcut
    ? `${config.value.search.placeholder}，快捷键 ${shortcutLabel.value}`
    : config.value.search.placeholder,
);

onMounted(() => {
  setTrigger(trigger.value);

  if (!/(Mac|iPhone|iPad)/.test(navigator.userAgent)) {
    shortcutLabel.value = "Ctrl K";
  }
});

onUnmounted(() => setTrigger(null));
</script>

<template>
  <button
    ref="trigger"
    type="button"
    class="m3e-search-trigger"
    :aria-label="ariaLabel"
    :aria-keyshortcuts="shortcutKeys"
    :aria-expanded="isOpen"
    aria-haspopup="dialog"
    @click="openSearch"
  >
    <m3e-icon name="search"></m3e-icon>
    <span class="m3e-search-trigger__label">
      {{ config.search.placeholder }}
    </span>
    <kbd v-if="config.search.shortcut" class="m3e-search-trigger__kbd">
      {{ shortcutLabel }}
    </kbd>
  </button>
</template>

<style scoped>
.m3e-search-trigger {
  display: inline-flex;
  flex: 0 1 300px;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: clamp(180px, 22vw, 300px);
  height: 40px;
  padding-inline: 12px;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 20px;
  background-color: var(--md-sys-color-surface-container-high);
  color: var(--md-sys-color-on-surface-variant);
  font: inherit;
  font-size: 0.875rem;
  text-align: start;
  cursor: pointer;
  transition:
    background-color 160ms cubic-bezier(0.2, 0, 0, 1),
    border-color 160ms cubic-bezier(0.2, 0, 0, 1),
    color 160ms cubic-bezier(0.2, 0, 0, 1);
}

.m3e-search-trigger:hover {
  border-color: var(--md-sys-color-outline);
  background-color: var(--md-sys-color-surface-container-highest);
  color: var(--md-sys-color-on-surface);
}

.m3e-search-trigger:focus-visible {
  outline: 2px solid var(--md-sys-color-primary);
  outline-offset: 2px;
}

.m3e-search-trigger m3e-icon {
  flex: none;
  --m3e-icon-size: 20px;
}

.m3e-search-trigger__label {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.m3e-search-trigger__kbd {
  flex: none;
  padding: 2px 6px;
  border: 1px solid var(--md-sys-color-outline-variant);
  border-radius: 6px;
  background-color: var(--md-sys-color-surface-container-lowest);
  color: var(--md-sys-color-on-surface-variant);
  font-family: inherit;
  font-size: 0.6875rem;
  line-height: 1.2;
}

@media (max-width: 1199px) {
  .m3e-search-trigger {
    width: clamp(200px, 20vw, 260px);
    flex-basis: 260px;
  }
}

@media (max-width: 960px) {
  .m3e-search-trigger {
    width: clamp(150px, 20vw, 200px);
    flex-basis: 200px;
  }
}

@media (max-width: 767px) {
  .m3e-search-trigger {
    flex: none;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
    justify-content: center;
  }

  .m3e-search-trigger__label,
  .m3e-search-trigger__kbd {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .m3e-search-trigger {
    transition: none;
  }
}
</style>
