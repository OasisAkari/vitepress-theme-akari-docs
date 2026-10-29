import { nextTick, watch, type Ref } from "vue";

// Easing without overshoot, for a slide into either end of the bar.
const SETTLE =
  "var(--md-sys-motion-easing-emphasized-decelerate, cubic-bezier(0.05, 0.7, 0.1, 1))";

/**
 * Slides a tab bar's indicator to the new current tab. The indicator takes
 * the current tab's grid area, so it is in place without script, server
 * rendering included; on a change it starts from the box it had and eases
 * into the new one on the CSS transition of `.akari-page-tabs__indicator`.
 * A change in the middle of a slide starts from where the indicator is.
 * Into the first or the last tab it eases in without the spring's
 * overshoot, which the bar's rounded end would only cut off.
 */
export function useTabIndicator(
  bar: Ref<HTMLElement | null>,
  current: () => number,
): void {
  watch(
    current,
    () => {
      const indicator = bar.value?.querySelector<HTMLElement>(
        ".akari-page-tabs__indicator",
      );
      if (!indicator) return;
      const from = indicator.getBoundingClientRect();

      void nextTick(() => {
        const to = indicator.getBoundingClientRect();
        if (!from.width || !to.width || !indicator.isConnected) return;
        const dx = from.left - to.left;
        const scale = from.width / to.width;
        if (Math.abs(dx) < 0.5 && Math.abs(scale - 1) < 0.01) return;

        const count =
          bar.value?.querySelectorAll(".akari-page-tabs__tab").length ?? 0;
        const edge = current() === 0 || current() === count - 1;
        indicator.style.transition = "none";
        indicator.style.transform = `translateX(${dx}px) scaleX(${scale})`;
        void indicator.getBoundingClientRect();
        indicator.style.transition = "";
        indicator.style.transitionTimingFunction = edge ? SETTLE : "";
        indicator.style.transform = "";
      });
    },
    { flush: "pre" },
  );
}
