<script setup lang="ts">
import { computed, ref } from "vue";

import { useAkariConfig } from "../../composables/useAkariConfig";
import { useLoadingBar } from "../../composables/useLoadingBar";

const config = useAkariConfig();
const bar = ref<HTMLElement | null>(null);
const { progress, visible, booting } = useLoadingBar(bar);
const percent = computed(() => Math.round(progress.value * 100));
</script>

<template>
  <div
    ref="bar"
    class="akari-loading-bar"
    role="progressbar"
    :aria-label="config.messages.loadingLabel"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="percent"
    :aria-hidden="visible ? undefined : 'true'"
    :data-visible="visible ? '' : undefined"
    :data-booting="booting ? '' : undefined"
  >
    <div
      class="akari-loading-bar__indicator"
      :style="{ transform: `scaleX(${progress})` }"
    ></div>
  </div>
</template>

<style scoped>
/*
 * An M3 linear progress indicator along the top edge of the window, over
 * the app bar: the active indicator only, without a track, so the idle
 * window shows nothing. It fades in and out; the indicator grows from the
 * start of the line.
 */
.akari-loading-bar {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 20;
  height: var(--akari-loading-bar-height, 4px);
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--md-sys-motion-spring-default-effects, 200ms cubic-bezier(0.34, 0.8, 0.34, 1));
}

.akari-loading-bar[data-visible] {
  opacity: 1;
}

.akari-loading-bar__indicator {
  height: 100%;
  border-start-end-radius: var(--md-sys-shape-corner-full, 9999px);
  border-end-end-radius: var(--md-sys-shape-corner-full, 9999px);
  background-color: var(--akari-loading-bar-color, var(--md-sys-color-primary));
  transform-origin: left center;
  transition: transform 250ms var(--md-sys-motion-easing-standard-decelerate, cubic-bezier(0, 0, 0, 1));
}

/* Right to left, also when the reader chose it (`:dir()` builds to `:lang()`). */
:root[dir="rtl"] .akari-loading-bar__indicator {
  transform-origin: right center;
}

/*
 * Before the page's scripts run, nothing drives the bar: as rendered on the
 * server, it shows once they take longer than the delay the script uses,
 * and creeps on its own. Without scripts, akariHead hides it.
 */
.akari-loading-bar[data-booting] {
  animation: akari-loading-bar-show 1ms 150ms forwards;
}

.akari-loading-bar[data-booting] .akari-loading-bar__indicator {
  animation: akari-loading-bar-boot 12s cubic-bezier(0.1, 0.6, 0.3, 1) forwards;
}

@keyframes akari-loading-bar-show {
  to {
    opacity: 1;
  }
}

@keyframes akari-loading-bar-boot {
  from {
    transform: scaleX(0.05);
  }

  to {
    transform: scaleX(0.6);
  }
}

@keyframes akari-loading-bar-still {
  to {
    transform: scaleX(0.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .akari-loading-bar,
  .akari-loading-bar__indicator {
    transition: none;
  }

  .akari-loading-bar[data-booting] .akari-loading-bar__indicator {
    animation: akari-loading-bar-still 1ms forwards;
  }
}

@media (forced-colors: active) {
  .akari-loading-bar__indicator {
    background-color: Highlight;
  }
}
</style>
