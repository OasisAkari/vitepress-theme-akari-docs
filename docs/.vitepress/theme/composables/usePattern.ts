import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from "vue";
import { onContentUpdated } from "vitepress";

import { randomHeroPattern, type ResolvedHero } from "../hero";
import type { AkariHeroPattern } from "../types";

const patternKey: InjectionKey<ComputedRef<AkariHeroPattern | null>> =
  Symbol("akari-pattern");

/**
 * The page's hidden pattern (see styles/pattern.css): the one its hero
 * names, none if the hero says `none`, and otherwise one drawn at random
 * each time content loads. It is drawn in the browser only, so the server's
 * page and the hydrated one agree; the pattern then fades in.
 */
export function providePagePattern(
  hero: ComputedRef<ResolvedHero | null>,
): ComputedRef<AkariHeroPattern | null> {
  const drawn = ref<AkariHeroPattern | null>(null);

  function draw(): void {
    drawn.value = randomHeroPattern();
  }

  onMounted(draw);
  onContentUpdated(draw);

  const pattern = computed(() => {
    const named = hero.value?.pattern;
    if (named === "none") return null;
    return named && named !== "auto" ? named : drawn.value;
  });

  provide(patternKey, pattern);
  return pattern;
}

export function usePagePattern(): ComputedRef<AkariHeroPattern | null> {
  return inject(
    patternKey,
    computed(() => null),
  );
}

/** Surfaces whose pattern lights up around the pointer. */
const LIT = [
  ".akari-doc-hero__text",
  ".akari-doc-hero__media",
  '.akari-prose :is(div[class*="language-"], .vp-code-group .tabs, .akari-table, .custom-block, blockquote, .demo-surface)',
].join(", ");

/**
 * Moves the light on patterned surfaces with the pointer: one listener on
 * the document surface writes the pointer's position, in each lit
 * surface's own coordinates, into its --_x and --_y once a frame, for the
 * surface under the pointer and any lit surface around it. Mouse and pen
 * only: touch has nothing to hover.
 */
export function useContentLight(surface: Ref<HTMLElement | null>): void {
  let frame = 0;
  let pointer: { target: Element; x: number; y: number } | null = null;

  function apply(): void {
    frame = 0;
    if (!pointer) return;
    const { target, x, y } = pointer;
    for (
      let lit = target.closest<HTMLElement>(LIT);
      lit;
      lit = lit.parentElement?.closest<HTMLElement>(LIT) ?? null
    ) {
      const box = lit.getBoundingClientRect();
      lit.style.setProperty("--_x", `${x - box.left}px`);
      lit.style.setProperty("--_y", `${y - box.top}px`);
    }
  }

  function onMove(event: PointerEvent): void {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (!(event.target instanceof Element)) return;
    pointer = { target: event.target, x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(apply);
  }

  watch(
    surface,
    (element, previous) => {
      previous?.removeEventListener("pointermove", onMove);
      element?.addEventListener("pointermove", onMove, { passive: true });
    },
    { immediate: true },
  );

  onUnmounted(() => {
    if (frame) cancelAnimationFrame(frame);
    surface.value?.removeEventListener("pointermove", onMove);
  });
}
