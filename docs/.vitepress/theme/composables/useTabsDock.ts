import {
  nextTick,
  onMounted,
  onUnmounted,
  watch,
  watchEffect,
  type Ref,
} from "vue";
import { onContentUpdated, useRoute } from "vitepress";

import { AKARI_CONTENT_ID } from "../constants";
import {
  getSearchMotionPreset,
  prefersReducedMotion,
} from "../search/animation";
import {
  parseColor,
  springAt,
  springSettle,
  type Rgba,
  type Spring,
} from "../tween";
import type { AkariMotionScheme } from "../types";
import type { AkariTabsApi } from "./useTabs";

/**
 * How far below the app bar the page bar starts docking: early enough that
 * it is still clear of the app bar's edge, not partly under it.
 */
const DOCK_AHEAD = 24;

/**
 * How far the page has to have scrolled before the bar docks. On compact
 * layouts the bar rests nearer the app bar than DOCK_AHEAD; without this it
 * would dock at the top of the page, before the reader scrolls at all.
 */
const DOCK_SCROLL = 8;

/**
 * The flight's springs: M3's default spatial spring of each motion scheme,
 * as for a sheet or a menu. Released from rest, they start gently and, the
 * expressive one, settle with a slight overshoot.
 */
const SPATIAL: Record<AkariMotionScheme, Spring> = {
  expressive: { dampingRatio: 0.8, stiffness: 380 },
  standard: { dampingRatio: 0.9, stiffness: 700 },
};

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
  color: Rgba;
}

function measure(element: HTMLElement): Box {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    fontSize: Number.parseFloat(style.fontSize),
    color: parseColor(style.backgroundColor),
  };
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Horizontal extent and font size (the tabs are sized in em) between two boxes. */
function across(
  from: Box,
  to: Box,
  k: number,
): Pick<Box, "left" | "width" | "fontSize"> {
  return {
    left: lerp(from.left, to.left, k),
    width: Math.max(0, lerp(from.width, to.width, k)),
    fontSize: Math.max(1, lerp(from.fontSize, to.fontSize, k)),
  };
}

/** Vertical extent and colour between two boxes. */
function along(
  from: Box,
  to: Box,
  k: number,
): Pick<Box, "top" | "height" | "color"> {
  return {
    top: lerp(from.top, to.top, k),
    height: Math.max(0, lerp(from.height, to.height, k)),
    color: from.color.map((channel, index) =>
      lerp(channel, to.color[index]!, k),
    ) as Rgba,
  };
}

/**
 * When the second axis of a flight may set off, in ms after the first. The
 * axes overlap as far as they can while the copy is never inside the app
 * bar (above `edge`) wider than the free space (`slot`): docking, the rise
 * may only cross the edge once the narrowing has brought the copy within
 * the free space for good; undocking, the widening may only take it past
 * the free space once the drop has taken it out of the app bar.
 */
function secondAxisDelay(
  toDocked: boolean,
  from: Box,
  to: Box,
  slot: { left: number; right: number },
  edge: number,
  spring: Spring,
): number {
  const settle = Math.round(springSettle(spring) * 1000);
  const at = (ms: number) => springAt(spring, ms / 1000);
  const fits = (k: number) =>
    lerp(from.left, to.left, k) >= slot.left - 1 &&
    lerp(from.left + from.width, to.left + to.width, k) <= slot.right + 1;

  if (toDocked) {
    let fit = 0;
    for (let ms = 0; ms <= settle; ms++) if (!fits(at(ms))) fit = ms + 1;
    const top = Math.max(from.top, edge);
    let cross = 0;
    while (cross < settle && lerp(top, to.top, at(cross)) >= edge) cross++;
    return Math.max(0, fit - cross);
  }

  let out = 0;
  while (out < settle && lerp(from.top, to.top, at(out)) < edge) out++;
  let inside = 0;
  while (inside < settle && fits(at(inside))) inside++;
  return Math.max(0, out - inside);
}

function place(element: HTMLElement, box: Box): void {
  const [r, g, b, a] = box.color;
  Object.assign(element.style, {
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    margin: "0",
    fontSize: `${box.fontSize}px`,
    backgroundColor: `rgb(${r} ${g} ${b} / ${Math.min(1, Math.max(0, a))})`,
  });
}

/**
 * Docks the page's tab bar in the app bar as it scrolls up to it, and
 * brings it back when it scrolls away again. It only docks where the app
 * bar's free space can hold it. Between the two places a copy of the bar
 * flies on the motion scheme's spatial spring, resizing as it goes: the
 * tabs are sized in em, so moving the box and changing the font size is
 * all it takes. Each axis moves on a spring (SPATIAL); the second sets off
 * as soon as it can without the copy being inside the app bar at a width
 * the free space cannot hold (see secondAxisDelay), so it stays clear of
 * the title and the actions. The landing spot is read every frame, so the copy
 * meets a page bar that is still moving with the scroll. A reversal
 * mid-flight continues from where the copy is. A bar scrolled out of sight
 * in one jump has no flight to make: the docked bar fades in.
 *
 * Moving to another page of the group keeps the bar where it is. Docked,
 * it stays docked: the next page opens scrolled to where its article
 * starts, title and bar under the app bar. In the page, the bar glides to
 * the next page's place for it if that differs.
 */
export function useTabsDock(
  page: Ref<HTMLElement | null>,
  tabs: AkariTabsApi,
  motion: () => AkariMotionScheme,
): void {
  const route = useRoute();
  let frame = 0;
  let flight: { clone: HTMLElement; raf: number; toDocked: boolean } | null =
    null;
  // Viewport top of the page bar before a switch within the group.
  let glideFrom: number | null = null;
  let measured = false;

  function appBarBottom(): number {
    const value = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--akari-doc-app-bar-height",
      ),
    );
    return Number.isFinite(value) ? value : 64;
  }

  /**
   * Where content counts as covered: the app bar's bottom edge, or the
   * shelf's when the bar is held under the app bar.
   */
  function coverLine(): number {
    const shelf = page.value?.parentElement;
    return document.documentElement.classList.contains("akari-tabs-pinned") &&
      shelf
      ? appBarBottom() + shelf.offsetHeight
      : appBarBottom();
  }

  /**
   * Scrolls to where the article starts below its title, as an anchor jump
   * would: past the hero, or past a leading h1. The title and the tab bar
   * end up under the app bar (or the held tab bar), the title wholly, so
   * the app bar takes it over (a title touching the edge still counts as
   * on screen).
   */
  function scrollToArticle(): void {
    const content = document.getElementById(AKARI_CONTENT_ID);
    if (!content) return;
    const heading = content.querySelector<HTMLElement>("h1");
    const next = heading?.nextElementSibling;
    const leading =
      heading && !heading.previousElementSibling && heading.getClientRects().length
        ? heading
        : null;
    const start = leading && next instanceof HTMLElement ? next : content;
    const title =
      document.querySelector<HTMLElement>("[data-akari-page-title]") ?? leading;
    const offset =
      Number.parseFloat(
        getComputedStyle(document.documentElement).scrollPaddingTop,
      ) || appBarBottom();

    let top = start.getBoundingClientRect().top - offset;
    if (title) {
      top = Math.max(top, title.getBoundingClientRect().bottom - coverLine() + 1);
    }
    window.scrollTo({ top: top + window.scrollY, behavior: "instant" });
  }

  /** Moves the page bar from where it was to its place on this page. */
  function glide(from: number): void {
    const bar = page.value;
    if (!bar || prefersReducedMotion()) return;
    const dy = from - bar.getBoundingClientRect().top;
    if (Math.abs(dy) < 1) return;

    bar.style.transition = "none";
    bar.style.transform = `translateY(${dy}px)`;
    void bar.getBoundingClientRect();
    bar.style.transition = "";
    bar.style.transform = "";
  }

  function cancelFlight(): void {
    if (!flight) return;
    cancelAnimationFrame(flight.raf);
    flight.clone.remove();
    flight = null;
    tabs.flying.value = false;
  }

  function fly(toDocked: boolean): void {
    const pageBar = page.value;
    const dockedBar = tabs.dockedBar.value;
    const host = document.querySelector(".akari-frame");
    if (!pageBar || !dockedBar || !host) {
      tabs.docked.value = toDocked;
      return;
    }

    let clone: HTMLElement;
    let from: Box;
    // Setting off cut off in a free space too small for the docked bar.
    let cutOff = false;
    // Setting off from the bar itself, not turning back mid-flight.
    const fresh = !flight;
    if (flight) {
      cancelAnimationFrame(flight.raf);
      clone = flight.clone;
      from = measure(clone);
    } else {
      const source = toDocked ? pageBar : dockedBar;
      from = measure(source);
      // The docked bar shows only within the free space: cut off there when
      // the app bar has lost the room for it, the copy starts as it shows,
      // and from nothing, where the free space is, when none of it shows.
      const area = tabs.dockArea.value?.getBoundingClientRect();
      if (!toDocked && area) {
        const left = Math.max(from.left, area.left);
        const right = Math.min(from.left + from.width, area.right);
        cutOff = right - left < from.width - 0.5;
        from =
          right > left
            ? { ...from, left, width: right - left }
            : { ...from, left: (area.left + area.right) / 2, width: 0 };
      }
      clone = source.cloneNode(true) as HTMLElement;
      for (const name of ["id", "data-hidden", "data-shown", "aria-label"]) {
        clone.removeAttribute(name);
      }
      clone.setAttribute("aria-hidden", "true");
      clone.inert = true;
      // Only the shared tab bar rules: those of either bar's own place
      // (stacking, margins, sizing in the app bar) would fight the flight.
      clone.className = "akari-page-tabs akari-page-tabs--flight";
      clone.style.transform = "none";
      clone.style.transition = "none";
      // Tabs wider than the copy overflow both ends evenly, as they do in
      // the free space they are centred in.
      clone.style.justifyContent = "center";
      place(clone, from);
      // Cut by the app bar's edge from the first frame, as in the page.
      const edge = appBarBottom();
      if (toDocked && from.top < edge) {
        clone.style.clipPath = `inset(${edge - from.top}px 0 0 0)`;
      }
      host.append(clone);
    }

    tabs.docked.value = toDocked;
    tabs.flying.value = true;

    const spring = SPATIAL[motion()];
    const settle = springSettle(spring) * 1000;
    const target = toDocked ? dockedBar : pageBar;
    const start = performance.now();
    const current = { clone, raf: 0, toDocked };
    flight = current;

    // Keeps a horizontal extent within the docked bar's room: the free
    // space less the bar's safe gaps (its margins), which absorb the frame
    // the free space may move by (the title eases on its own transition).
    const within = (x: ReturnType<typeof across>) => {
      const area = tabs.dockArea.value;
      if (!area) return x;
      const rect = area.getBoundingClientRect();
      const style = getComputedStyle(dockedBar);
      const left = Math.max(x.left, rect.left + Number.parseFloat(style.marginLeft));
      const right = Math.min(
        x.left + x.width,
        rect.right - Number.parseFloat(style.marginRight),
      );
      return { ...x, left, width: Math.max(0, right - left) };
    };

    const slot = tabs.dockArea.value?.getBoundingClientRect();
    const delay = slot
      ? secondAxisDelay(toDocked, from, measure(target), slot, appBarBottom(), spring)
      : settle;
    // When the second axis set off, and the box it set off from.
    let second: { at: number; from: Box } | null = null;

    const step = (now: number) => {
      const edge = appBarBottom();
      const to = measure(target);
      const elapsed = now - start;
      const first = springAt(spring, elapsed / 1000);
      const then = second ? springAt(spring, (now - second.at) / 1000) : 0;

      let box: Box;
      if (toDocked) {
        // Narrow first. A bar partly under the app bar's edge comes out
        // from under it meanwhile, cut by the edge as it was in the page.
        // Inside the app bar it keeps to the docked bar's room, which can
        // still be closing in (a longer title taking over).
        const clear = { ...from, top: Math.max(from.top, edge) };
        const x = across(from, to, first);
        const y = second
          ? along(second.from, to, then)
          : along(from, clear, first);
        box = { ...(second && y.top < edge ? within(x) : x), ...y };
        clone.style.clipPath =
          !second && box.top < edge ? `inset(${edge - box.top}px 0 0 0)` : "";
      } else {
        // Drop first, keeping to the docked bar's place in the free space,
        // which a returning site name may still be widening into (setting
        // off from the bar, on it; turning back, closing in on it, within
        // the free space); or, cut off in it, at the width it set off with.
        // Widen once leaving the app bar.
        const docked = measure(dockedBar);
        const x = second
          ? across(second.from, to, then)
          : cutOff
            ? across(from, from, 0)
            : fresh
              ? across(docked, docked, 0)
              : within(across(from, docked, first));
        box = { ...x, ...along(from, to, first) };
      }
      place(clone, box);

      if (!second) {
        // Docking, the rise starts from below the edge, out from under it.
        const ready = !toDocked || box.top >= edge - 0.5;
        if (elapsed >= settle || (elapsed >= delay && ready)) {
          second = { at: now, from: box };
        }
      } else if (elapsed >= settle && now - second.at >= settle) {
        clone.remove();
        if (flight === current) flight = null;
        tabs.flying.value = false;
        return;
      }
      current.raf = requestAnimationFrame(step);
    };
    current.raf = requestAnimationFrame(step);
  }

  /**
   * Docks a bar that was out of sight (scrolled past in one jump): there is
   * nothing to fly from, so the docked bar fades in.
   */
  function fadeIn(): void {
    cancelFlight();
    tabs.docked.value = true;
    const preset = getSearchMotionPreset(motion());
    tabs.dockedBar.value?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: preset.exitDuration / 2,
      easing: "linear",
    });
  }

  /** Puts the bar where it belongs for the current scroll position. */
  function update(animate: boolean): void {
    const pageBar = page.value;
    if (!pageBar) return;

    const rect = pageBar.getBoundingClientRect();
    const covered =
      rect.top < appBarBottom() + DOCK_AHEAD && window.scrollY >= DOCK_SCROLL;
    const wanted = covered && tabs.dockable.value;
    // Held under the app bar: its shelf is at the app bar and what follows
    // it in the page scrolls on underneath.
    const shelf = pageBar.parentElement;
    const top = shelf?.getBoundingClientRect();
    const after = shelf?.nextElementSibling?.getBoundingClientRect();
    tabs.stuck.value =
      !wanted &&
      !!top &&
      !!after &&
      top.top <= appBarBottom() + 0.5 &&
      after.top < top.bottom - 0.5;
    const current = flight ? flight.toDocked : tabs.docked.value;
    if (wanted === current) return;

    if (animate && !prefersReducedMotion()) {
      if (wanted && !flight && rect.bottom <= appBarBottom()) fadeIn();
      else fly(wanted);
    } else {
      cancelFlight();
      tabs.docked.value = wanted;
    }
  }

  function onScroll(): void {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      update(true);
    });
  }

  function onResize(): void {
    update(false);
  }

  // Without room in the app bar the bar is held under it once scrolled up
  // there; anchors and the table of contents keep clear of it then.
  watchEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle(
      "akari-tabs-pinned",
      !!page.value && !tabs.dockable.value,
    );
  });

  // The app bar reports whether the bar fits next to its title. Its first
  // report puts the bar in place; later ones move it there.
  watch(
    () => tabs.dockable.value,
    () => {
      update(measured);
      measured = true;
    },
  );

  // Where the page bar is as the route changes: read at once, since the
  // layout renders the next page before this component's watchers run.
  watch(
    () => route.path,
    () => {
      const bar = page.value;
      glideFrom =
        bar && !tabs.docked.value && !tabs.flying.value
          ? bar.getBoundingClientRect().top
          : null;
    },
    { flush: "sync" },
  );

  // A new page starts at the top with its bar in place, unless it is the
  // next page of the group with the bar docked (`tabs.carry`).
  watch(
    () => route.path,
    () => {
      if (!tabs.withinGroup.value) glideFrom = null;
      cancelFlight();
      if (!tabs.carry.value) {
        tabs.docked.value = false;
        tabs.stuck.value = false;
      }
    },
  );

  // After VitePress has scrolled the new page (it does so in the tick the
  // page renders in; this runs right after).
  onContentUpdated(() => {
    void nextTick(() => {
      if (tabs.carry.value) {
        tabs.carry.value = false;
        if (!location.hash) scrollToArticle();
        // A page too short to scroll that far brings the bar back.
        update(true);
        return;
      }

      update(false);
      if (glideFrom !== null && !tabs.docked.value) glide(glideFrom);
      glideFrom = null;
    });
  });

  onMounted(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update(false);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    if (frame) cancelAnimationFrame(frame);
    cancelFlight();
    tabs.docked.value = false;
    tabs.stuck.value = false;
    document.documentElement.classList.remove("akari-tabs-pinned");
  });
}
