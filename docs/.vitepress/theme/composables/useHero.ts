import { computed, type ComputedRef } from "vue";
import { useData } from "vitepress";

import { resolveHero, type ResolvedHero } from "../hero";

/** The current page's hero, or null when its frontmatter sets none. */
export function useHero(): ComputedRef<ResolvedHero | null> {
  const { frontmatter, lang, page } = useData();

  return computed(() =>
    page.value.isNotFound ? null : resolveHero(frontmatter.value, lang.value),
  );
}
