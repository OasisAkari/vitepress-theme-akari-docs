<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { withBase } from "vitepress";

import { useM3eConfig } from "../../composables/useM3eConfig";
import type { M3eSearchResult } from "../../types";
import { splitHighlight } from "../highlight";
import { useM3eSearch } from "../useSearch";

interface DialogElement extends HTMLElement {
  open: boolean;
  show(): Promise<void>;
  hide(): Promise<void>;
}

const config = useM3eConfig();
const {
  isOpen,
  query,
  results,
  loading,
  error,
  activeIndex,
  setQuery,
  finalizeClose,
  retry,
  handleInputKeydown,
  selectResult,
} = useM3eSearch();

const dialog = ref<DialogElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const resultElements = ref<Array<HTMLElement | null>>([]);

const hasQuery = computed(() => !!query.value.trim());

function focusInput(): void {
  requestAnimationFrame(() => input.value?.focus());
}

function onInput(event: Event): void {
  setQuery((event.target as HTMLInputElement).value);
}

function onDialogClosed(): void {
  finalizeClose();
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

async function syncDialogOpen(open: boolean): Promise<void> {
  if (typeof customElements === "undefined") return;

  await customElements.whenDefined("m3e-dialog");
  await nextTick();

  const element = dialog.value;
  if (!element) return;

  if (open) {
    await element.show();
    await nextTick();
    window.setTimeout(focusInput, 50);
  } else {
    await element.hide();
  }
}

watch(
  isOpen,
  (open) => void syncDialogOpen(open),
  { flush: "post" },
);

watch(activeIndex, async (index) => {
  await nextTick();
  resultElements.value[index]?.scrollIntoView({ block: "nearest" });
});
</script>

<template>
  <m3e-dialog
    ref="dialog"
    class="m3e-search-dialog"
    dismissible
    close-label="关闭搜索"
    @opened="focusInput"
    @closed="onDialogClosed"
  >
    <m3e-search-bar slot="header" class="m3e-search-dialog__bar">
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
  </m3e-dialog>
</template>
