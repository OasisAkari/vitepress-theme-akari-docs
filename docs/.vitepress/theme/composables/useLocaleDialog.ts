import { inject, provide, type InjectionKey } from "vue";

import { createMorphDialog, type AkariMorphDialogApi } from "./useMorphDialog";

export type AkariLocaleDialogApi = AkariMorphDialogApi;

const localeDialogKey: InjectionKey<AkariLocaleDialogApi> =
  Symbol("akari-locale-dialog");

/** State of the language dialog, shared by every language button. */
export function provideAkariLocaleDialog(): AkariLocaleDialogApi {
  const api = createMorphDialog();
  provide(localeDialogKey, api);
  return api;
}

export function useAkariLocaleDialog(): AkariLocaleDialogApi {
  const api = inject(localeDialogKey);

  if (!api) {
    throw new Error(
      "[vitepress-akari-theme-docs] useAkariLocaleDialog() must be called inside AkariLayout.",
    );
  }

  return api;
}
