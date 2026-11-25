import {
  argbFromRgb,
  hexFromArgb,
  QuantizerCelebi,
  Score,
} from "@material/material-color-utilities";

const MAX_COLORS = 128;

/**
 * The theme seed for an image's RGBA pixels, picked the way Material picks a
 * wallpaper's source color: quantize, then score the colors for how well
 * they suit a UI theme. Transparent pixels are skipped. Null when nothing in
 * the image is colorful enough to build a theme on.
 *
 * The site samples hero colors at build time instead (see media-colors.ts);
 * this reference implementation stays for tests and for anyone reading the
 * algorithm without sharp and Node's module loader in the way.
 */
export function sourceColorFromPixels(
  data: ArrayLike<number>,
): string | null {
  const pixels: number[] = [];

  for (let index = 0; index + 3 < data.length; index += 4) {
    if (data[index + 3]! < 255) continue;
    pixels.push(argbFromRgb(data[index]!, data[index + 1]!, data[index + 2]!));
  }

  if (!pixels.length) return null;

  const [best] = Score.score(QuantizerCelebi.quantize(pixels, MAX_COLORS), {
    desired: 1,
    // Zero is no color at all: Score returns it when nothing qualifies.
    fallbackColorARGB: 0,
    filter: true,
  });

  return best ? hexFromArgb(best) : null;
}

export {
  HERO_COLOR_SAMPLE_SIZE,
  heroColorKey,
  resolveHeroColor,
} from "./heroColorCache";
