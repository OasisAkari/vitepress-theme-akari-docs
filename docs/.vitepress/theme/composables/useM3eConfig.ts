import {
  computed,
  inject,
  provide,
  type ComputedRef,
  type InjectionKey,
} from "vue";
import { useData } from "vitepress";

import { resolveM3eConfig } from "../config";
import type { ResolvedM3eThemeConfig } from "../types";

const m3eConfigKey: InjectionKey<ComputedRef<ResolvedM3eThemeConfig>> =
  Symbol("m3e-config");

export function provideM3eConfig(): ComputedRef<ResolvedM3eThemeConfig> {
  const { theme, site } = useData();
  const config = computed(() =>
    resolveM3eConfig(theme.value, { title: site.value.title }),
  );

  provide(m3eConfigKey, config);
  return config;
}

export function useM3eConfig(): ComputedRef<ResolvedM3eThemeConfig> {
  const config = inject(m3eConfigKey);

  if (!config) {
    throw new Error(
      "[vitepress-theme-m3e] useM3eConfig() must be called inside M3eLayout.",
    );
  }

  return config;
}
