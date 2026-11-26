/**
 * The boot screen: a static skeleton of the document shell, injected next to
 * `#app` when the site is built.
 *
 * It exists because everything inside `#app` stays hidden until the m3e
 * components register (`base.css`), and that wait is the whole first screen.
 * Being outside the app, the skeleton needs no JavaScript, no m3e component
 * and no hydration match: the stylesheet paints it on its own, and it leaves
 * in the same frame the app becomes ready.
 *
 * `m3e-skeleton` is deliberately not used here. Importing it would put Lit and
 * the m3e core into the initial chunk (+37 KB gzip) and it could not paint
 * before that chunk ran, which is the wait it would be covering.
 */

/** How long the boot screen waits before offering a reload, in ms. */
export const AKARI_BOOT_STALL_TIMEOUT = 10_000;

const RETRY_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-8 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z"/></svg>`;

/**
 * Follows the shell's proportions: 64px bar, 96px rail, document column.
 * Everything is decorative; the retry button is the only control.
 */
export const AKARI_BOOT_MARKUP = `
    <div id="akari-boot">
      <div class="akari-boot__bar" aria-hidden="true">
        <span class="akari-boot__mark"></span>
        <span class="akari-boot__brand"></span>
        <span class="akari-boot__spacer"></span>
        <span class="akari-boot__pill"></span>
        <span class="akari-boot__pill"></span>
      </div>
      <div class="akari-boot__frame" aria-hidden="true">
        <div class="akari-boot__rail">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="akari-boot__doc">
          <span class="akari-boot__title"></span>
          <span class="akari-boot__line"></span>
          <span class="akari-boot__line"></span>
          <span class="akari-boot__line akari-boot__line--short"></span>
          <div class="akari-boot__cards">
            <span></span><span></span><span></span><span></span>
          </div>
          <span class="akari-boot__line"></span>
          <span class="akari-boot__line"></span>
          <span class="akari-boot__line akari-boot__line--short"></span>
        </div>
      </div>
      <button type="button" id="akari-boot-retry" aria-label="Reload page">${RETRY_ICON}</button>
      <noscript><p class="akari-boot__noscript"></p></noscript>
    </div>`;

/**
 * `transformHtml` hook: put the boot screen first in the body. It sits before
 * `#app` on purpose, so Vue never hydrates around it.
 */
export function injectAkariBoot(html: string): string {
  return html.replace(/<body([^>]*)>/, (tag) => `${tag}${AKARI_BOOT_MARKUP}`);
}

/**
 * Inline head script: if the app has not signalled ready by the timeout, mark
 * the boot screen as stalled. CSS pauses the shimmer and shows the retry
 * button; nothing is ever revealed half-upgraded.
 */
export function akariBootWatchdog(timeout = AKARI_BOOT_STALL_TIMEOUT): string {
  return `(function(){var root=document.documentElement;setTimeout(function(){if(root.hasAttribute("data-akari-ready"))return;root.setAttribute("data-akari-boot-stalled","");var retry=document.getElementById("akari-boot-retry");if(retry)retry.addEventListener("click",function(){location.reload()});},${timeout});})();`;
}
