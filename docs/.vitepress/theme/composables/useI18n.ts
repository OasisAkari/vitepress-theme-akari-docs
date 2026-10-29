import { computed } from "vue";

import { formatMessage } from "../i18n";
import type { AkariMessages } from "../types";
import { useAkariConfig } from "./useAkariConfig";

export function useAkariI18n() {
  const config = useAkariConfig();
  const lang = computed(() => config.value.lang);
  const messages = computed(() => config.value.messages);

  /** The current locale's string for `key`, with placeholders filled in. */
  function t(
    key: keyof AkariMessages,
    params?: Readonly<Record<string, string | number>>,
  ): string {
    return formatMessage(config.value.messages[key], params);
  }

  return { lang, messages, t };
}
