/** The loading bar's share for the page itself; its resources fill the rest. */
export const PAGE_SHARE = 0.7;

/**
 * The next step while the page itself loads, whose size the theme can't
 * know: big steps at first, smaller ones as it nears `ceiling`, which it
 * never reaches.
 */
export function trickle(progress: number, ceiling = PAGE_SHARE): number {
  return progress + Math.max(0, ceiling - progress) * 0.1;
}

/**
 * Progress once the page is in: from where it was, the resources loaded
 * so far fill the rest.
 */
export function resourceProgress(
  done: number,
  total: number,
  from = PAGE_SHARE,
): number {
  return total > 0 ? from + (1 - from) * Math.min(1, done / total) : 1;
}
