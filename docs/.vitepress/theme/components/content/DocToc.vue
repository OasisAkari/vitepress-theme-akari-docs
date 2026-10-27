<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";

import { useM3eConfig } from "../../composables/useM3eConfig";
import { M3E_CONTENT_ID } from "../../constants";

const { page, frontmatter } = useData();
const config = useM3eConfig();

const visible = computed(
  () =>
    config.value.toc.enabled &&
    frontmatter.value.toc !== false &&
    page.value.headers.length > 0,
);
</script>

<template>
  <m3e-toc
    v-if="visible"
    class="m3e-toc"
    :for="M3E_CONTENT_ID"
    :max-depth="config.toc.maxDepth"
  >
    <span slot="overline">{{ config.toc.overline }}</span>
    <span slot="title">{{ page.title }}</span>
  </m3e-toc>
</template>
