import {
  inject,
  onMounted,
  provide,
  reactive,
  watch,
  type InjectionKey,
} from "vue";

import { readStoredSettings, writeStoredSettings } from "../settings";
import type {
  M3eSettingsApi,
  M3eThemeSettings,
  ResolvedM3eThemeConfig,
  StorageLike,
} from "../types";

const settingsKey: InjectionKey<M3eSettingsApi> = Symbol("m3e-settings");

function getStorage(): StorageLike | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return window.localStorage ?? undefined;
  } catch {
    // Accessing localStorage can throw (sandboxed iframes, blocked storage).
    return undefined;
  }
}

export function provideM3eSettings(
  config: ResolvedM3eThemeConfig,
): M3eSettingsApi {
  const { defaults, sections, labels, persist, storageKey } = config.settings;
  const state = reactive<M3eThemeSettings>({ ...defaults });

  let hydrated = false;
  let storage: StorageLike | undefined;
  let pendingPersist = false;

  function applyDocumentSettings(): void {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.dir = state.direction;
    root.style.fontSize = state.textSize;
  }

  function persistState(): void {
    pendingPersist = false;

    if (!hydrated || !persist) return;

    // writeStoredSettings swallows quota and availability errors on purpose.
    writeStoredSettings(storage, storageKey, { ...state });
  }

  function schedulePersist(): void {
    if (!hydrated || !persist || pendingPersist) return;

    pendingPersist = true;
    queueMicrotask(persistState);
  }

  function setSetting<K extends keyof M3eThemeSettings>(
    key: K,
    value: M3eThemeSettings[K],
  ): void {
    state[key] = value;
  }

  function reset(): void {
    Object.assign(state, defaults);
  }

  function isDefault(): boolean {
    return (Object.keys(state) as Array<keyof M3eThemeSettings>).every(
      (key) => state[key] === defaults[key],
    );
  }

  const api: M3eSettingsApi = {
    settings: state,
    sections,
    labels,
    defaults: { ...defaults },
    setSetting,
    reset,
    isDefault,
  };

  watch(state, schedulePersist, { deep: true, flush: "sync" });

  watch(
    () => [state.direction, state.textSize] as const,
    () => {
      if (hydrated) applyDocumentSettings();
    },
  );

  onMounted(() => {
    if (persist) {
      storage = getStorage();
      // Hydration only reads; the sync watcher above ignores this assignment
      // because `hydrated` is not set until the stored state has been applied.
      Object.assign(
        state,
        readStoredSettings(storage, storageKey, defaults),
      );
    }

    applyDocumentSettings();
    hydrated = true;
  });

  provide(settingsKey, api);
  return api;
}

export function useM3eSettings(): M3eSettingsApi {
  const api = inject(settingsKey);

  if (!api) {
    throw new Error(
      "[vitepress-theme-m3e] useM3eSettings() must be called inside M3eLayout.",
    );
  }

  return api;
}
