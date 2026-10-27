<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import { withBase } from "vitepress";

import { useM3eConfig } from "../../composables/useM3eConfig";
import { useM3eSettings } from "../../composables/useSettings";
import type { M3eSearchResult } from "../../types";
import {
  getSearchMotionPreset,
  prefersReducedMotion,
} from "../animation";
import { splitHighlight } from "../highlight";
import { useM3eSearch } from "../useSearch";

const config = useM3eConfig();
const { settings } = useM3eSettings();
const {
  isOpen,
  query,
  results,
  loading,
  error,
  activeIndex,
  closeSearch,
  finalizeClose,
  getTriggerRect,
  setQuery,
  retry,
  handleInputKeydown,
  selectResult,
} = useM3eSearch();

const dialog = ref<HTMLDialogElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const scrim = ref<HTMLElement | null>(null);
const ghostHost = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const resultElements = ref<Array<HTMLElement | null>>([]);

let animationToken = 0;
let animations: Animation[] = [];
let hiddenTrigger: HTMLElement | null = null;
let hiddenTriggerVisibility = "";

const hasQuery = computed(() => !!query.value.trim());

function focusInput(): void {
  requestAnimationFrame(() => input.value?.focus({ preventScroll: true }));
}

function cancelAnimations(): void {
  animationToken += 1;
  for (const animation of animations) animation.cancel();
  animations = [];
}

function removeGhost(): void {
  ghostHost.value?.replaceChildren();
}

function hideTrigger(): void {
  const source = document.querySelector<HTMLElement>(".m3e-search-trigger");
  if (!source || hiddenTrigger) return;

  hiddenTrigger = source;
  hiddenTriggerVisibility = source.style.visibility;
  source.style.visibility = "hidden";
}

function restoreTrigger(): void {
  if (!hiddenTrigger) return;

  hiddenTrigger.style.visibility = hiddenTriggerVisibility;
  hiddenTrigger = null;
}

interface GhostOptions {
  rect: DOMRect;
  mode: "open" | "close";
  sourceStyle?: CSSStyleDeclaration;
  panelStyle?: CSSStyleDeclaration;
}

function createGhost({
  rect,
  mode,
  sourceStyle,
  panelStyle,
}: GhostOptions): HTMLElement | null {
  removeGhost();

  const host = ghostHost.value;
  const source = document.querySelector<HTMLElement>(".m3e-search-trigger");
  if (!host || !source || !rect.width || !rect.height) return null;

  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
  clone.removeAttribute("id");
  clone.setAttribute("aria-hidden", "true");
  clone.tabIndex = -1;
  clone.style.position = "fixed";
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.margin = "0";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "2";
  clone.style.opacity = "1";
  clone.style.visibility = "visible";
  clone.style.transform = "none";
  clone.style.boxSizing = "border-box";
  clone.style.overflow = "hidden";
  clone.style.transition = "none";
  clone.style.color = sourceStyle?.color ?? clone.style.color;

  if (mode === "close") {
    Array.from(clone.children).forEach((child) => {
      (child as HTMLElement).style.opacity = "0";
    });
    clone.style.backgroundColor = panelStyle?.backgroundColor ?? "";
    clone.style.borderColor = "transparent";
    clone.style.borderWidth = "0px";
    clone.style.borderStyle = "solid";
    clone.style.borderRadius = panelStyle?.borderTopLeftRadius || "28px";
    clone.style.boxShadow = panelStyle?.boxShadow ?? "none";
  } else {
    clone.style.backgroundColor = sourceStyle?.backgroundColor ?? "";
    clone.style.borderColor = sourceStyle?.borderTopColor ?? "";
    clone.style.borderWidth = sourceStyle?.borderTopWidth ?? "1px";
    clone.style.borderStyle = "solid";
    clone.style.borderRadius = `${rect.height / 2}px`;
    clone.style.boxShadow = sourceStyle?.boxShadow ?? "none";
  }

  host.replaceChildren(clone);
  return clone;
}

interface GhostSurface {
  rect: DOMRect;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  backgroundColor: string;
  boxShadow: string;
}

interface GhostExitOptions {
  ghost: HTMLElement;
  start: GhostSurface;
  triggerRect: DOMRect;
  sourceStyle?: CSSStyleDeclaration;
  scrim: HTMLElement;
  scrimOpacity: number;
  preset: ReturnType<typeof getSearchMotionPreset>;
}

interface GhostExit {
  geometry: Animation;
  scrim: Animation;
}

interface SurfaceTarget {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ArrivalWatcher {
  promise: Promise<void>;
  cancel(): void;
}

function waitForArrival(
  surface: HTMLElement,
  target: SurfaceTarget,
  tolerance: number,
  token: number,
): ArrivalWatcher {
  let frame = 0;
  let settled = false;
  let resolveArrival: () => void = () => {};

  const promise = new Promise<void>((resolve) => {
    resolveArrival = resolve;
  });

  function stop(): void {
    if (settled) return;
    settled = true;
    if (frame) cancelAnimationFrame(frame);
    resolveArrival();
  }

  function tick(): void {
    if (settled) return;
    frame = 0;

    if (token !== animationToken || !surface.isConnected) {
      stop();
      return;
    }

    const current = surface.getBoundingClientRect();
    if (
      Math.abs(current.left - target.left) <= tolerance &&
      Math.abs(current.top - target.top) <= tolerance &&
      Math.abs(current.width - target.width) <= tolerance &&
      Math.abs(current.height - target.height) <= tolerance
    ) {
      stop();
      return;
    }

    frame = requestAnimationFrame(tick);
  }

  frame = requestAnimationFrame(tick);
  return { promise, cancel: stop };
}

function applyGhostSurface(ghost: HTMLElement, surface: GhostSurface): void {
  ghost.style.left = `${surface.rect.left}px`;
  ghost.style.top = `${surface.rect.top}px`;
  ghost.style.width = `${surface.rect.width}px`;
  ghost.style.height = `${surface.rect.height}px`;
  ghost.style.borderRadius = surface.borderRadius;
  ghost.style.borderWidth = surface.borderWidth;
  ghost.style.borderColor = surface.borderColor;
  ghost.style.backgroundColor = surface.backgroundColor;
  ghost.style.boxShadow = surface.boxShadow;
}

function animateGhostExit({
  ghost,
  start,
  triggerRect,
  sourceStyle,
  scrim,
  scrimOpacity,
  preset,
}: GhostExitOptions): GhostExit {
  const geometryAnimation = ghost.animate(
    [
      {
        left: `${start.rect.left}px`,
        top: `${start.rect.top}px`,
        width: `${start.rect.width}px`,
        height: `${start.rect.height}px`,
        borderRadius: start.borderRadius,
        borderWidth: start.borderWidth,
        borderColor: start.borderColor,
        backgroundColor: start.backgroundColor,
        boxShadow: start.boxShadow,
      },
      {
        left: `${triggerRect.left}px`,
        top: `${triggerRect.top}px`,
        width: `${triggerRect.width}px`,
        height: `${triggerRect.height}px`,
        borderRadius: `${triggerRect.height / 2}px`,
        borderWidth: sourceStyle?.borderTopWidth ?? "1px",
        borderColor: sourceStyle?.borderTopColor ?? "transparent",
        backgroundColor: sourceStyle?.backgroundColor ?? "transparent",
        boxShadow: sourceStyle?.boxShadow ?? "none",
      },
    ],
    {
      duration: preset.duration,
      easing: preset.easing,
      fill: "both",
    },
  );

  const scrimAnimation = scrim.animate(
    [{ opacity: scrimOpacity }, { opacity: 0 }],
    {
      duration: preset.scrimDuration,
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      fill: "both",
    },
  );

  return { geometry: geometryAnimation, scrim: scrimAnimation };
}

function resetDialogStyles(): void {
  const panelElement = panel.value;
  const contentElement = content.value;
  const scrimElement = scrim.value;

  if (panelElement) {
    panelElement.style.visibility = "hidden";
    panelElement.style.transform = "none";
  }

  if (contentElement) {
    contentElement.style.opacity = "1";
    contentElement.style.transform = "none";
    contentElement.style.pointerEvents = "";
    contentElement.inert = false;
  }

  if (scrimElement) scrimElement.style.opacity = "0";
  if (input.value) input.value.tabIndex = 0;
  removeGhost();
  restoreTrigger();
}

async function openDialog(): Promise<void> {
  const dialogElement = dialog.value;
  const panelElement = panel.value;
  const scrimElement = scrim.value;
  const contentElement = content.value;

  if (!dialogElement || !panelElement || !scrimElement || !contentElement) {
    return;
  }

  cancelAnimations();
  removeGhost();
  const token = animationToken;

  panelElement.style.visibility = "hidden";
  panelElement.style.transform = "none";
  contentElement.style.opacity = "0";
  contentElement.style.transform = "translateY(6px)";
  contentElement.style.pointerEvents = "none";
  contentElement.inert = true;
  scrimElement.style.opacity = "0";
  if (input.value) input.value.tabIndex = -1;

  if (!dialogElement.open) dialogElement.showModal();
  dialogElement.focus({ preventScroll: true });

  await nextTick();

  const panelRect = panelElement.getBoundingClientRect();
  const triggerRect = getTriggerRect();

  function showInstant(): void {
    const panelEl = panelElement;
    const contentEl = contentElement;
    const scrimEl = scrimElement;

    if (!panelEl || !contentEl || !scrimEl) return;

    panelEl.style.visibility = "visible";
    panelEl.style.transform = "none";
    contentEl.style.opacity = "1";
    contentEl.style.transform = "none";
    contentEl.style.pointerEvents = "";
    contentEl.inert = false;
    scrimEl.style.opacity = "1";
    panelEl.focus({ preventScroll: true });
    if (input.value) input.value.tabIndex = 0;
    focusInput();
  }


  if (prefersReducedMotion() || !triggerRect) {
    showInstant();
    return;
  }

  const source = document.querySelector<HTMLElement>(".m3e-search-trigger");
  const sourceStyle = source ? getComputedStyle(source) : undefined;
  const panelStyle = getComputedStyle(panelElement);
  const preset = getSearchMotionPreset(settings.motion);
  const ghost = createGhost({
    rect: triggerRect,
    mode: "open",
    sourceStyle,
    panelStyle,
  });

  if (!ghost) {
    showInstant();
    return;
  }

  hideTrigger();

  await new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  );
  if (token !== animationToken) return;

  const geometryAnimation = ghost.animate(
    [
      {
        left: `${triggerRect.left}px`,
        top: `${triggerRect.top}px`,
        width: `${triggerRect.width}px`,
        height: `${triggerRect.height}px`,
        borderRadius: `${triggerRect.height / 2}px`,
        borderWidth: sourceStyle?.borderTopWidth ?? "1px",
        borderColor: sourceStyle?.borderTopColor ?? "transparent",
        backgroundColor: sourceStyle?.backgroundColor ?? "transparent",
        boxShadow: sourceStyle?.boxShadow ?? "none",
      },
      {
        left: `${panelRect.left}px`,
        top: `${panelRect.top}px`,
        width: `${panelRect.width}px`,
        height: `${panelRect.height}px`,
        borderRadius: panelStyle.borderTopLeftRadius || "28px",
        borderWidth: "0px",
        borderColor: "transparent",
        backgroundColor: panelStyle.backgroundColor,
        boxShadow: panelStyle.boxShadow,
      },
    ],
    {
      duration: preset.duration,
      easing: preset.easing,
      fill: "both",
    },
  );

  const childAnimations = Array.from(ghost.children).map((child) =>
    (child as HTMLElement).animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: preset.duration * 0.35,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
        fill: "both",
      },
    ),
  );

  const scrimAnimation = scrimElement.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    {
      duration: preset.scrimDuration,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
      fill: "both",
    },
  );

  animations = [geometryAnimation, ...childAnimations, scrimAnimation];

  // Reveal the dialog content while the surface is still settling so the
  // blank surface never sits at the center waiting for the clock.
  const arrival = waitForArrival(ghost, panelRect, 8, token);
  await Promise.race([
    arrival.promise,
    geometryAnimation.finished.catch(() => {}),
  ]);
  arrival.cancel();
  if (token !== animationToken) return;

  scrimElement.style.opacity = "1";
  panelElement.style.visibility = "visible";
  panelElement.style.transform = "none";
  contentElement.style.opacity = "0";
  contentElement.style.transform = "translateY(6px)";
  contentElement.style.pointerEvents = "";
  contentElement.inert = false;
  if (input.value) input.value.tabIndex = 0;
  panelElement.focus({ preventScroll: true });
  focusInput();

  const ghostFade = ghost.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    {
      duration: Math.max(120, preset.duration * 0.3),
      easing: "cubic-bezier(0.2, 0, 0, 1)",
      fill: "both",
    },
  );

  const contentAnimation = contentElement.animate(
    [
      { opacity: 0, transform: "translateY(6px)" },
      { opacity: 1, transform: "none" },
    ],
    {
      duration: preset.contentDuration,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
      fill: "both",
    },
  );

  animations = [
    geometryAnimation,
    ...childAnimations,
    scrimAnimation,
    ghostFade,
    contentAnimation,
  ];

  await Promise.allSettled([
    ghostFade.finished,
    contentAnimation.finished,
  ]);
  if (token !== animationToken) return;

  removeGhost();
  scrimElement.style.opacity = "1";
  panelElement.style.visibility = "visible";
  contentElement.style.opacity = "1";
  contentElement.style.transform = "none";
  contentElement.style.pointerEvents = "";
  contentElement.inert = false;

  for (const animation of animations) animation.cancel();
  animations = [];

  if (input.value) input.value.tabIndex = 0;
}

async function closeDialog(): Promise<void> {
  const dialogElement = dialog.value;
  const panelElement = panel.value;
  const scrimElement = scrim.value;
  const contentElement = content.value;

  if (!dialogElement?.open) {
    resetDialogStyles();
    finalizeClose();
    return;
  }

  const panelVisible =
    !!panelElement && getComputedStyle(panelElement).visibility !== "hidden";
  const candidate = ghostHost.value?.firstElementChild;
  const existingGhost =
    !panelVisible && candidate instanceof HTMLElement ? candidate : null;

  let ghostStart: GhostSurface | null = null;
  const childOpacities: number[] = [];

  if (existingGhost) {
    const rect = existingGhost.getBoundingClientRect();
    const style = getComputedStyle(existingGhost);

    ghostStart = {
      rect,
      borderRadius: style.borderTopLeftRadius,
      borderWidth: style.borderTopWidth,
      borderColor: style.borderTopColor,
      backgroundColor: style.backgroundColor,
      boxShadow: style.boxShadow,
    };

    for (const child of Array.from(existingGhost.children)) {
      childOpacities.push(Number.parseFloat(getComputedStyle(child).opacity));
    }
  }

  const contentStyle =
    panelVisible && contentElement ? getComputedStyle(contentElement) : null;
  const contentOpacity = contentStyle
    ? Number.parseFloat(contentStyle.opacity)
    : 1;
  const contentTransform = contentStyle?.transform ?? "none";
  const scrimOpacity = scrimElement
    ? Number.parseFloat(getComputedStyle(scrimElement).opacity)
    : 1;

  cancelAnimations();
  const token = animationToken;

  const triggerRect = getTriggerRect();

  if (
    prefersReducedMotion() ||
    !panelElement ||
    !contentElement ||
    !scrimElement ||
    !triggerRect
  ) {
    dialogElement.close();
    resetDialogStyles();
    finalizeClose();
    return;
  }

  // The opening surface never left the trigger; nothing worth animating.
  if (
    ghostStart &&
    Math.abs(ghostStart.rect.left - triggerRect.left) < 1 &&
    Math.abs(ghostStart.rect.top - triggerRect.top) < 1 &&
    Math.abs(ghostStart.rect.width - triggerRect.width) < 1 &&
    Math.abs(ghostStart.rect.height - triggerRect.height) < 1
  ) {
    dialogElement.close();
    resetDialogStyles();
    finalizeClose();
    return;
  }

  const panelRect = panelElement.getBoundingClientRect();
  const source = document.querySelector<HTMLElement>(".m3e-search-trigger");
  const sourceStyle = source ? getComputedStyle(source) : undefined;
  const preset = getSearchMotionPreset(settings.motion);

  hideTrigger();

  const dialogEl = dialogElement;
  const targetRect: DOMRect = triggerRect;
  const scrimEl: HTMLElement = scrimElement;

  function finish(): void {
    for (const animation of animations) animation.cancel();
    animations = [];
    dialogEl.close();
    resetDialogStyles();
    finalizeClose();
  }

  async function playExit(
    ghost: HTMLElement,
    start: GhostSurface,
    initialChildOpacities: number[],
  ): Promise<void> {
    const exit = animateGhostExit({
      ghost,
      start,
      triggerRect: targetRect,
      sourceStyle,
      scrim: scrimEl,
      scrimOpacity,
      preset,
    });

    const childFadeOut: Animation[] = [];
    initialChildOpacities.forEach((opacity, index) => {
      const child = ghost.children[index] as HTMLElement | undefined;
      if (!child || opacity <= 0.01) return;

      childFadeOut.push(
        child.animate([{ opacity }, { opacity: 0 }], {
          duration: 80,
          easing: "cubic-bezier(0.4, 0, 1, 1)",
          fill: "both",
        }),
      );
    });

    animations = [exit.geometry, exit.scrim, ...childFadeOut];

    // Bring the button contents back as the surface lands on the trigger,
    // not after the full geometric motion has run out.
    const arrival = waitForArrival(ghost, targetRect, 8, token);
    await Promise.race([
      arrival.promise,
      exit.geometry.finished.catch(() => {}),
    ]);
    arrival.cancel();
    if (token !== animationToken) return;

    const revealDuration = Math.max(
      80,
      Math.min(120, preset.duration * 0.24),
    );
    const childFadeIn = Array.from(ghost.children).map((child) => {
      const from = Number.parseFloat(getComputedStyle(child).opacity);
      return (child as HTMLElement).animate(
        [{ opacity: from }, { opacity: 1 }],
        {
          duration: revealDuration,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          fill: "both",
        },
      );
    });

    animations = [
      exit.geometry,
      exit.scrim,
      ...childFadeOut,
      ...childFadeIn,
    ];

    // Let the spatial motion fully settle before removing the ghost; the
    // expressive curve overshoots the trigger and would snap on early exit.
    await Promise.allSettled([
      exit.geometry.finished,
      exit.scrim.finished,
      ...childFadeIn.map((animation) => animation.finished),
    ]);
    if (token !== animationToken) return;

    finish();
  }

  if (existingGhost && ghostStart) {
    // cancelAnimations() reverted the WAAPI styles; reapply the captured
    // mid-flight surface so the return trip continues without a jump.
    applyGhostSurface(existingGhost, ghostStart);
    for (let index = 0; index < existingGhost.children.length; index += 1) {
      const child = existingGhost.children[index] as HTMLElement;
      child.style.opacity = `${childOpacities[index] ?? 0}`;
    }
    existingGhost.style.visibility = "visible";
    scrimEl.style.opacity = `${scrimOpacity}`;
    dialogEl.focus({ preventScroll: true });

    await playExit(existingGhost, ghostStart, childOpacities);
    return;
  }

  const panelStyle = getComputedStyle(panelElement);
  const ghost = createGhost({
    rect: panelRect,
    mode: "close",
    sourceStyle,
    panelStyle,
  });

  if (!ghost) {
    finish();
    return;
  }

  ghost.style.visibility = "hidden";

  const fadeDuration = Math.min(100, preset.duration * 0.3);
  const contentAnimation = contentElement.animate(
    [
      { opacity: contentOpacity, transform: contentTransform },
      { opacity: 0, transform: "translateY(6px)" },
    ],
    {
      duration: fadeDuration,
      easing: "cubic-bezier(0.4, 0, 1, 1)",
      fill: "both",
    },
  );

  animations = [contentAnimation];
  await contentAnimation.finished.catch(() => {});
  if (token !== animationToken) return;

  contentAnimation.cancel();
  animations = [];

  contentElement.style.opacity = "0";
  contentElement.style.transform = "translateY(6px)";
  contentElement.style.pointerEvents = "none";
  contentElement.inert = true;
  panelElement.style.visibility = "hidden";
  ghost.style.visibility = "visible";
  dialogEl.focus({ preventScroll: true });

  const start: GhostSurface = {
    rect: panelRect,
    borderRadius: panelStyle.borderTopLeftRadius || "28px",
    borderWidth: "0px",
    borderColor: "transparent",
    backgroundColor: panelStyle.backgroundColor,
    boxShadow: panelStyle.boxShadow,
  };

  await playExit(
    ghost,
    start,
    Array.from(ghost.children).map(() => 0),
  );
}

watch(
  isOpen,
  (open) => {
    if (open) void openDialog();
    else void closeDialog();
  },
  { flush: "post" },
);

watch(activeIndex, async (index) => {
  await nextTick();
  resultElements.value[index]?.scrollIntoView({ block: "nearest" });
});

onUnmounted(() => {
  cancelAnimations();
  removeGhost();
  restoreTrigger();
  if (dialog.value?.open) dialog.value.close();
});

function onInput(event: Event): void {
  setQuery((event.target as HTMLInputElement).value);
}

function onResultClick(event: MouseEvent, result: M3eSearchResult): void {
  event.preventDefault();
  selectResult(result);
}

function setResultRef(element: unknown, index: number): void {
  resultElements.value[index] =
    element instanceof HTMLElement ? element : null;
}

function hrefFor(result: M3eSearchResult): string {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(result.href)
    ? result.href
    : withBase(result.href);
}

function parts(text: string | undefined) {
  return splitHighlight(text ?? "", query.value);
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m3e-search-dialog"
    tabindex="-1"
    aria-label="搜索文档"
    @cancel.prevent="closeSearch"
  >
    <div
      ref="scrim"
      class="m3e-search-dialog__scrim"
      @click="closeSearch"
    ></div>

    <section
      ref="panel"
      class="m3e-search-dialog__panel"
      tabindex="-1"
      @click.stop
    >
      <div ref="content" class="m3e-search-dialog__content">
        <header class="m3e-search-dialog__header">
          <m3e-search-bar class="m3e-search-dialog__bar">
            <m3e-icon slot="leading" name="search"></m3e-icon>
            <input
              id="m3e-search-input"
              ref="input"
              slot="input"
              class="m3e-search-dialog__input"
              type="search"
              name="q"
              role="searchbox"
              :value="query"
              :placeholder="config.search.placeholder"
              aria-label="搜索文档"
              autocomplete="off"
              spellcheck="false"
              @input="onInput"
              @keydown="handleInputKeydown"
            />
          </m3e-search-bar>

          <m3e-icon-button
            class="m3e-search-dialog__close"
            aria-label="关闭搜索"
            @click="closeSearch"
          >
            <m3e-icon name="close"></m3e-icon>
          </m3e-icon-button>
        </header>

        <div class="m3e-search-dialog__body">
          <div v-if="!hasQuery" class="m3e-search-state">
            <m3e-icon class="m3e-search-state__icon" name="search"></m3e-icon>
            <h2>搜索文档</h2>
            <p>输入页面标题、组件名或正文关键词。</p>
            <p v-if="config.search.shortcut" class="m3e-search-state__hint">
              使用 <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>K</kbd> 随时打开
            </p>
          </div>

          <div
            v-else-if="loading"
            class="m3e-search-state"
            aria-live="polite"
          >
            <m3e-loading-indicator></m3e-loading-indicator>
            <p>正在搜索…</p>
          </div>

          <div
            v-else-if="error"
            class="m3e-search-state m3e-search-state--error"
            role="alert"
          >
            <m3e-icon class="m3e-search-state__icon" name="error"></m3e-icon>
            <h2>搜索暂时不可用</h2>
            <p>{{ error }}</p>
            <m3e-button variant="tonal" @click="retry">重试</m3e-button>
          </div>

          <div v-else-if="!results.length" class="m3e-search-state">
            <m3e-icon
              class="m3e-search-state__icon"
              name="search_off"
            ></m3e-icon>
            <h2>没有找到结果</h2>
            <p>尝试更短的关键词，或检查搜索后端配置。</p>
          </div>

          <template v-else>
            <div class="m3e-search-dialog__summary" aria-live="polite">
              {{ results.length }} 个结果
            </div>

            <m3e-list
              id="m3e-search-results"
              class="m3e-search-dialog__results"
              aria-label="搜索结果"
            >
              <m3e-list-action
                v-for="(result, index) in results"
                :key="result.id"
                :ref="(element: unknown) => setResultRef(element, index)"
                :href="hrefFor(result)"
                class="m3e-search-result"
                :class="{ 'is-active': index === activeIndex }"
                @click="onResultClick($event, result)"
                @mouseenter="activeIndex = index"
              >
                <m3e-icon slot="leading" name="article"></m3e-icon>
                <span slot="overline" class="m3e-search-result__overline">
                  {{ result.heading ? result.pageTitle : "文档" }}
                </span>
                <span class="m3e-search-result__title">
                  <template
                    v-for="(part, partIndex) in parts(result.title)"
                    :key="partIndex"
                  >
                    <mark v-if="part.match">{{ part.text }}</mark>
                    <template v-else>{{ part.text }}</template>
                  </template>
                </span>
                <span
                  v-if="result.excerpt"
                  slot="supporting-text"
                  class="m3e-search-result__excerpt"
                >
                  <template
                    v-for="(part, partIndex) in parts(result.excerpt)"
                    :key="partIndex"
                  >
                    <mark v-if="part.match">{{ part.text }}</mark>
                    <template v-else>{{ part.text }}</template>
                  </template>
                </span>
              </m3e-list-action>
            </m3e-list>

            <div class="m3e-search-dialog__footer">
              <span>{{ results.length }} 个结果</span>
              <span class="m3e-search-dialog__hints">
                <kbd>↑</kbd>
                <kbd>↓</kbd>
                <span>选择</span>
                <kbd>Enter</kbd>
                <span>打开</span>
                <kbd>Esc</kbd>
                <span>关闭</span>
              </span>
            </div>
          </template>
        </div>
      </div>
    </section>

    <div
      ref="ghostHost"
      class="m3e-search-dialog__ghost"
      aria-hidden="true"
    ></div>
  </dialog>
</template>
