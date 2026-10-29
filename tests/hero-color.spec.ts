import { describe, expect, it } from "vitest";

import { sourceColorFromPixels } from "../docs/.vitepress/theme/heroColor";

function image(...colors: Array<[number, number, number, number?]>) {
  return colors.flatMap(([r, g, b, a = 255]) => [r, g, b, a]);
}

function hue(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r!, g!, b!);
  const min = Math.min(r!, g!, b!);
  const d = max - min;
  const h =
    max === r ? ((g! - b!) / d) % 6 : max === g ? (b! - r!) / d + 2 : (r! - g!) / d + 4;
  return (h * 60 + 360) % 360;
}

describe("sourceColorFromPixels", () => {
  it("picks the image's dominant hue as the seed", () => {
    // Mostly teal with some white and grey, like an illustration.
    const pixels = image(
      ...Array.from({ length: 300 }, () => [0, 128, 128] as [number, number, number]),
      ...Array.from({ length: 200 }, () => [255, 255, 255] as [number, number, number]),
      ...Array.from({ length: 100 }, () => [120, 120, 120] as [number, number, number]),
    );

    const color = sourceColorFromPixels(pixels);
    expect(color).toMatch(/^#[0-9a-f]{6}$/);
    expect(hue(color!)).toBeGreaterThan(160);
    expect(hue(color!)).toBeLessThan(200);
  });

  it("skips transparent pixels", () => {
    const pixels = image(
      ...Array.from({ length: 400 }, () => [255, 0, 0, 0] as [number, number, number, number]),
      ...Array.from({ length: 100 }, () => [30, 80, 200] as [number, number, number]),
    );

    const color = sourceColorFromPixels(pixels);
    expect(hue(color!)).toBeGreaterThan(200);
    expect(hue(color!)).toBeLessThan(250);
  });

  it("finds nothing in a colorless or empty image", () => {
    expect(
      sourceColorFromPixels(
        image(...Array.from({ length: 100 }, () => [128, 128, 128] as [number, number, number])),
      ),
    ).toBeNull();
    expect(sourceColorFromPixels([])).toBeNull();
  });
});
