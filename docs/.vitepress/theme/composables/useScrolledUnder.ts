import { onMounted, onUnmounted, type Ref } from "vue";

const ATTRIBUTE = "data-akari-scrolled";

/**
 * Marks the document while content has scrolled under the app bar.
 * `sentinel` sits at the top edge of the document surface; the state is
 * published as `html[data-akari-scrolled]` so styles anywhere, including
 * replacement components, can react to it.
 */
export function useScrolledUnder(sentinel: Ref<HTMLElement | null>): void {
  let observer: IntersectionObserver | undefined;

  onMounted(() => {
    const target = sentinel.value;
    if (!target) return;

    const root = document.documentElement;
    const appBarHeight =
      Number.parseFloat(
        getComputedStyle(root).getPropertyValue("--akari-doc-app-bar-height"),
      ) || 64;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const passed =
          !entry.isIntersecting &&
          entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
        root.toggleAttribute(ATTRIBUTE, passed);
      },
      { rootMargin: `${-appBarHeight}px 0px 0px 0px` },
    );
    observer.observe(target);
  });

  onUnmounted(() => {
    observer?.disconnect();
    document.documentElement.removeAttribute(ATTRIBUTE);
  });
}
