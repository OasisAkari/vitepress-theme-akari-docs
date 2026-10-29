<script setup lang="ts">
import SiteFooter from "./SiteFooter.vue";
import WavyDivider from "./WavyDivider.vue";
</script>

<template>
  <!--
    The page footer is its own region below the document surface: a wavy
    divider on the page background, then a surface rounded only at the top
    that runs to the bottom of the page.
  -->
  <div class="akari-doc-footer">
    <WavyDivider class="akari-doc-footer__divider" />
    <SiteFooter />
  </div>
</template>

<style scoped>
.akari-doc-footer {
  display: flex;
  flex: none;
  flex-direction: column;
}

.akari-doc-footer__divider {
  margin-block: 24px;
  margin-inline: 64px;
}
</style>
