import {
  onMounted,
  readonly,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from "vue";
import { withBase } from "vitepress";

import { heroImageHref, type ResolvedHero } from "../hero";
import type { AkariResolvedScheme } from "../scheme";

const STORAGE_KEY = "akari-hero-colors";

// Sampled colors are remembered across visits, so a page shows its colors
// at once the next time.
function readCache(): Record<string, string> {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return value && typeof value === "object"
      ? (value as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

function writeCache(url: string, color: string): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...readCache(), [url]: color }),
    );
  } catch {
    // Storage unavailable or full: sample again next time.
  }
}

/**
 * The theme seed a hero page asks for: sampled from the hero image on
 * screen (the dark one in the dark scheme), the page's fixed `hero.color`,
 * or null to keep the reader's color. Applied only in the browser, after
 * mount, so the server render and hydration agree.
 */
export function useHeroColor(
  hero: ComputedRef<ResolvedHero | null>,
  scheme: Readonly<Ref<AkariResolvedScheme | null>>,
): Readonly<Ref<string | null>> {
  const color = ref<string | null>(null);
  let request = 0;

  // A string, so the watcher only reacts when the target really changes.
  const target = (): string | null => {
    const current = hero.value;
    if (!current || current.color === false) return null;
    if (current.color !== "auto") return `color:${current.color}`;

    const src =
      scheme.value === "dark" && current.darkSrc ? current.darkSrc : current.src;
    return `image:${heroImageHref(src, withBase)}`;
  };

  async function apply(next: string | null): Promise<void> {
    const id = ++request;

    if (next === null) {
      color.value = null;
    } else if (next.startsWith("color:")) {
      color.value = next.slice("color:".length);
    } else {
      const url = next.slice("image:".length);
      // A known image recolors at once; a new one keeps the current colors
      // until it has been sampled, so the page changes color only once.
      const known = readCache()[url];
      if (known) {
        color.value = known;
        return;
      }

      const { sampleImageColor } = await import("../heroColor");
      const sampled = await sampleImageColor(url);
      if (sampled) writeCache(url, sampled);
      if (id === request) color.value = sampled;
    }
  }

  onMounted(() => {
    watch(target, (next) => void apply(next), { immediate: true });
  });

  return readonly(color);
}
