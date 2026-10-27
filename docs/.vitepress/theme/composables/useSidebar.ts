import { computed } from "vue";
import { useData, useRoute } from "vitepress";

import {
  findPrevNext,
  hasActiveItem,
  isActiveLink,
  resolveSidebarItems,
} from "../sidebar";
import type { M3eSidebarItem } from "../types";
import { useM3eConfig } from "./useM3eConfig";

export function useSidebar() {
  const config = useM3eConfig();
  const { site } = useData();
  const route = useRoute();

  const base = computed(() => site.value.base ?? "/");
  const items = computed(() =>
    resolveSidebarItems(config.value.sidebar, route.path, base.value),
  );
  const prevNext = computed(() =>
    findPrevNext(items.value, route.path, base.value),
  );

  function isActive(link?: string): boolean {
    return !!link && isActiveLink(route.path, link, base.value);
  }

  function hasActive(item: M3eSidebarItem): boolean {
    return hasActiveItem(item, route.path, base.value);
  }

  return { items, prevNext, isActive, hasActive };
}
