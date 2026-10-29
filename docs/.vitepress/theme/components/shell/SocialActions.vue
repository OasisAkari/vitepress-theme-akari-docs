<script setup lang="ts">
import type { AkariSocialLink } from "../../types";
import SocialIcon from "./SocialIcon.vue";

withDefaults(
  defineProps<{
    links: AkariSocialLink[];
    // Keeps button/tooltip ids unique when the actions render twice.
    idPrefix?: string;
  }>(),
  { idPrefix: "akari-social" },
);
</script>

<template>
  <span v-if="links.length" class="akari-social">
    <template v-for="(link, index) in links" :key="`${link.icon}-${index}`">
      <m3e-icon-button
        :id="`${idPrefix}-${index}`"
        :href="link.link"
        target="_blank"
        rel="noreferrer"
        :aria-label="link.label || link.icon"
      >
        <SocialIcon :icon="link.icon" />
      </m3e-icon-button>
      <m3e-tooltip :for="`${idPrefix}-${index}`">
        {{ link.label || link.icon }}
      </m3e-tooltip>
    </template>
  </span>
</template>

<style scoped>
.akari-social {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 600px) {
  .akari-social {
    gap: 0;
  }
}
</style>
