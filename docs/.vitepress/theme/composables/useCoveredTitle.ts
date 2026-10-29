import { onMounted, onUnmounted, ref, watch, type Ref } from "vue";
import { onContentUpdated, useRoute } from "vitepress";

import { AKARI_CONTENT_ID } from "../constants";

/**
 * Tracks the page title against the app bar: `covered` turns true once the
 * heading has scrolled entirely under the bar, so the bar can show `title`
 * in its place. The title is the element marked `data-akari-page-title` (the
 * hero's h1) or else the article's h1.
 *
 * A new page starts uncovered, except while `keep` returns true: the page
 * opens scrolled past its title, and the bar keeps showing a page title
 * until the heading reports in. While a page's tab bar is held under the
 * app bar (`akari-tabs-pinned` on the root), a title gone behind it counts
 * as covered too.
 */
export function useCoveredTitle(
  options: { keep?: () => boolean } = {},
): {
  covered: Ref<boolean>;
  title: Ref<string>;
} {
  const covered = ref(false);
  const title = ref("");
  const route = useRoute();

  let observer: IntersectionObserver | undefined;
  let classes: MutationObserver | undefined;
  let pinned = false;

  function observe(reset = true): void {
    observer?.disconnect();
    if (reset && !options.keep?.()) covered.value = false;

    const heading =
      document.querySelector<HTMLElement>("[data-akari-page-title]") ??
      document.getElementById(AKARI_CONTENT_ID)?.querySelector<HTMLElement>("h1");
    title.value = (heading?.textContent ?? "").replace(/​/g, "").trim();
    if (!heading) return;

    const appBarHeight =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--akari-doc-app-bar-height",
        ),
      ) || 64;
    pinned = document.documentElement.classList.contains("akari-tabs-pinned");
    const shelf = pinned
      ? (document.querySelector<HTMLElement>(".akari-tabs-shelf")?.offsetHeight ?? 0)
      : 0;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        covered.value =
          !entry.isIntersecting &&
          entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
      },
      { rootMargin: `${-(appBarHeight + shelf)}px 0px 0px 0px` },
    );
    observer.observe(heading);
  }

  onMounted(() => {
    observe();
    // The held tab bar comes and goes with the room in the app bar.
    classes = new MutationObserver(() => {
      const now = document.documentElement.classList.contains("akari-tabs-pinned");
      if (now !== pinned) observe(false);
    });
    classes.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });
  onContentUpdated(() => observe());
  watch(() => route.path, () => {
    if (!options.keep?.()) covered.value = false;
  });
  onUnmounted(() => {
    observer?.disconnect();
    classes?.disconnect();
  });

  return { covered, title };
}
