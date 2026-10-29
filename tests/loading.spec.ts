import { describe, expect, it } from "vitest";

import { resolveAkariConfig } from "../docs/.vitepress/theme/config";
import {
  PAGE_SHARE,
  resourceProgress,
  trickle,
} from "../docs/.vitepress/theme/loading";

describe("loading bar progress", () => {
  it("creeps towards the page's share without reaching it", () => {
    let progress = 0.05;
    const steps: number[] = [];
    for (let i = 0; i < 60; i++) {
      const next = trickle(progress);
      steps.push(next - progress);
      progress = next;
    }
    expect(progress).toBeLessThan(PAGE_SHARE);
    expect(progress).toBeGreaterThan(PAGE_SHARE - 0.01);
    // Each step is smaller than the one before.
    expect(steps.every((step, i) => i === 0 || step < steps[i - 1]!)).toBe(true);
    expect(trickle(0.9)).toBe(0.9);
  });

  it("fills the rest as the resources load", () => {
    expect(resourceProgress(0, 4)).toBe(PAGE_SHARE);
    expect(resourceProgress(2, 4, 0.8)).toBeCloseTo(0.9);
    expect(resourceProgress(4, 4)).toBe(1);
    expect(resourceProgress(5, 4)).toBe(1);
    // Nothing left to load: done.
    expect(resourceProgress(0, 0)).toBe(1);
  });

  it("is on unless the config turns it off", () => {
    expect(resolveAkariConfig().loadingBar).toEqual({ enabled: true });
    expect(
      resolveAkariConfig({ akari: { loadingBar: { enabled: false } } })
        .loadingBar,
    ).toEqual({ enabled: false });
  });
});
