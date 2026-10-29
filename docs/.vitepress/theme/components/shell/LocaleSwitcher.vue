<script setup lang="ts">
import { computed, ref } from "vue";

import { useAkariI18n } from "../../composables/useI18n";
import { useAkariLocaleDialog } from "../../composables/useLocaleDialog";
import { useAkariLocales } from "../../composables/useLocales";

withDefaults(
  defineProps<{
    idPrefix?: string;
    tooltipPosition?: "above" | "below" | "before" | "after";
  }>(),
  { idPrefix: "akari-locale", tooltipPosition: "after" },
);

const { t } = useAkariI18n();
const { locales } = useAkariLocales();
const localeDialog = useAkariLocaleDialog();
const button = ref<HTMLElement | null>(null);

const expanded = computed(
  () =>
    localeDialog.isOpen.value &&
    !!button.value &&
    localeDialog.trigger.value === button.value,
);

function openDialog(): void {
  if (button.value) localeDialog.open(button.value);
}
</script>

<template>
  <!--
    A round outlined icon button. It opens the language dialog, which grows
    out of it with a container transform and returns into it on close.
  -->
  <div v-if="locales.length > 1" class="akari-locale-switcher">
    <m3e-icon-button
      :id="`${idPrefix}-button`"
      ref="button"
      class="akari-locale-switcher__button"
      variant="outlined"
      :aria-label="t('languageLabel')"
      aria-haspopup="dialog"
      :aria-expanded="String(expanded)"
      @click="openDialog"
    >
      <m3e-icon name="translate"></m3e-icon>
    </m3e-icon-button>
    <m3e-tooltip :for="`${idPrefix}-button`" :position="tooltipPosition">
      {{ t("languageLabel") }}
    </m3e-tooltip>
  </div>
</template>

<style scoped>
.akari-locale-switcher {
  display: flex;
  flex: none;
}
</style>
