import { inject, provide, type InjectionKey } from "vue";

import { createMorphDialog, type AkariMorphDialogApi } from "./useMorphDialog";

export type AkariSettingsDialogApi = AkariMorphDialogApi;

const settingsDialogKey: InjectionKey<AkariSettingsDialogApi> =
  Symbol("akari-settings-dialog");

/** State of the settings dialog, opened from the app bar's settings button. */
export function provideAkariSettingsDialog(): AkariSettingsDialogApi {
  const api = createMorphDialog();
  provide(settingsDialogKey, api);
  return api;
}

export function useAkariSettingsDialog(): AkariSettingsDialogApi {
  const api = inject(settingsDialogKey);

  if (!api) {
    throw new Error(
      "[vitepress-akari-theme-docs] useAkariSettingsDialog() must be called inside AkariLayout.",
    );
  }

  return api;
}
