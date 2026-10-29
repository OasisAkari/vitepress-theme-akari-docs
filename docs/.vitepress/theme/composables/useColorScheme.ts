import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watchEffect,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from "vue";

import {
  nextScheme,
  resolveScheme,
  SCHEME_CLOCK_INTERVAL,
  systemScheme,
  usesClock,
  type AkariResolvedScheme,
} from "../scheme";
import type { AkariColorScheme, AkariSettingsApi } from "../types";

export interface AkariColorSchemeApi {
  /** The chosen mode: light, dark, system (`auto`) or time of day. */
  mode: ComputedRef<AkariColorScheme>;
  /** What the page shows; null until the page is mounted in a browser. */
  resolved: Readonly<Ref<AkariResolvedScheme | null>>;
  /** Steps to the next mode. */
  cycle(): void;
}

const colorSchemeKey: InjectionKey<AkariColorSchemeApi> =
  Symbol("akari-color-scheme");

/**
 * Resolves the appearance mode to light or dark. The system preference is
 * followed live; the time of day is read once a minute, and only while the
 * mode depends on it.
 */
export function provideAkariColorScheme(
  settings: AkariSettingsApi,
): AkariColorSchemeApi {
  const mode = computed(() => settings.settings.scheme);
  const system = ref<AkariResolvedScheme | null>(null);
  const hour = ref(0);
  const mounted = ref(false);

  let darkQuery: MediaQueryList | undefined;
  let lightQuery: MediaQueryList | undefined;
  let clock: ReturnType<typeof setInterval> | undefined;

  function readSystem(): void {
    system.value = systemScheme((query) => {
      if (query === darkQuery?.media) return darkQuery.matches;
      if (query === lightQuery?.media) return lightQuery.matches;
      return false;
    });
  }

  function readClock(): void {
    hour.value = new Date().getHours();
  }

  // Resolved only in the browser, so the server render and hydration agree.
  const resolved = computed(() =>
    mounted.value ? resolveScheme(mode.value, system.value, hour.value) : null,
  );

  watchEffect(() => {
    const needed = mounted.value && usesClock(mode.value, system.value);
    if (needed && clock === undefined) {
      readClock();
      clock = setInterval(readClock, SCHEME_CLOCK_INTERVAL);
    } else if (!needed && clock !== undefined) {
      clearInterval(clock);
      clock = undefined;
    }
  });

  onMounted(() => {
    if (typeof window.matchMedia === "function") {
      darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
      lightQuery = window.matchMedia("(prefers-color-scheme: light)");
      darkQuery.addEventListener("change", readSystem);
      lightQuery.addEventListener("change", readSystem);
    }
    readSystem();
    readClock();
    mounted.value = true;
  });

  onUnmounted(() => {
    darkQuery?.removeEventListener("change", readSystem);
    lightQuery?.removeEventListener("change", readSystem);
    if (clock !== undefined) clearInterval(clock);
  });

  const api: AkariColorSchemeApi = {
    mode,
    resolved,
    cycle: () => settings.setSetting("scheme", nextScheme(mode.value)),
  };

  provide(colorSchemeKey, api);
  return api;
}

export function useAkariColorScheme(): AkariColorSchemeApi {
  const api = inject(colorSchemeKey);

  if (!api) {
    throw new Error(
      "[vitepress-akari-theme-docs] useAkariColorScheme() must be called inside AkariLayout.",
    );
  }

  return api;
}
