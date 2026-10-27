<script setup lang="ts">
import { useSidebar } from "../../composables/useSidebar";
import SidebarNavItem from "./SidebarNavItem.vue";

const { items } = useSidebar();
</script>

<template>
  <m3e-nav-menu class="m3e-sidebar" aria-label="文档导航">
    <SidebarNavItem
      v-for="(item, index) in items"
      :key="item.link ?? `${item.text}-${index}`"
      :item="item"
    />
  </m3e-nav-menu>
</template>

<style scoped>
.m3e-sidebar {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
  max-width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-block: 4px;
}
</style>
