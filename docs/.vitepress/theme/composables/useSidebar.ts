import { computed, type ComputedRef } from "vue";
import { useData, useRoute } from "vitepress";

import {
  findPrevNext,
  findTabGroup,
  hasActiveItem,
  isActiveLink,
  resolveSidebarItems,
} from "../sidebar";
import type { AkariSidebarItem, ResolvedAkariThemeConfig } from "../types";
import { useAkariConfig } from "./useAkariConfig";

/**
 * The navigation tree of the current page. Inside the layout the config is
 * injected; the layout itself, which provides it, passes it in.
 */
export function useSidebar(
  config: ComputedRef<ResolvedAkariThemeConfig> = useAkariConfig(),
) {
  const { site } = useData();
  const route = useRoute();

  const base = computed(() => site.value.base ?? "/");
  const items = computed(() =>
    resolveSidebarItems(config.value.sidebar, route.path, base.value),
  );
  const prevNext = computed(() =>
    findPrevNext(items.value, route.path, base.value),
  );
  // Parallel pages the current page is one of, shown as a tab bar.
  const tabGroup = computed(() =>
    findTabGroup(items.value, route.path, base.value),
  );

  function isActive(link?: string): boolean {
    return !!link && isActiveLink(route.path, link, base.value);
  }

  function hasActive(item: AkariSidebarItem): boolean {
    return hasActiveItem(item, route.path, base.value);
  }

  return { items, prevNext, tabGroup, isActive, hasActive };
}
