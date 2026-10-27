<script setup lang="ts">
import { computed } from "vue";
import { useRouter, withBase } from "vitepress";

import { useM3eConfig } from "../../composables/useM3eConfig";
import { useSidebar } from "../../composables/useSidebar";

const config = useM3eConfig();
const { prevNext } = useSidebar();
const router = useRouter();

const prev = computed(() => prevNext.value.prev);
const next = computed(() => prevNext.value.next);

const prevHref = computed(() =>
  prev.value?.link ? withBase(prev.value.link) : undefined,
);
const nextHref = computed(() =>
  next.value?.link ? withBase(next.value.link) : undefined,
);

const showPrevNext = computed(
  () =>
    config.value.footer.showPrevNext &&
    !!(prevHref.value || nextHref.value),
);

const hasMeta = computed(
  () =>
    !!config.value.footer.message || !!config.value.footer.copyright,
);

const hasContent = computed(() => showPrevNext.value || hasMeta.value);

/**
 * Mirrors the SPA semantics of VitePress' built-in link handling: plain
 * left-clicks are routed in place, while modified clicks keep native anchor
 * behavior (new tab / new window).
 */
function navigate(href: string | undefined, event: Event): void {
  if (!href) return;

  if (event instanceof MouseEvent) {
    const modified =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;

    if (modified) return;
  }

  event.preventDefault();
  void router.go(href);
}
</script>

<template>
  <footer v-if="hasContent" class="m3e-doc-footer">
    <m3e-divider />

    <nav
      v-if="showPrevNext"
      class="m3e-doc-footer__nav"
      aria-label="文档翻页"
    >
      <div class="m3e-doc-footer__pager m3e-doc-footer__pager--prev">
        <m3e-button
          v-if="prev?.link"
          variant="text"
          :href="prevHref"
          @click="navigate(prevHref, $event)"
        >
          <m3e-icon slot="icon" name="arrow_back" aria-hidden="true" />
          <span class="m3e-doc-footer__button-text">
            <span class="m3e-doc-footer__direction">上一页</span>
            <span class="m3e-doc-footer__title">{{ prev.text }}</span>
          </span>
        </m3e-button>
      </div>

      <div class="m3e-doc-footer__pager m3e-doc-footer__pager--next">
        <m3e-button
          v-if="next?.link"
          variant="text"
          :href="nextHref"
          @click="navigate(nextHref, $event)"
        >
          <span class="m3e-doc-footer__button-text">
            <span class="m3e-doc-footer__direction">下一页</span>
            <span class="m3e-doc-footer__title">{{ next.text }}</span>
          </span>
          <m3e-icon
            slot="trailing-icon"
            name="arrow_forward"
            aria-hidden="true"
          />
        </m3e-button>
      </div>
    </nav>

    <div v-if="hasMeta" class="m3e-doc-footer__meta">
      <span v-if="config.footer.message" class="m3e-doc-footer__message">
        {{ config.footer.message }}
      </span>
      <span v-if="config.footer.copyright" class="m3e-doc-footer__copyright">
        {{ config.footer.copyright }}
      </span>
    </div>
  </footer>
</template>
