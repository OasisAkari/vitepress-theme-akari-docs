<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute, withBase } from "vitepress";

import { useSidebar } from "../../composables/useSidebar";
import { isExternalLink } from "../../sidebar";
import type { M3eSidebarItem } from "../../types";

interface NavMenuItemElement extends HTMLElement {
  open: boolean;
  updateComplete?: Promise<unknown>;
}

const props = defineProps<{ item: M3eSidebarItem }>();

const { isActive, hasActive } = useSidebar();
const route = useRoute();
const groupElement = ref<NavMenuItemElement | null>(null);

const hasChildren = computed(() => (props.item.items?.length ?? 0) > 0);
// Resolve to `undefined` instead of `false`: Vue's hydration path can write
// `open="false"` / `selected="false"` before the custom element upgrades, and
// Lit's Boolean converter treats any present attribute as true.
const open = computed(() =>
  hasActive(props.item)
    ? true
    : props.item.collapsed === false
      ? true
      : undefined,
);
const selected = computed(() =>
  !hasChildren.value && isActive(props.item.link) ? true : undefined,
);

// VitePress 2.x renders internal links as plain anchors and intercepts
// clicks globally (capture phase) to keep SPA navigation.
const internalHref = computed(() => {
  const link = props.item.link;
  return link && !isExternalLink(link) ? withBase(link) : undefined;
});

const externalLink = computed(() => {
  const link = props.item.link;
  return link && isExternalLink(link) ? link : undefined;
});

function whenM3eReady(): Promise<void> {
  if (document.documentElement.hasAttribute("data-m3e-ready")) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.addEventListener("m3e-ready", () => resolve(), { once: true });
  });
}

function nextLayoutFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function applyGroupState(): Promise<void> {
  if (typeof window === "undefined" || !hasChildren.value) return;

  const element = groupElement.value;
  if (!element) return;

  await customElements.whenDefined("m3e-nav-menu-item");
  await customElements.whenDefined("m3e-collapsible");
  await whenM3eReady();
  await nextTick();
  await nextLayoutFrame();

  const shouldOpen = !!open.value;

  if (shouldOpen) {
    if (!element.open) {
      element.open = true;
    } else {
      const collapsible =
        element.shadowRoot?.querySelector("m3e-collapsible");

      // The collapsible can stay at height 0 when `open` was set before its
      // slot children upgraded. Replaying the public property re-measures it.
      if (collapsible && collapsible.getBoundingClientRect().height === 0) {
        element.open = false;
        await element.updateComplete;
        await nextLayoutFrame();
        element.open = true;
      }
    }
  } else if (element.open) {
    element.open = false;
  }
}

onMounted(() => {
  void applyGroupState();
});

watch(open, () => void applyGroupState(), { flush: "post" });
watch(() => route.path, () => void applyGroupState(), { flush: "post" });
</script>

<template>
  <m3e-nav-menu-item v-if="hasChildren" ref="groupElement">
    <m3e-icon v-if="item.icon" slot="icon" :name="item.icon"></m3e-icon>
    <span slot="label" class="m3e-nav-label">{{ item.text }}</span>
    <m3e-badge v-if="item.badge" slot="badge">{{ item.badge }}</m3e-badge>
    <SidebarNavItem
      v-for="(child, index) in item.items"
      :key="child.link ?? `${child.text}-${index}`"
      :item="child"
    />
  </m3e-nav-menu-item>

  <m3e-nav-menu-item v-else :selected="selected">
    <m3e-icon v-if="item.icon" slot="icon" :name="item.icon"></m3e-icon>
    <a
      v-if="internalHref"
      slot="label"
      class="m3e-nav-label"
      :href="internalHref"
      :aria-current="selected ? 'page' : undefined"
    >{{ item.text }}</a>
    <a
      v-else-if="externalLink"
      slot="label"
      class="m3e-nav-label"
      :href="externalLink"
      target="_blank"
      rel="noreferrer"
    >{{ item.text }}</a>
    <span v-else slot="label" class="m3e-nav-label">{{ item.text }}</span>
    <m3e-badge v-if="item.badge" slot="badge">{{ item.badge }}</m3e-badge>
  </m3e-nav-menu-item>
</template>

<style scoped>
.m3e-nav-label {
  display: block;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
