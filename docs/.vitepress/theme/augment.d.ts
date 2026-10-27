import type { M3eThemeConfig } from "./types";

declare module "vitepress" {
  namespace DefaultTheme {
    interface Config {
      m3e?: M3eThemeConfig;
    }
  }
}

export {};
