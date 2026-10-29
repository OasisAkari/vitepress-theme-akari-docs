import { onMounted, onUnmounted, watch, type Ref } from "vue";

import type { AkariTabsApi } from "./useTabs";

/** Custom property on the title that caps its width. */
const TITLE_MAX = "--akari-app-bar-title-max";

/**
 * Text a truncated title keeps beside the docked bar, in em of its font
 * size: about six characters before the ellipsis. With less room the bar
 * stays in the page.
 */
const MIN_TEXT_EM = 6;

interface TitleWidth {
  /** Untruncated: the box plus the text it cuts off. */
  natural: number;
  /** Truncated as far as allowed: what does not shrink plus MIN_TEXT_EM. */
  minimum: number;
}

/**
 * The text that gives way when the title is short of room: the site
 * name's and the page title. Named outright: what truncates cannot be told
 * by style (the ellipsis turns into a plain cut while the title's width
 * eases, and the app bar keeps its whole title on one line).
 */
const TRUNCATING = ".akari-title__text, .akari-app-bar__page-title";

/**
 * Measures a title layer, the same whatever width the title is given. The
 * text is measured to the fraction of a pixel (a Range's box covers the
 * part cut off too): scrollWidth and clientWidth are rounded, and a cut
 * under half a pixel, invisible while the width eases, would read as none
 * and end in an ellipsis once it settles.
 */
function measureTitle(element: HTMLElement): TitleWidth {
  let natural = element.getBoundingClientRect().width;
  let shrinkable = 0;
  const range = document.createRange();
  for (const node of [element, ...element.querySelectorAll<HTMLElement>("*")]) {
    if (!node.matches(TRUNCATING)) continue;
    const style = getComputedStyle(node);
    range.selectNodeContents(node);
    const text = range.getBoundingClientRect().width;
    const box =
      node.getBoundingClientRect().width -
      pixels(style, "padding-left") -
      pixels(style, "padding-right");
    if (text > box) natural += text - box;
    shrinkable +=
      text - Math.min(text, MIN_TEXT_EM * Number.parseFloat(style.fontSize));
  }
  return { natural: Math.ceil(natural), minimum: Math.ceil(natural - shrinkable) };
}

/**
 * The docked bar's width at its content size. Its tabs share the width
 * equally, so that is the widest tab's text and padding times the count.
 */
function barWidth(bar: HTMLElement): number {
  const tabs = bar.querySelectorAll<HTMLElement>(".akari-page-tabs__tab");
  const range = document.createRange();
  let widest = 0;
  for (const tab of tabs) {
    range.selectNodeContents(tab);
    const style = getComputedStyle(tab);
    widest = Math.max(
      widest,
      range.getBoundingClientRect().width +
        Number.parseFloat(style.paddingLeft) +
        Number.parseFloat(style.paddingRight),
    );
  }
  return Math.ceil(widest * tabs.length);
}

function pixels(style: CSSStyleDeclaration, property: string): number {
  return Number.parseFloat(style.getPropertyValue(property)) || 0;
}

/** The app bar's actions, of which all but search can fold into a menu. */
export interface AppBarActions {
  /** The actions' row, carrying `--_gap` between its parts. */
  bar: Ref<HTMLElement | null>;
  /** The actions that fold, and the overflow menu's button. */
  extra: Ref<HTMLElement | null>;
  more: Ref<HTMLElement | null>;
  /** Set here: the actions are folded into the menu. */
  folded: Ref<boolean>;
  /** Set here, a frame after the first decision: transitions may run. */
  measured: Ref<boolean>;
}

/** Room the site name needs beyond its minimum before the actions unfold. */
const UNFOLD_SLACK = 8;

/**
 * How long the app bar's room must hold still before the bar may dock or
 * undock over it: a resized window, and the search field and actions
 * easing to their new widths after it, pass through room that is not the
 * final one. A docked bar that no longer fits its free space at all
 * leaves at once, as it would show cut off meanwhile.
 */
const ROOM_SETTLE = 200;

/** How long the title's width takes to ease (its transition, and a frame). */
const EASE_END = 320;

/**
 * Shares the app bar's free space between the title and the docked tab bar.
 *
 * The title is measured as it would be untruncated, site name and page
 * title alike, every time either changes. While the bar is docked the
 * title gets the width of the one on show, up to what the bar leaves it:
 * the bar's content width and a safe gap on both sides are set aside first,
 * and a longer title ends in an ellipsis. The bar then fills the rest.
 * Docking is offered only when the title keeps its logo and version and
 * at least MIN_TEXT_EM of its text (or all of it, if shorter), the site
 * name and the page title alike, whichever is on show; `tabs.dockable`
 * reports it.
 *
 * Out of the docked state the title is capped at its own width only, which
 * changes nothing on screen. Every change of width eases, so the bar grows
 * or shrinks with a longer or shorter title (another tab's page, the page
 * title taking over from the site name), and the free space opens and
 * closes gradually as the bar docks and undocks; the flight follows it.
 * Only the first width, on load, applies at once.
 *
 * The actions come first: when showing all of them would leave the site
 * name less than its minimum, every one but search folds into the overflow
 * menu (`actions.folded`), and they unfold once they fit again, with
 * UNFOLD_SLACK to spare so a window resized at the edge does not flicker.
 * The decision rests on the site name, not on a page title, which may be
 * long and truncates anyway.
 */
export function useAppBarRoom(
  title: Ref<HTMLElement | null>,
  text: { pageTitle: () => string; showsPageTitle: () => boolean },
  tabs: AkariTabsApi,
  actions?: AppBarActions,
): void {
  const { pageTitle, showsPageTitle } = text;
  let frame = 0;
  let observer: ResizeObserver | undefined;
  // The cap last set, in px; -1 when none.
  let applied = -1;
  let easeTimer: ReturnType<typeof setTimeout> | undefined;
  // The room last seen, when it last changed, and a pending re-measure.
  let lastRoom = -1;
  let roomChanged = 0;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;

  function measure(): void {
    frame = 0;

    const element = title.value;
    if (!element) return;

    const titleStyle = getComputedStyle(element);
    const room =
      (element.parentElement?.clientWidth ?? 0) -
      pixels(titleStyle, "margin-inline-start") -
      pixels(titleStyle, "margin-inline-end");
    const brand = element.querySelector<HTMLElement>(".akari-app-bar__brand");
    const page = element.querySelector<HTMLElement>(".akari-app-bar__page-title");
    const none: TitleWidth = { natural: 0, minimum: 0 };
    const brandWidth = brand ? measureTitle(brand) : none;
    const pageWidth = page?.textContent?.trim() ? measureTitle(page) : none;
    const shown = showsPageTitle() ? pageWidth : brandWidth;

    if (actions) fold(actions, room, brandWidth);

    const area = tabs.dockArea.value;
    const bar = tabs.dockedBar.value;
    if (!area || !bar) {
      element.style.removeProperty(TITLE_MAX);
      applied = -1;
      lastRoom = -1;
      tabs.dockable.value = false;
      return;
    }

    const barStyle = getComputedStyle(bar);
    const reserve =
      pixels(barStyle, "margin-inline-start") +
      pixels(barStyle, "margin-inline-end") +
      barWidth(bar);

    // Either title may show while docked, so both must keep their minimum.
    // Going by the one on show instead would let the bar dock and undock as
    // the title swaps, and a held bar changes when the title counts as
    // covered: the two would keep flipping each other.
    const left = room - reserve;
    const dockable = left >= Math.max(brandWidth.minimum, pageWidth.minimum);
    const now = performance.now();
    if (Math.abs(room - lastRoom) > 0.5) {
      // The first room seen counts as settled.
      roomChanged = lastRoom < 0 ? now - ROOM_SETTLE : now;
      lastRoom = room;
    }
    const cutOff = tabs.docked.value && area.clientWidth + 1 < reserve;
    if (dockable !== tabs.dockable.value) {
      if (now - roomChanged >= ROOM_SETTLE || (!dockable && cutOff)) {
        tabs.dockable.value = dockable;
      } else if (!settleTimer) {
        settleTimer = setTimeout(() => {
          settleTimer = undefined;
          schedule();
        }, ROOM_SETTLE);
      }
    }

    // A bar about to leave for want of room keeps the room it has until the
    // flight sets off from it. Flying out, it rides on the docked bar's
    // place, so the title may change meanwhile (a site name coming back).
    if (tabs.docked.value && !tabs.dockable.value) return;
    const max =
      tabs.docked.value && tabs.dockable.value
        ? Math.min(shown.natural, left)
        : Math.min(Math.max(brandWidth.natural, pageWidth.natural), room);
    const width = Math.max(0, Math.floor(max));
    // Measuring a title mid-transition can come out a pixel off (layout
    // widths are rounded); resetting the cap for that would restart its
    // transition every frame and stall it. Once it has settled, a pixel
    // counts: the measure after the transition puts it right, at once.
    const easing = element.dataset.easing !== undefined;
    const change = Math.abs(width - applied);
    if (applied >= 0 && change < (easing ? 2 : 1)) return;
    const animate = applied >= 0 && change >= 2;
    applied = width;
    const value = `${width}px`;

    if (animate) {
      // While the width eases the title is cut off plainly, revealed or
      // covered as it goes, rather than ending in an ellipsis mid-way.
      element.dataset.easing = "";
      clearTimeout(easeTimer);
      easeTimer = setTimeout(() => {
        delete element.dataset.easing;
        schedule();
      }, EASE_END);
      element.style.setProperty(TITLE_MAX, value);
      return;
    }
    // Leave max-width out of the transition for this change only.
    element.dataset.snap = "";
    element.style.setProperty(TITLE_MAX, value);
    void getComputedStyle(element).maxWidth;
    delete element.dataset.snap;
  }

  /**
   * Decides whether the actions fold. `room` is the title's room as laid
   * out now; with every action out it would lose what they take beyond
   * what is out now (the parts folding to nothing in between are counted
   * as they stand, so this holds mid-transition too).
   */
  function fold(parts: AppBarActions, room: number, brand: TitleWidth): void {
    const row = parts.bar.value;
    const extra = parts.extra.value;
    const more = parts.more.value;
    if (!row || !extra || !more) {
      parts.folded.value = false;
      return;
    }

    const outer = (part: HTMLElement) =>
      part.getBoundingClientRect().width +
      pixels(getComputedStyle(part), "margin-inline-start");
    const gap = pixels(getComputedStyle(row), "--_gap");
    // Its content's width, also while it is folded to nothing.
    const natural = extra.scrollWidth;
    extra.style.setProperty("--_extra-width", `${natural}px`);

    const spread = room + outer(extra) + outer(more) - (natural + gap);
    parts.folded.value = parts.folded.value
      ? spread < brand.minimum + UNFOLD_SLACK
      : spread < brand.minimum;

    if (!parts.measured.value) {
      requestAnimationFrame(() => {
        parts.measured.value = true;
      });
    }
  }

  /** Measures in the next frame, after the change has rendered. */
  function schedule(): void {
    if (!frame) frame = requestAnimationFrame(measure);
  }

  function observe(): void {
    observer?.disconnect();
    if (typeof ResizeObserver === "undefined") return;
    observer = new ResizeObserver(() => schedule());
    const element = title.value;
    for (const target of [
      element?.parentElement,
      element?.querySelector(".akari-title"),
      element?.querySelector(".akari-app-bar__page-title"),
      tabs.dockedBar.value,
      actions?.bar.value,
      actions?.extra.value?.firstElementChild,
    ]) {
      if (target) observer.observe(target);
    }
  }

  function onFontsLoaded(): void {
    schedule();
  }

  watch(() => [
    title.value,
    tabs.dockedBar.value,
    tabs.dockArea.value,
    actions?.bar.value,
    actions?.extra.value,
  ], () => {
    observe();
    schedule();
  }, { flush: "post" });
  watch(() => tabs.tabs.value, () => schedule(), { flush: "post" });
  watch([() => tabs.docked.value, () => tabs.flying.value], () => schedule());
  watch([showsPageTitle, pageTitle], () => schedule(), { flush: "post" });

  onMounted(() => {
    observe();
    schedule();
    document.fonts?.addEventListener("loadingdone", onFontsLoaded);
  });

  onUnmounted(() => {
    if (frame) cancelAnimationFrame(frame);
    clearTimeout(settleTimer);
    clearTimeout(easeTimer);
    observer?.disconnect();
    document.fonts?.removeEventListener("loadingdone", onFontsLoaded);
  });
}
