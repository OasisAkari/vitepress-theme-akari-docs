import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vitepress";

import { PAGE_SHARE, resourceProgress, trickle } from "../loading";

/** A load quicker than this shows nothing. */
const SHOW_DELAY = 150;
const TRICKLE_INTERVAL = 250;
/** How long the full bar holds before it fades. */
const COMPLETE_HOLD = 200;
/** How long the fade takes (the bar's opacity transition). */
const FADE = 200;
/** A load that never settles stops showing after this. */
const GIVE_UP = 15000;
/** A resource that takes longer than this no longer holds the bar. */
const RESOURCE_WAIT = 8000;

/** The path a page load commits to `route.path`, as VitePress derives it. */
function loadPath(href: string): string {
  return new URL(href, "http://a.com").pathname;
}

function nearViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight;
}

/** A resource's load, or RESOURCE_WAIT, whichever comes first. */
function withinWait(load: Promise<unknown>): Promise<unknown> {
  return Promise.race([
    load,
    new Promise((resolve) => setTimeout(resolve, RESOURCE_WAIT)),
  ]);
}

/**
 * What the page still loads: its images and its fonts. Images not drawn
 * (`display: none`, as the unused one of a hero's light and dark images)
 * and lazy ones away from the viewport are left out: a lazy image loads
 * only once it is drawn near the viewport, so they might never finish.
 */
function pendingResources(): Promise<unknown>[] {
  const pending: Promise<unknown>[] = [];
  for (const image of document.images) {
    if (image.complete || !image.getClientRects().length) continue;
    if (image.loading === "lazy" && !nearViewport(image)) continue;
    pending.push(
      withinWait(
        new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        }),
      ),
    );
  }
  if (document.fonts?.status === "loading") {
    pending.push(withinWait(document.fonts.ready));
  }
  return pending;
}

export interface AkariLoadingBar {
  /** From 0 to 1. */
  progress: Readonly<Ref<number>>;
  visible: Readonly<Ref<boolean>>;
  /**
   * Until the page's scripts run: the server-rendered bar creeps on its
   * own (CSS), and shows only if they take longer than SHOW_DELAY.
   */
  booting: Readonly<Ref<boolean>>;
}

/** The horizontal scale an element is drawn at. */
function scaleOf(element: Element | null | undefined): number {
  if (!element) return 0;
  const transform = getComputedStyle(element).transform;
  return transform && transform !== "none" ? new DOMMatrix(transform).a : 1;
}

/**
 * Tracks the loading of pages for the bar at the top of the window (`bar`):
 * the first page's scripts and resources, and on each navigation the next
 * page's script, then its images and fonts. The script's size is unknown, so the bar
 * creeps towards its share meanwhile; the resources then fill the rest one
 * by one. A load that is over within SHOW_DELAY never shows the bar.
 */
export function useLoadingBar(
  bar: Readonly<Ref<HTMLElement | null>>,
): AkariLoadingBar {
  const router = useRouter();
  const route = useRoute();
  const progress = ref(0);
  const visible = ref(false);
  const booting = ref(true);
  const previousBeforeLoad = router.onBeforePageLoad;
  const previousAfterLoad = router.onAfterPageLoad;

  let active = false;
  // Each load gets a number, so a settling one doesn't end a newer one.
  let generation = 0;
  let showTimer: ReturnType<typeof setTimeout> | undefined;
  let trickleTimer: ReturnType<typeof setInterval> | undefined;
  let giveUpTimer: ReturnType<typeof setTimeout> | undefined;
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  function stopTimers(): void {
    clearTimeout(showTimer);
    clearInterval(trickleTimer);
    clearTimeout(giveUpTimer);
    clearTimeout(hideTimer);
  }

  function start(from: number): void {
    generation += 1;
    stopTimers();
    if (!active || !visible.value) {
      progress.value = from;
      showTimer = setTimeout(() => (visible.value = true), SHOW_DELAY);
    }
    active = true;
    trickleTimer = setInterval(() => {
      progress.value = trickle(progress.value);
    }, TRICKLE_INTERVAL);
    giveUpTimer = setTimeout(finish, GIVE_UP);
  }

  function finish(): void {
    if (!active) return;
    active = false;
    stopTimers();
    if (!visible.value) {
      progress.value = 0;
      return;
    }
    progress.value = 1;
    hideTimer = setTimeout(() => {
      visible.value = false;
      hideTimer = setTimeout(() => {
        if (!active) progress.value = 0;
      }, FADE);
    }, COMPLETE_HOLD);
  }

  /** The page is in the document: waits for what it still loads. */
  async function settle(): Promise<void> {
    if (!active) return;
    const current = generation;
    clearInterval(trickleTimer);
    const from = Math.max(progress.value, PAGE_SHARE);
    progress.value = from;

    const pending = pendingResources();
    let done = 0;
    await Promise.all(
      pending.map((resource) =>
        resource.then(() => {
          done += 1;
          if (current === generation) {
            progress.value = Math.max(
              progress.value,
              resourceProgress(done, pending.length, from),
            );
          }
        }),
      ),
    );
    if (current === generation) finish();
  }

  router.onBeforePageLoad = async (href) => {
    if ((await previousBeforeLoad?.(href)) === false) return false;
    // Loading the page on screen again shows nothing new.
    if (loadPath(href) !== route.path) start(0.05);
  };

  // The page on screen loaded again, as when a navigation away is overtaken
  // by one back: VitePress commits the same page data, which the watcher
  // below never sees change, so the load ends here.
  router.onAfterPageLoad = async (href) => {
    await previousAfterLoad?.(href);
    if (loadPath(href) === route.path) requestAnimationFrame(() => void settle());
  };

  // The next page's data replaces the old one's, also on a reload of the
  // same page; after the render, its images are in the document.
  watch(
    () => route.data,
    () => requestAnimationFrame(() => void settle()),
    { flush: "post" },
  );

  onMounted(() => {
    // The bar crept on its own while the scripts loaded; if it showed, it
    // carries on from where it got to.
    const shown = !!bar.value && Number(getComputedStyle(bar.value).opacity) > 0;
    const crept = scaleOf(bar.value?.firstElementChild);
    booting.value = false;

    if (shown) {
      start(crept);
      visible.value = true;
      clearTimeout(showTimer);
    } else if (
      document.readyState === "complete" &&
      !pendingResources().length
    ) {
      return;
    } else {
      // The first page is on screen already; what it loads is the rest.
      start(PAGE_SHARE / 2);
    }
    if (document.readyState === "complete") {
      void settle();
    } else {
      window.addEventListener("load", () => void settle(), { once: true });
    }
  });

  onUnmounted(() => {
    router.onBeforePageLoad = previousBeforeLoad;
    router.onAfterPageLoad = previousAfterLoad;
    stopTimers();
  });

  return { progress, visible, booting };
}
