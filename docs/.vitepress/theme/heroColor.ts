import {
  argbFromRgb,
  hexFromArgb,
  QuantizerCelebi,
  Score,
} from "@material/material-color-utilities";

// Longest side the image is scaled to before its pixels are read, as
// Material's own image extraction does: enough to find the dominant colors,
// small enough to stay instant.
const SAMPLE_SIZE = 128;
const MAX_COLORS = 128;

/**
 * The theme seed for an image's RGBA pixels, picked the way Material picks a
 * wallpaper's source color: quantize, then score the colors for how well
 * they suit a UI theme. Transparent pixels are skipped. Null when nothing in
 * the image is colorful enough to build a theme on.
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

const pending = new Map<string, Promise<string | null>>();

/**
 * Loads an image and samples its theme seed. Images from other origins can
 * only be read when they are served with CORS headers; otherwise this
 * resolves to null.
 *
 * This module is only loaded in the browser, on demand: the color library is
 * kept out of the server render and of pages without a hero.
 */
export function sampleImageColor(url: string): Promise<string | null> {
  const known = pending.get(url);
  if (known) return known;

  const task = (async () => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.src = url;
    await image.decode();

    // SVGs without an intrinsic size report zero; draw them square.
    const width = image.naturalWidth || SAMPLE_SIZE;
    const height = image.naturalHeight || SAMPLE_SIZE;
    const scale = Math.min(1, SAMPLE_SIZE / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return null;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return sourceColorFromPixels(
      context.getImageData(0, 0, canvas.width, canvas.height).data,
    );
  })().catch(() => null);

  pending.set(url, task);
  return task;
}
