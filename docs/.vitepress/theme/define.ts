// Imported by the docs' config files. Vite loads those on its own and
// warns about imports its coming native loader cannot follow, so this
// module imports only types, by their full file name.
import type { AkariDirectoryConfig, AkariSiteConfig } from "./types.ts";

/**
 * Writes a config file of the docs (`docs/config.ts`, or the `config.ts`
 * of a language folder) in the shape VitePress reads from it: VitePress'
 * own fields as they are, the theme's under `themeConfig.akari`.
 */
export function defineAkariConfig(config: AkariSiteConfig): AkariDirectoryConfig {
  const {
    rootLanguage,
    lang,
    label,
    dir,
    title,
    titleTemplate,
    description,
    head,
    markdown,
    logo,
    ...akari
  } = config;
  const site = {
    rootLanguage,
    lang,
    label,
    dir,
    title,
    titleTemplate,
    description,
    head,
    markdown,
  };

  return {
    ...Object.fromEntries(
      Object.entries(site).filter(([, value]) => value !== undefined),
    ),
    themeConfig: { ...(logo === undefined ? {} : { logo }), akari },
  };
}
