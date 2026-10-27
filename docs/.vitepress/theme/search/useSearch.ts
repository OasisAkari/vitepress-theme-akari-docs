import {
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  watch,
  type InjectionKey,
  type Ref,
} from "vue";
import { useData, useRouter, withBase } from "vitepress";

import type {
  M3eSearchResult,
  ResolvedM3eThemeConfig,
} from "../types";
import { createSearchBackend } from "./backends";

export interface M3eSearchApi {
  isOpen: Ref<boolean>;
  query: Ref<string>;
  results: Ref<M3eSearchResult[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  activeIndex: Ref<number>;
  openSearch(): void;
  closeSearch(): void;
  finalizeClose(): void;
  setQuery(value: string): void;
  retry(): void;
  handleInputKeydown(event: KeyboardEvent): void;
  selectResult(result: M3eSearchResult): void;
}

const searchKey: InjectionKey<M3eSearchApi> = Symbol("m3e-search");

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function isExternalHref(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

export function provideM3eSearch(
  config: ResolvedM3eThemeConfig,
): M3eSearchApi {
  const { site } = useData();
  const router = useRouter();
  const backend = createSearchBackend(config.search.backend, {
    base: site.value.base ?? "/",
  });

  const isOpen = ref(false);
  const query = ref("");
  const results = ref<M3eSearchResult[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const activeIndex = ref(-1);

  let timer: ReturnType<typeof setTimeout> | undefined;
  let controller: AbortController | undefined;
  let requestId = 0;
  let previousFocus: HTMLElement | null = null;

  function clearTimer(): void {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  }

  function abortRequest(): void {
    controller?.abort();
    controller = undefined;
    requestId += 1;
  }

  function resetResults(): void {
    results.value = [];
    activeIndex.value = -1;
    loading.value = false;
    error.value = null;
  }

  async function search(value: string): Promise<void> {
    const trimmed = value.trim();
    if (!trimmed) {
      resetResults();
      return;
    }

    abortRequest();
    const currentRequest = ++requestId;
    const currentController = new AbortController();
    controller = currentController;

    loading.value = true;
    error.value = null;

    try {
      const nextResults = await backend.search(trimmed, {
        limit: config.search.maxResults,
        signal: currentController.signal,
      });

      if (
        currentRequest !== requestId ||
        currentController.signal.aborted
      ) {
        return;
      }

      results.value = nextResults;
      activeIndex.value = nextResults.length ? 0 : -1;
    } catch (cause) {
      if (
        currentRequest !== requestId ||
        currentController.signal.aborted ||
        isAbortError(cause)
      ) {
        return;
      }

      results.value = [];
      activeIndex.value = -1;
      error.value =
        cause instanceof Error
          ? cause.message
          : "搜索失败，请稍后重试。";
    } finally {
      if (currentRequest === requestId) {
        loading.value = false;
      }
    }
  }

  function openSearch(): void {
    if (!config.search.enabled || isOpen.value) return;

    previousFocus =
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body
        ? document.activeElement
        : null;
    query.value = "";
    resetResults();
    isOpen.value = true;
  }

  function closeSearch(): void {
    clearTimer();
    abortRequest();
    isOpen.value = false;
  }

  function finalizeClose(): void {
    clearTimer();
    abortRequest();
    isOpen.value = false;
    query.value = "";
    resetResults();
    previousFocus?.focus({ preventScroll: true });
    previousFocus = null;
  }

  function setQuery(value: string): void {
    query.value = value;
  }

  function retry(): void {
    const value = query.value.trim();
    if (!value) return;

    clearTimer();
    void search(value);
  }

  function moveActive(delta: number): void {
    if (!results.value.length) return;

    const next = activeIndex.value + delta;
    activeIndex.value = Math.min(
      results.value.length - 1,
      Math.max(0, next < 0 ? results.value.length - 1 : next),
    );
  }

  function navigate(result: M3eSearchResult): void {
    if (isExternalHref(result.href)) {
      window.open(result.href, "_blank", "noopener,noreferrer");
      return;
    }

    void router.go(withBase(result.href));
  }

  function selectResult(result: M3eSearchResult): void {
    closeSearch();
    navigate(result);
  }

  function handleInputKeydown(event: KeyboardEvent): void {
    if (event.isComposing) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        if (results.value.length) {
          event.preventDefault();
          activeIndex.value = 0;
        }
        break;
      case "End":
        if (results.value.length) {
          event.preventDefault();
          activeIndex.value = results.value.length - 1;
        }
        break;
      case "Enter": {
        const result = results.value[activeIndex.value] ?? results.value[0];
        if (result) {
          event.preventDefault();
          selectResult(result);
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        closeSearch();
        break;
    }
  }

  function handleGlobalShortcut(event: KeyboardEvent): void {
    const shortcut = config.search.shortcut;
    if (
      !config.search.enabled ||
      !shortcut ||
      event.defaultPrevented ||
      event.altKey ||
      event.shiftKey ||
      !(event.metaKey || event.ctrlKey) ||
      event.key.toLowerCase() !== shortcut
    ) {
      return;
    }

    event.preventDefault();
    if (!isOpen.value) openSearch();
  }

  watch(query, (value) => {
    clearTimer();

    if (!isOpen.value) return;

    if (!value.trim()) {
      abortRequest();
      resetResults();
      return;
    }

    if (config.search.debounce <= 0) {
      void search(value);
      return;
    }

    timer = setTimeout(() => {
      timer = undefined;
      if (isOpen.value) void search(value);
    }, config.search.debounce);
  });

  onMounted(() => window.addEventListener("keydown", handleGlobalShortcut));
  onUnmounted(() => {
    window.removeEventListener("keydown", handleGlobalShortcut);
    clearTimer();
    abortRequest();
  });

  const api: M3eSearchApi = {
    isOpen,
    query,
    results,
    loading,
    error,
    activeIndex,
    openSearch,
    closeSearch,
    finalizeClose,
    setQuery,
    retry,
    handleInputKeydown,
    selectResult,
  };

  provide(searchKey, api);
  return api;
}

export function useM3eSearch(): M3eSearchApi {
  const api = inject(searchKey);

  if (!api) {
    throw new Error(
      "[vitepress-theme-m3e] useM3eSearch() must be called inside M3eLayout.",
    );
  }

  return api;
}
