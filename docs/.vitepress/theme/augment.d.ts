import type { AkariThemeConfig } from "./types";

declare module "vitepress" {
  namespace DefaultTheme {
    interface Config {
      akari?: AkariThemeConfig;
    }
  }
}

export {};
