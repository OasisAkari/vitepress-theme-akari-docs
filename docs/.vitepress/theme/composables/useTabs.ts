import {
  computed,
  inject,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
  type ShallowRef,
} from "vue";
import { useData, useRoute, useRouter } from "vitepress";

import { isActiveLink } from "../sidebar";
import type { AkariSidebarItem, ResolvedAkariThemeConfig } from "../types";
import { useSidebar } from "./useSidebar";

export interface AkariTabsApi {
  /** The tab group of the current page, if it has one. */
  group: ComputedRef<AkariSidebarItem | undefined>;
  /** The tabs of that group: its entries that link somewhere. */
  tabs: ComputedRef<AkariSidebarItem[]>;
  /**
   * Index of the current tab. It moves to a tab as soon as its page starts
   * loading, so the indicator does not wait for the page.
   */
  current: ComputedRef<number>;
  isCurrent(tab: AkariSidebarItem): boolean;
  /**
   * Click handler for a tab link. The current tab carries `target="_self"`
   * so VitePress' router leaves it alone (it would jump to the top of the
   * page it is already on); a plain click on it then does nothing.
   */
  onTabClick(event: MouseEvent, tab: AkariSidebarItem): void;
  /**
   * Order of two pages in the group: 1 when `to` comes after `from`, -1
   * when before, 0 when either is not one of its tabs.
   */
  direction(from: string, to: string): number;
  /** The bar sits in the app bar instead of the page. */
  docked: Ref<boolean>;
  /** A copy is moving between the two bars; both are hidden meanwhile. */
  flying: Ref<boolean>;
  /**
   * The page's bar is held under the app bar, for want of room for it in
   * the app bar.
   */
  stuck: Ref<boolean>;
  /** The last route change moved between two pages of one group. */
  withinGroup: Ref<boolean>;
  /**
   * The last route change moved within the group while the bar was docked
   * or held under the app bar, and was not a history step with a scroll
   * position to restore: the new page opens at its article, with the bar
   * still where it was.
   */
  carry: Ref<boolean>;
  /**
   * Set by the app bar: there is room for the docked bar beside the title,
   * with the title keeping its minimum width.
   */
  dockable: Ref<boolean>;
  /** Set by the app bar: its docked bar and the free space holding it. */
  dockedBar: ShallowRef<HTMLElement | null>;
  dockArea: ShallowRef<HTMLElement | null>;
}

const tabsKey: InjectionKey<AkariTabsApi> = Symbol("m3e-tabs");

/** The path a page load commits to `route.path`, as VitePress derives it. */
function loadPath(href: string): string {
  return new URL(href, "http://a.com").pathname;
}

/** Whether the history entry being shown restores a scroll position. */
function restoresScroll(): boolean {
  const state: unknown = history.state;
  return (
    typeof state === "object" &&
    state !== null &&
    typeof (state as { scrollPosition?: unknown }).scrollPosition === "number"
  );
}

/** State shared by the page's tab bar and its docked copy in the app bar. */
export function provideAkariTabs(
  config: ComputedRef<ResolvedAkariThemeConfig>,
): AkariTabsApi {
  const { tabGroup } = useSidebar(config);
  const { site } = useData();
  const route = useRoute();
  const router = useRouter();

  const tabs = computed(
    () => tabGroup.value?.tabs?.filter((tab) => !!tab.link) ?? [],
  );
  // The page being loaded, until it is on screen.
  const pending = ref<string | null>(null);

  function indexOf(path: string): number {
    return tabs.value.findIndex((tab) =>
      isActiveLink(path, tab.link!, site.value.base),
    );
  }

  const current = computed(() => {
    const loading = pending.value ? indexOf(pending.value) : -1;
    return loading >= 0 ? loading : indexOf(route.path);
  });

  const api: AkariTabsApi = {
    group: tabGroup,
    tabs,
    current,
    isCurrent: (tab) => tabs.value[current.value]?.link === tab.link,
    onTabClick(event, tab) {
      const plain =
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey;
      if (plain && api.isCurrent(tab)) event.preventDefault();
    },
    direction(from, to) {
      const a = indexOf(from);
      const b = indexOf(to);
      return a < 0 || b < 0 ? 0 : Math.sign(b - a);
    },
    docked: ref(false),
    flying: ref(false),
    stuck: ref(false),
    withinGroup: ref(false),
    carry: ref(false),
    dockable: ref(false),
    dockedBar: shallowRef(null),
    dockArea: shallowRef(null),
  };

  const previousBeforeLoad = router.onBeforePageLoad;
  router.onBeforePageLoad = async (href) => {
    if ((await previousBeforeLoad?.(href)) === false) return false;
    pending.value = loadPath(href);
  };

  // The layout's watchers run before those of the bars and the app bar, so
  // they all see the outcome; `docked` still holds the state before it.
  const groupKey = computed(() => tabs.value.map((tab) => tab.link).join("\n"));
  watch([() => route.path, groupKey], ([path, key], [, previousKey]) => {
    api.withinGroup.value = key !== "" && key === previousKey;
    api.carry.value =
      api.withinGroup.value &&
      (api.docked.value || api.stuck.value) &&
      !restoresScroll();
    if (pending.value && isActiveLink(path, pending.value, site.value.base)) {
      pending.value = null;
    }
  });

  onUnmounted(() => {
    router.onBeforePageLoad = previousBeforeLoad;
  });

  provide(tabsKey, api);
  return api;
}

export function useAkariTabs(): AkariTabsApi {
  const api = inject(tabsKey);

  if (!api) {
    throw new Error(
      "[vitepress-akari-theme-docs] useAkariTabs() must be called inside AkariLayout.",
    );
  }

  return api;
}
