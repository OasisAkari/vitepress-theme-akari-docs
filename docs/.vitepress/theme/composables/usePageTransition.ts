import { onUnmounted, type Ref } from "vue";
import { onContentUpdated, useRoute, useRouter } from "vitepress";

/**
 * Settles once the element's fade (its opacity transition, or its
 * children's when only they fade) ends. A lift still running from an
 * interrupted fade-in is not waited for: it happens at zero opacity, where
 * it cannot be seen.
 */
function fadeSettled(element: HTMLElement): Promise<void> {
  const fades = [element, ...element.children]
    .flatMap((node) => node.getAnimations())
    .filter(
      (animation) =>
        animation instanceof CSSTransition &&
        animation.transitionProperty === "opacity",
    );

  return Promise.allSettled(fades.map((animation) => animation.finished)).then(
    () => undefined,
  );
}

/** The path a page load commits to `route.path`, as VitePress derives it. */
function loadPath(href: string): string {
  return new URL(href, "http://a.com").pathname;
}

/**
 * Fades the outgoing page out and the incoming page in with a slight lift.
 *
 * The fade-out starts as soon as a page load begins and runs while the next
 * page is fetched; the content swap waits for it, and the fade-in starts
 * once the new content has rendered. The motion itself lives in CSS
 * (`.is-leaving` / `.is-entering` on the element), so it follows the m3e
 * motion tokens and reduced-motion preferences. Same-page anchor jumps do
 * not load a page and are not animated.
 *
 * Only the page the reader asked for last brings the surface back. Clicking
 * again while a page loads would otherwise let an intermediate page flash
 * in: VitePress still commits a page whose load was already past its last
 * check, and the page being left can re-render while it fades out.
 *
 * `axis` orders sibling pages, such as the tabs of one group: 1 when the
 * next page comes after the current one, -1 when before, 0 otherwise.
 * Between siblings the surface stays and only its content moves, sideways
 * along that order (`data-axis` on the element).
 */
export function usePageTransition(
  element: Ref<HTMLElement | null>,
  axis?: (from: string, to: string) => number,
): void {
  const router = useRouter();
  const route = useRoute();
  const previousBeforeLoad = router.onBeforePageLoad;
  const previousAfterLoad = router.onAfterPageLoad;

  let generation = 0;
  let leaving: Promise<void> = Promise.resolve();
  // Path of the latest page load until it is on screen.
  let target: string | null = null;

  function leave(): Promise<void> {
    const surface = element.value;
    if (!surface) return Promise.resolve();

    surface.classList.remove("is-entering");
    surface.classList.add("is-leaving");
    return fadeSettled(surface);
  }

  function enter(): void {
    const surface = element.value;
    if (!surface?.classList.contains("is-leaving")) return;
    if (target !== null && route.path !== target) return;

    target = null;
    const current = generation;
    surface.classList.replace("is-leaving", "is-entering");
    // Commit the lowered, transparent start state before releasing it.
    void surface.getBoundingClientRect();
    requestAnimationFrame(() => {
      if (current === generation) surface.classList.remove("is-entering");
    });
  }

  router.onBeforePageLoad = async (href) => {
    if ((await previousBeforeLoad?.(href)) === false) return false;

    generation += 1;
    target = loadPath(href);
    const direction = axis?.(route.path, target) ?? 0;
    if (direction) {
      element.value?.setAttribute(
        "data-axis",
        direction > 0 ? "forward" : "backward",
      );
    } else {
      element.value?.removeAttribute("data-axis");
    }
    leaving = leave();
  };

  router.onAfterPageLoad = async (href) => {
    await previousAfterLoad?.(href);
    await leaving;

    // The route commits right after this hook and the new content reports
    // itself through onContentUpdated. Reloading the page already on screen
    // renders nothing new, so the next frame reveals it as well.
    if (loadPath(href) === target) requestAnimationFrame(enter);
  };

  onContentUpdated(enter);

  onUnmounted(() => {
    router.onBeforePageLoad = previousBeforeLoad;
    router.onAfterPageLoad = previousAfterLoad;
  });
}
